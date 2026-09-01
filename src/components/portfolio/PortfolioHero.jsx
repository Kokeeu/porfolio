import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, layout } from '../../design/tokens';

const Marker = ({ children, dark = false }) => (
  <View style={[styles.marker, dark && styles.markerDark]}>
    <Text style={[styles.markerText, dark && styles.markerTextDark]}>{children}</Text>
  </View>
);

const wave = [5, 12, 8, 18, 10, 22, 14, 7, 17, 11, 20, 6];

function SignalSelector({ onWork, onContact, compact }) {
  const [active, setActive] = useState('work');
  const [trackWidth, setTrackWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isContact = active === 'contact';

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const toValue = isContact ? 1 : 0;
    if (reduceMotion) {
      position.setValue(toValue);
      return;
    }

    Animated.spring(position, {
      toValue,
      damping: 18,
      stiffness: 210,
      mass: 0.72,
      useNativeDriver: true,
    }).start();
  }, [isContact, position, reduceMotion]);

  const cursorX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth / 2],
  });

  const channelProps = (channel) => ({
    accessibilityRole: 'link',
    accessibilityState: { selected: active === channel },
    onFocus: () => setActive(channel),
    onHoverIn: () => setActive(channel),
    onPressIn: () => setActive(channel),
  });

  return (
    <View style={[styles.signalConsole, compact && styles.signalConsoleCompact]}>
      <View style={styles.signalHeader}>
        <Text style={styles.signalHeaderLabel}>ROUTE SELECTOR / MOVE CURSOR</Text>
        <View style={styles.waveform} accessibilityElementsHidden>
          {wave.map((height, index) => (
            <View
              key={index}
              style={[
                styles.waveBar,
                { height, backgroundColor: isContact ? colors.cyan : colors.acid },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.signalStatus, isContact && styles.signalStatusContact]}>
          {isContact ? 'MAIL_LINK / CHANNEL OPEN' : 'ARCHIVE_04 / SIGNAL LOCKED'}
        </Text>
      </View>

      <View
        style={styles.signalTrack}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        {trackWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.signalCursor,
              {
                width: trackWidth / 2,
                backgroundColor: isContact ? colors.cyan : colors.acid,
                transform: [{ translateX: cursorX }],
              },
            ]}
          >
            <View style={styles.cursorNotch} />
          </Animated.View>
        ) : null}

        <Pressable
          {...channelProps('work')}
          accessibilityLabel="Descender al archivo de proyectos"
          onPress={onWork}
          style={({ pressed }) => [styles.signalOption, pressed && styles.signalOptionPressed]}
        >
          <Text style={[styles.signalIndex, !isContact && styles.signalTextActive]}>01</Text>
          <View style={styles.signalOptionCopy}>
            <Text style={[styles.signalVerb, !isContact && styles.signalTextActive]}>DESCENDER</Text>
            <Text style={[styles.signalTarget, !isContact && styles.signalTextActive]}>ARCHIVO</Text>
          </View>
          <Text style={[styles.signalLaunch, !isContact && styles.signalTextActive]}>↓</Text>
        </Pressable>

        <Pressable
          {...channelProps('contact')}
          accessibilityLabel="Abrir un correo para contactar a Anderson"
          onPress={onContact}
          style={({ pressed }) => [styles.signalOption, styles.signalOptionSecond, pressed && styles.signalOptionPressed]}
        >
          <Text style={[styles.signalIndex, isContact && styles.signalTextActive]}>02</Text>
          <View style={styles.signalOptionCopy}>
            <Text style={[styles.signalVerb, isContact && styles.signalTextActive]}>TRANSMITIR</Text>
            <Text style={[styles.signalTarget, isContact && styles.signalTextActive]}>SEÑAL</Text>
          </View>
          <Text style={[styles.signalLaunch, isContact && styles.signalTextActive]}>↗</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function PortfolioHero({ compact, onWork, email }) {
  const sendEmail = () => Linking.openURL(`mailto:${email}`);

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
      <View style={styles.topbar}>
        <View style={styles.identity}>
          <View style={styles.monogram}><Text style={styles.monogramText}>AS</Text></View>
          <View>
            <Text style={styles.name}>ANDERSON SOLANO</Text>
            <Text style={styles.role}>CREATIVE FRONTEND / COSTA RICA</Text>
          </View>
        </View>

        {!compact ? (
          <View style={styles.navLinks}>
            <Pressable onPress={onWork} accessibilityRole="link"><Text style={styles.navLink}>01 / TRABAJO</Text></Pressable>
            <Pressable onPress={sendEmail} accessibilityRole="link"><Text style={styles.navLink}>02 / CONTACTO</Text></Pressable>
          </View>
        ) : null}

        <View style={styles.availability}>
          <View style={styles.statusDot} />
          <Text style={styles.availabilityText}>DISPONIBLE</Text>
        </View>
      </View>

      <View style={[styles.heroGrid, compact && styles.heroGridCompact]}>
        <View style={[styles.copy, compact && styles.copyCompact]}>
          <View style={styles.eyebrowRow}>
            <Marker>SYSTEM / 2026</Marker>
            <Text style={styles.coordinates}>09.93° N — 84.08° W</Text>
          </View>

          <View style={styles.titleBlock}>
            <Text style={[styles.title, compact && styles.titleCompact]}>INTERFACES</Text>
            <Text style={[styles.titleOutline, compact && styles.titleCompact]}>CON</Text>
            <View style={styles.titleLastLine}>
              <View style={styles.titleRule} />
              <Text style={[styles.titleAccent, compact && styles.titleCompact]}>FRECUENCIA.</Text>
            </View>
          </View>

          <View style={[styles.introRow, compact && styles.introRowCompact]}>
            <Text style={styles.intro}>
              Diseño y desarrollo productos digitales que se entienden rápido, se sienten vivos y no podrían confundirse con una plantilla.
            </Text>
            <Text style={styles.sideNote}>CLARIDAD{`\n`}× CARÁCTER{`\n`}× CÓDIGO</Text>
          </View>

          <SignalSelector onWork={onWork} onContact={sendEmail} compact={compact} />
        </View>

        <View style={[styles.visual, compact && styles.visualCompact]}>
          <Image
            source={require('../../../assets/editorial/prism-field.jpg')}
            style={styles.visualImage}
            resizeMode="cover"
            accessibilityLabel="Composición holográfica abstracta usada como pieza editorial"
          />
          <View style={styles.imageTint} />
          <View style={styles.visualTopline}>
            <Text style={styles.visualMeta}>SIGNAL_001.JPG</Text>
            <Text style={styles.visualMeta}>RGB / 2048</Text>
          </View>
          <View style={styles.scanline} />
          <View style={styles.visualSeal}>
            <Text style={styles.visualSealSmall}>BUILDING</Text>
            <Text style={styles.visualSealBig}>UI</Text>
            <Text style={styles.visualSealSmall}>WITH INTENT</Text>
          </View>
          <View style={styles.visualCaption}>
            <Marker dark>DESIGN ENGINEERING</Marker>
            <Text style={styles.captionText}>01 / MIRAR{`\n`}02 / ENTENDER{`\n`}03 / CONSTRUIR</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRail}>
        <Text style={styles.railText}>REACT NATIVE</Text>
        <Text style={styles.railStar}>✦</Text>
        <Text style={styles.railText}>WEB EXPERIENCES</Text>
        <Text style={styles.railStar}>✦</Text>
        <Text style={styles.railText}>PRODUCT THINKING</Text>
        {!compact ? <><Text style={styles.railStar}>✦</Text><Text style={styles.railText}>NO GENERIC OUTPUT</Text></> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: layout.max,
    minHeight: 790,
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: '#34343c',
  },
  shellCompact: { minHeight: 0 },
  topbar: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.gutter,
    borderBottomWidth: 1,
    borderBottomColor: '#34343c',
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  monogram: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.acid },
  monogramText: { color: colors.ink, fontFamily: fonts.display, fontSize: 15, fontWeight: '900' },
  name: { color: colors.paper, fontFamily: fonts.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  role: { marginTop: 4, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.8 },
  navLinks: { flexDirection: 'row', gap: 30 },
  navLink: { color: colors.paper, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.acid },
  availabilityText: { color: colors.acid, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  heroGrid: { minHeight: 650, flexDirection: 'row' },
  heroGridCompact: { flexDirection: 'column' },
  copy: { flex: 1.08, minWidth: 0, justifyContent: 'space-between', padding: 34 },
  copyCompact: { minHeight: 540, padding: layout.mobileGutter },
  eyebrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  marker: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, backgroundColor: colors.acid },
  markerDark: { backgroundColor: colors.ink },
  markerText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  markerTextDark: { color: colors.paper },
  coordinates: { color: colors.fog, fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.4 },
  titleBlock: { marginVertical: 32 },
  title: { color: colors.paper, fontFamily: fonts.display, fontSize: 80, fontWeight: '900', letterSpacing: -5, lineHeight: 77 },
  titleOutline: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: -5,
    lineHeight: 77,
    textShadowColor: colors.paper,
    textShadowOffset: { width: 1.5, height: 0 },
    textShadowRadius: 0,
  },
  titleAccent: { color: colors.acid, fontFamily: fonts.display, fontSize: 80, fontWeight: '900', letterSpacing: -5, lineHeight: 77 },
  titleCompact: { fontSize: 48, lineHeight: 48, letterSpacing: -3 },
  titleLastLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleRule: { width: 38, height: 5, backgroundColor: colors.violet },
  introRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 30 },
  introRowCompact: { flexDirection: 'column', alignItems: 'flex-start', gap: 18 },
  intro: { flex: 1, maxWidth: 510, color: '#d7d6dc', fontFamily: fonts.sans, fontSize: 17, lineHeight: 25 },
  sideNote: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, lineHeight: 14, letterSpacing: 1 },
  signalConsole: { width: '100%', maxWidth: 590, marginTop: 28 },
  signalConsoleCompact: { maxWidth: 560 },
  signalHeader: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#4a4952',
  },
  signalHeaderLabel: { color: colors.fog, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.8 },
  waveform: { flex: 1, height: 22, marginHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  waveBar: { width: 2 },
  signalStatus: { color: colors.acid, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.65, textAlign: 'right' },
  signalStatusContact: { color: colors.cyan },
  signalTrack: {
    minHeight: 76,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.paper,
  },
  signalCursor: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  cursorNotch: {
    position: 'absolute',
    right: -1,
    top: 0,
    width: 14,
    height: 14,
    borderTopWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 7,
    borderTopColor: colors.ink,
    borderRightColor: colors.ink,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  signalOption: {
    flex: 1,
    minWidth: 0,
    minHeight: 74,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
  },
  signalOptionSecond: { borderLeftWidth: 1, borderLeftColor: colors.paper },
  signalOptionPressed: { opacity: 0.72 },
  signalIndex: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', alignSelf: 'flex-start', marginTop: 18 },
  signalOptionCopy: { flex: 1 },
  signalVerb: { color: colors.fog, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 1.1 },
  signalTarget: { marginTop: 3, color: colors.paper, fontFamily: fonts.display, fontSize: 17, fontWeight: '900', letterSpacing: -0.4 },
  signalLaunch: { color: colors.paper, fontFamily: fonts.sans, fontSize: 19, fontWeight: '700' },
  signalTextActive: { color: colors.ink },
  visual: { flex: 0.92, minWidth: 0, position: 'relative', overflow: 'hidden', borderLeftWidth: 1, borderLeftColor: '#34343c' },
  visualCompact: { minHeight: 560, borderLeftWidth: 0, borderTopWidth: 1, borderTopColor: '#34343c' },
  visualImage: { width: '100%', height: '100%' },
  imageTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9, 6, 20, 0.12)' },
  visualTopline: { position: 'absolute', left: 18, right: 18, top: 17, flexDirection: 'row', justifyContent: 'space-between' },
  visualMeta: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  scanline: { position: 'absolute', left: 0, right: 0, top: '32%', height: 1, backgroundColor: colors.acid, opacity: 0.8 },
  visualSeal: { position: 'absolute', right: 24, top: 62, width: 108, height: 108, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.acid, transform: [{ rotate: '6deg' }] },
  visualSealSmall: { color: colors.ink, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.7 },
  visualSealBig: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 42, fontWeight: '900' },
  visualCaption: { position: 'absolute', left: 18, right: 18, bottom: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  captionText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, lineHeight: 13, fontWeight: '700', textAlign: 'right' },
  footerRail: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.ink },
  railText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  railStar: { color: colors.violet, fontSize: 13 },
});
