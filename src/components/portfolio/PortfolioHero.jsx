import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, layout } from '../../design/tokens';
import MascotSticker from './MascotSticker';

const menuItems = [
  { key: 'work', index: '01', label: 'MISIONES', eyebrow: 'CASOS SELECCIONADOS', description: 'Cuatro productos, cuatro problemas reales y las decisiones que les dieron forma.', icon: 'map-outline', accent: colors.pink, ink: colors.paper },
  { key: 'loadout', index: '02', label: 'LOADOUT + LAB', eyebrow: 'MÉTODO Y EXPERIMENTOS', description: 'Mi sistema de trabajo, herramientas y exploraciones visuales en una sola ruta.', icon: 'construct-outline', accent: colors.blue, ink: colors.paper },
  { key: 'profile', index: '03', label: 'PERFIL', eyebrow: 'PLAYER FILE', description: 'Quién soy, desde dónde trabajo y qué clase de experiencias quiero construir.', icon: 'person-outline', accent: colors.paper, ink: colors.ink },
  { key: 'contact', index: '04', label: 'CONTACTO', eyebrow: 'OPEN CHANNEL', description: 'Un canal directo para proyectos que necesitan criterio, carácter y código.', icon: 'paper-plane-outline', accent: colors.cyan, ink: colors.ink },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => subscription?.remove();
  }, []);

  return reduced;
}

function RouteMenu({ activeIndex, compact, mobile, onLaunch, onSelect, reduced }) {
  const focusRefs = useRef([]);
  const energies = useRef(menuItems.map((_, index) => new Animated.Value(index === 0 ? 1 : 0))).current;

  useEffect(() => {
    Animated.parallel(energies.map((energy, index) => Animated.spring(energy, {
      toValue: index === activeIndex ? 1 : 0,
      damping: 16,
      stiffness: 230,
      mass: 0.68,
      useNativeDriver: true,
    }))).start();
  }, [activeIndex, energies]);

  const moveSelection = (event, index) => {
    const key = event.nativeEvent?.key || event.key;
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
    event.preventDefault?.();
    const forward = key === 'ArrowDown' || key === 'ArrowRight';
    const nextIndex = (index + (forward ? 1 : -1) + menuItems.length) % menuItems.length;
    onSelect(nextIndex);
    focusRefs.current[nextIndex]?.focus?.();
  };

  return (
    <View accessibilityRole="menu" style={[styles.routeMenu, compact && styles.routeMenuCompact]}>
      {menuItems.map((item, index) => {
        const selected = index === activeIndex;
        const onRight = index > 1;
        const scale = energies[index].interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.1] });
        const translateX = energies[index].interpolate({ inputRange: [0, 1], outputRange: [0, onRight ? -16 : 16] });
        const foreground = selected ? item.ink : colors.paper;

        return (
          <View
            key={item.key}
            style={[
              styles.optionSlot,
              compact && styles.optionSlotCompact,
              !compact && styles[`optionPosition${index}`],
            ]}
          >
            <Animated.View style={{ transform: reduced ? [] : [{ translateX }, { scale }] }}>
              <Pressable
                ref={(node) => { focusRefs.current[index] = node; }}
                accessibilityRole="menuitem"
                accessibilityLabel={`${item.label}: ${item.eyebrow}`}
                accessibilityState={{ selected }}
                onFocus={() => onSelect(index)}
                onHoverIn={() => onSelect(index)}
                onKeyDown={(event) => moveSelection(event, index)}
                onPress={() => onLaunch(item.key, item.index)}
                style={({ pressed }) => [
                  styles.option,
                  mobile && styles.optionMobile,
                  onRight && !compact && styles.optionRight,
                  { backgroundColor: selected ? item.accent : colors.ink, borderColor: selected ? colors.ink : item.accent },
                  pressed && styles.optionPressed,
                ]}
              >
                <View style={[styles.iconDisk, { backgroundColor: selected ? item.ink : item.accent }]}>
                  <Ionicons name={item.icon} size={mobile ? 18 : 22} color={selected ? item.accent : colors.ink} />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={[styles.optionEyebrow, onRight && !compact && styles.optionCopyRight, { color: selected ? foreground : item.accent }]}>{item.index} / {item.eyebrow}</Text>
                  <Text numberOfLines={1} style={[styles.optionLabel, mobile && styles.optionLabelMobile, onRight && !compact && styles.optionCopyRight, { color: foreground }]}>{item.label}</Text>
                </View>
                <Text style={[styles.optionArrow, { color: foreground }]}>{selected ? '◆' : '◇'}</Text>
              </Pressable>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}

function MascotCore({ activeIndex, compact, mobile, selection, progress }) {
  const size = mobile ? 210 : compact ? 260 : 330;

  return (
    <View style={[styles.mascotCore, compact && styles.mascotCoreCompact, { width: size, height: size }]}>
      <View style={[styles.coreOrbit, { borderColor: selection.accent }]} />
      <View style={[styles.coreCross, styles.coreCrossHorizontal, { backgroundColor: selection.accent }]} />
      <View style={[styles.coreCross, styles.coreCrossVertical, { backgroundColor: selection.accent }]} />
      <Animated.View style={{ opacity: progress, transform: [{ scale: progress }, { rotate: activeIndex % 2 ? '3deg' : '-3deg' }] }}>
        <MascotSticker index={activeIndex} size={size * 0.84} label={`Mascota original de ${selection.label}`} />
      </Animated.View>
      <View style={[styles.playerTag, { backgroundColor: selection.accent }]}>
        <Text style={[styles.playerTagText, { color: selection.ink }]}>PLAYER {selection.index}</Text>
      </View>
    </View>
  );
}

export default function PortfolioHero({ compact, mobile, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const mascotProgress = useRef(new Animated.Value(1)).current;
  const selection = menuItems[activeIndex];

  useEffect(() => {
    if (reduced) {
      mascotProgress.setValue(1);
      return;
    }
    mascotProgress.setValue(0.72);
    Animated.spring(mascotProgress, { toValue: 1, damping: 13, stiffness: 210, mass: 0.65, useNativeDriver: true }).start();
  }, [activeIndex, mascotProgress, reduced]);

  return (
    <View style={styles.shell}>
      <View style={[styles.topbar, mobile && styles.topbarMobile]}>
        <View style={styles.identity}>
          <View style={[styles.mark, { backgroundColor: selection.accent }]}><Text style={[styles.markText, { color: selection.ink }]}>AS</Text></View>
          <View>
            <Text style={styles.name}>ANDERSON SOLANO</Text>
            <Text style={styles.role}>CREATIVE FRONTEND / CR</Text>
          </View>
        </View>
        <View style={styles.online}>
          <View style={[styles.onlineDot, { backgroundColor: selection.accent }]} />
          {!mobile ? <Text style={styles.onlineText}>PLAYER 01 / ONLINE</Text> : null}
        </View>
      </View>

      <View style={[styles.stage, compact && styles.stageCompact]}>
        <View style={[styles.heading, compact && styles.headingCompact]}>
          <Text style={styles.headingKicker}>MAIN MENU / CHAPTER 00</Text>
          <Text style={[styles.headingTitle, mobile && styles.headingTitleMobile]}>ELIGE{`\n`}UNA RUTA.</Text>
          <View style={[styles.headingSignal, { backgroundColor: selection.accent }]} />
        </View>

        {!compact ? (
          <View pointerEvents="none" style={styles.connectionField}>
            <View style={[styles.connection, styles.connectionA, { backgroundColor: selection.accent }]} />
            <View style={[styles.connection, styles.connectionB, { backgroundColor: selection.accent }]} />
            <View style={[styles.connection, styles.connectionC, { backgroundColor: selection.accent }]} />
            <View style={[styles.connection, styles.connectionD, { backgroundColor: selection.accent }]} />
          </View>
        ) : null}

        <MascotCore activeIndex={activeIndex} compact={compact} mobile={mobile} selection={selection} progress={mascotProgress} />

        <RouteMenu activeIndex={activeIndex} compact={compact} mobile={mobile} onLaunch={onNavigate} onSelect={setActiveIndex} reduced={reduced} />

        <View style={[styles.brief, compact && styles.briefCompact, { borderColor: selection.accent }]}>
          <Text style={[styles.briefIndex, { color: selection.accent }]}>CURRENT / {selection.index}</Text>
          <Text style={[styles.briefText, mobile && styles.briefTextMobile]}>{selection.description}</Text>
          <Text style={styles.briefHint}>↑↓ SELECT · ENTER OPEN</Text>
        </View>
      </View>

      <View style={styles.footerRail}>
        <Text style={styles.railText}>WEB + MOBILE</Text>
        <Text style={[styles.railText, { color: selection.accent }]}>DESIGN SYSTEMS</Text>
        <Text style={styles.railText}>COSTA RICA / 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { width: '100%', maxWidth: layout.max, minHeight: 900, alignSelf: 'center', overflow: 'hidden', backgroundColor: colors.ink },
  topbar: { minHeight: 76, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.gutter, borderBottomWidth: 1, borderBottomColor: colors.navy },
  topbarMobile: { minHeight: 66, paddingHorizontal: layout.mobileGutter },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  markText: { fontFamily: fonts.display, fontSize: 21, lineHeight: 22, fontWeight: '900' },
  name: { color: colors.paper, fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', letterSpacing: 0.9 },
  role: { marginTop: 3, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.7 },
  online: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  stage: { minHeight: 772, position: 'relative', overflow: 'hidden', backgroundColor: colors.ink },
  stageCompact: { minHeight: 0, alignItems: 'stretch', paddingHorizontal: layout.mobileGutter, paddingVertical: 42 },
  heading: { position: 'absolute', zIndex: 1, left: 48, top: 46 },
  headingCompact: { position: 'relative', left: 0, top: 0, alignSelf: 'flex-start', marginBottom: 18 },
  headingKicker: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },
  headingTitle: { marginTop: 10, color: colors.paper, fontFamily: fonts.display, fontSize: 66, lineHeight: 57, fontWeight: '900', letterSpacing: -0.8 },
  headingTitleMobile: { fontSize: 50, lineHeight: 44 },
  headingSignal: { width: 78, height: 7, marginTop: 14, transform: [{ skewX: '-25deg' }] },
  routeMenu: { ...StyleSheet.absoluteFillObject, zIndex: 4 },
  routeMenuCompact: { position: 'relative', top: 0, right: 0, bottom: 0, left: 0, width: '100%', gap: 5, marginTop: 24 },
  optionSlot: { position: 'absolute', width: '31%', zIndex: 3 },
  optionSlotCompact: { position: 'relative', width: '100%' },
  optionPosition0: { left: '4%', top: 240, transform: [{ rotate: '-5deg' }] },
  optionPosition1: { left: '8%', top: 390, transform: [{ rotate: '3deg' }] },
  optionPosition2: { right: '4%', top: 215, transform: [{ rotate: '4deg' }] },
  optionPosition3: { right: '8%', top: 370, transform: [{ rotate: '-4deg' }] },
  option: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, borderWidth: 2 },
  optionRight: { flexDirection: 'row-reverse' },
  optionMobile: { minHeight: 70, gap: 11, paddingHorizontal: 12 },
  optionPressed: { opacity: 0.66 },
  iconDisk: { width: 48, height: 48, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.ink },
  optionCopy: { flex: 1, minWidth: 0 },
  optionCopyRight: { textAlign: 'right' },
  optionEyebrow: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.7 },
  optionLabel: { marginTop: 1, color: colors.paper, fontFamily: fonts.display, fontSize: 36, lineHeight: 37, fontWeight: '900', letterSpacing: 0.1 },
  optionLabelMobile: { fontSize: 30, lineHeight: 31 },
  optionArrow: { fontFamily: fonts.sans, fontSize: 16, fontWeight: '900' },
  mascotCore: { position: 'absolute', zIndex: 3, left: '50%', top: 205, alignItems: 'center', justifyContent: 'center', marginLeft: -165 },
  mascotCoreCompact: { position: 'relative', left: 0, top: 0, alignSelf: 'center', marginLeft: 0, marginTop: -4 },
  coreOrbit: { position: 'absolute', width: '92%', height: '92%', borderRadius: 999, borderWidth: 2, borderStyle: 'dashed', transform: [{ rotate: '9deg' }] },
  coreCross: { position: 'absolute', opacity: 0.5 },
  coreCrossHorizontal: { width: '118%', height: 1 },
  coreCrossVertical: { width: 1, height: '118%' },
  playerTag: { position: 'absolute', right: -4, bottom: 16, paddingHorizontal: 10, paddingVertical: 6, transform: [{ rotate: '-6deg' }] },
  playerTagText: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  connectionField: { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  connection: { position: 'absolute', width: '23%', height: 2, opacity: 0.52 },
  connectionA: { left: '29%', top: 295, transform: [{ rotate: '10deg' }] },
  connectionB: { left: '31%', top: 444, transform: [{ rotate: '-13deg' }] },
  connectionC: { right: '29%', top: 286, transform: [{ rotate: '-12deg' }] },
  connectionD: { right: '31%', top: 430, transform: [{ rotate: '12deg' }] },
  brief: { position: 'absolute', left: '28%', right: '28%', bottom: 34, zIndex: 5, padding: 16, backgroundColor: colors.navy, borderWidth: 2, transform: [{ rotate: '-1deg' }] },
  briefCompact: { position: 'relative', left: 0, right: 0, bottom: 0, width: '100%', marginTop: 24 },
  briefIndex: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  briefText: { marginTop: 7, color: colors.paper, fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  briefTextMobile: { textAlign: 'left' },
  briefHint: { marginTop: 10, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.9, textAlign: 'center' },
  footerRail: { minHeight: 52, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: layout.gutter, borderTopWidth: 1, borderTopColor: colors.navy },
  railText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
});
