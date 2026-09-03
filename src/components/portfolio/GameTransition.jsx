import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts } from '../../design/tokens';

const TransitionContext = createContext({ navigate: () => {}, busy: false });

const BURST_SHAPE = Platform.OS === 'web'
  ? { clipPath: 'polygon(50% 0%, 59% 24%, 78% 7%, 75% 32%, 100% 28%, 80% 50%, 100% 72%, 74% 68%, 78% 94%, 58% 76%, 50% 100%, 42% 76%, 22% 94%, 26% 68%, 0% 72%, 20% 50%, 0% 28%, 25% 32%, 22% 7%, 41% 24%)' }
  : { borderRadius: 9999 };

export function GameTransitionProvider({ children }) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState('01');
  const reducedMotion = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { reducedMotion.current = value; });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { reducedMotion.current = value; });
    return () => {
      subscription?.remove();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const navigate = useCallback((href, options = {}) => {
    if (!href || busy) return;

    const method = options.replace ? 'replace' : 'push';
    if (reducedMotion.current) {
      router[method](href);
      return;
    }

    setLabel(options.label || 'GO');
    setBusy(true);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 360,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      router[method](href);
      timer.current = setTimeout(() => {
        Animated.timing(progress, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => setBusy(false));
      }, 40);
    });
  }, [busy, progress, router]);

  const value = useMemo(() => ({ navigate, busy }), [navigate, busy]);
  const size = Math.max(width, height) * 2.2;
  const outerScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.01, 1] });
  const middleScale = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.01, 0.01, 0.78] });
  const coreScale = progress.interpolate({ inputRange: [0, 0.38, 1], outputRange: [0.01, 0.01, 0.56] });
  const labelOpacity = progress.interpolate({ inputRange: [0, 0.2, 0.7, 1], outputRange: [0, 1, 1, 0] });

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {busy ? (
        <View pointerEvents="auto" accessibilityElementsHidden style={styles.overlay}>
          <Animated.View style={[styles.burst, BURST_SHAPE, { width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: colors.pink, transform: [{ scale: outerScale }, { rotate: '-8deg' }] }]} />
          <Animated.View style={[styles.burst, BURST_SHAPE, { width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: colors.blue, transform: [{ scale: middleScale }, { rotate: '11deg' }] }]} />
          <Animated.View style={[styles.burst, BURST_SHAPE, { width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, backgroundColor: colors.ink, transform: [{ scale: coreScale }, { rotate: '-4deg' }] }]} />
          <Animated.View style={[styles.labelWrap, { opacity: labelOpacity }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.subLabel}>LOADING ROUTE</Text>
          </Animated.View>
        </View>
      ) : null}
    </TransitionContext.Provider>
  );
}

export const useGameTransition = () => useContext(TransitionContext);

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  burst: { position: 'absolute', left: '50%', top: '50%' },
  labelWrap: { zIndex: 3, alignItems: 'center', transform: [{ rotate: '-4deg' }] },
  label: { color: colors.paper, fontFamily: fonts.display, fontSize: 92, lineHeight: 90, fontWeight: '900' },
  subLabel: { marginTop: 6, color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 2 },
});
