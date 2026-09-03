import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, layout } from '../../design/tokens';

const menuItems = [
  { key: 'work', index: '01', label: 'MISIONES', eyebrow: 'CASOS SELECCIONADOS', description: 'Cuatro productos, cuatro problemas reales y las decisiones que les dieron forma.', icon: 'map-outline', accent: colors.pink, ink: colors.paper, rotation: '-2deg' },
  { key: 'loadout', index: '02', label: 'LOADOUT + LAB', eyebrow: 'MÉTODO Y EXPERIMENTOS', description: 'Mi sistema de trabajo, herramientas y exploraciones visuales en una sola ruta.', icon: 'construct-outline', accent: colors.blue, ink: colors.paper, rotation: '1.4deg' },
  { key: 'profile', index: '03', label: 'PERFIL', eyebrow: 'PLAYER FILE', description: 'Quién soy, desde dónde trabajo y qué clase de experiencias quiero construir.', icon: 'person-outline', accent: colors.paper, ink: colors.ink, rotation: '-1deg' },
  { key: 'contact', index: '04', label: 'CONTACTO', eyebrow: 'OPEN CHANNEL', description: 'Un canal directo para proyectos que necesitan criterio, carácter y código.', icon: 'paper-plane-outline', accent: colors.cyan, ink: colors.ink, rotation: '2.2deg' },
];

const sparks = ['✦', '×', '●', '✦', '+'];
const mascotSheet = require('../../../assets/mascots/portfolio-mascot-sheet.png');

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => subscription?.remove();
  }, []);

  return reduced;
}

function RouteMenu({ activeIndex, mobile, onLaunch, onSelect, reduced }) {
  const focusRefs = useRef([]);
  const energies = useRef(menuItems.map((_, index) => new Animated.Value(index === 0 ? 1 : 0))).current;

  useEffect(() => {
    Animated.parallel(energies.map((energy, index) => Animated.spring(energy, {
      toValue: index === activeIndex ? 1 : 0,
      damping: 18,
      stiffness: 220,
      mass: 0.7,
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
    <View accessibilityRole="menu" style={[styles.routeMenu, mobile && styles.routeMenuMobile]}>
      {menuItems.map((item, index) => {
        const selected = index === activeIndex;
        const translateX = energies[index].interpolate({ inputRange: [0, 1], outputRange: [0, mobile ? 7 : 22] });
        const scale = energies[index].interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.04] });
        const foreground = selected ? item.ink : colors.paper;

        return (
          <View key={item.key} style={[styles.optionAngle, { transform: [{ rotate: item.rotation }] }]}>
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
                style={({ pressed }) => [styles.option, mobile && styles.optionMobile, { backgroundColor: selected ? item.accent : colors.panel }, pressed && styles.optionPressed]}
              >
                <View style={[styles.iconBox, { borderColor: foreground }]}>
                  <Ionicons name={item.icon} size={mobile ? 18 : 22} color={foreground} />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={[styles.optionEyebrow, { color: selected ? foreground : colors.cyan }]}>{item.index} / {item.eyebrow}</Text>
                  <Text numberOfLines={1} style={[styles.optionLabel, mobile && styles.optionLabelMobile, { color: foreground }]}>{item.label}</Text>
                </View>
                <Text style={[styles.optionArrow, { color: foreground }]}>{selected ? '↗' : '—'}</Text>
              </Pressable>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}

export default function PortfolioHero({ compact, mobile, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const selection = menuItems[activeIndex];
  const preview = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduced) return;
    preview.setValue(0);
    Animated.timing(preview, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [activeIndex, preview, reduced]);

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
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
        <View style={[styles.menuSide, compact && styles.menuSideCompact]}>
          <View style={styles.chapterRow}>
            <Text style={styles.chapter}>MAIN MENU</Text>
            <Text style={[styles.chapterCode, { color: selection.accent }]}>CHAPTER 00 / READY</Text>
          </View>

          <View style={styles.titleWrap}>
            <Text style={[styles.titleGhost, mobile && styles.titleGhostMobile]}>SELECT</Text>
            <Text style={[styles.title, mobile && styles.titleMobile]}>ELIGE UNA</Text>
            <View style={[styles.titleSlab, { backgroundColor: selection.accent, transform: [{ rotate: '-1.8deg' }] }]}>
              <Text style={[styles.titleSlabText, mobile && styles.titleSlabTextMobile, { color: selection.ink }]}>RUTA.</Text>
            </View>
          </View>

          <RouteMenu activeIndex={activeIndex} mobile={mobile} onLaunch={onNavigate} onSelect={setActiveIndex} reduced={reduced} />

          <View style={styles.controls}>
            <Text style={styles.controlsText}>↑↓ CAMBIAR</Text>
            <Text style={[styles.controlsText, { color: selection.accent }]}>ENTER / ABRIR</Text>
          </View>
        </View>

        <View style={[styles.previewSide, compact && styles.previewSideCompact]}>
          <View style={[styles.bigNumberWrap, { borderColor: selection.accent }]}>
            <Animated.Text style={[styles.bigNumber, mobile && styles.bigNumberMobile, { color: selection.accent, opacity: preview }]}>{selection.index}</Animated.Text>
          </View>

          <Animated.View style={[styles.mascotWindow, mobile && styles.mascotWindowMobile, { opacity: preview, borderColor: selection.accent, transform: [{ rotate: selection.rotation }] }]}>
            <View style={[styles.mascotBackdrop, { backgroundColor: selection.accent }]} />
            <Image
              source={mascotSheet}
              resizeMode="stretch"
              accessibilityLabel={`Mascota original de la ruta ${selection.label}`}
              style={[styles.mascotSheet, { left: `${-activeIndex * 100}%` }]}
            />
            <View style={[styles.mascotTag, { backgroundColor: selection.ink }]}>
              <Text style={[styles.mascotTagText, { color: selection.accent }]}>PLAYER {selection.index}</Text>
            </View>
          </Animated.View>

          <View style={[styles.briefCard, mobile && styles.briefCardMobile, { borderColor: selection.accent }]}>
            <Text style={[styles.briefKicker, { color: selection.accent }]}>CURRENT SELECTION / {selection.index}</Text>
            <Text style={[styles.briefTitle, mobile && styles.briefTitleMobile]}>{selection.label}</Text>
            <Text style={styles.briefCopy}>{selection.description}</Text>
            <View style={styles.briefRule} />
            <Text style={styles.briefHint}>TOCA LA OPCIÓN PARA ENTRAR</Text>
          </View>

          <View style={styles.sparkField} pointerEvents="none">
            {sparks.map((spark, index) => <Text key={`${spark}-${index}`} style={[styles.spark, styles[`spark${index}`], { color: index % 2 ? colors.cyan : selection.accent }]}>{spark}</Text>)}
          </View>
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
  shellCompact: { minHeight: 0 },
  topbar: { minHeight: 78, zIndex: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.gutter, borderBottomWidth: 1, borderBottomColor: colors.navy },
  topbarMobile: { minHeight: 66, paddingHorizontal: layout.mobileGutter },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  markText: { fontFamily: fonts.display, fontSize: 21, lineHeight: 22, fontWeight: '900' },
  name: { color: colors.paper, fontFamily: fonts.mono, fontSize: 10, fontWeight: '700', letterSpacing: 0.9 },
  role: { marginTop: 3, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.7 },
  online: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  stage: { minHeight: 770, flexDirection: 'row', position: 'relative' },
  stageCompact: { flexDirection: 'column' },
  menuSide: { flex: 1.05, zIndex: 2, justifyContent: 'center', paddingHorizontal: 48, paddingVertical: 42 },
  menuSideCompact: { paddingHorizontal: layout.mobileGutter, paddingTop: 44, paddingBottom: 28 },
  chapterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  chapter: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 2 },
  chapterCode: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  titleWrap: { marginTop: 28, marginBottom: 26, alignSelf: 'flex-start' },
  titleGhost: { position: 'absolute', left: 245, top: -32, color: colors.navy, fontFamily: fonts.display, fontSize: 84, lineHeight: 84, fontWeight: '900', transform: [{ rotate: '5deg' }] },
  titleGhostMobile: { left: 145, top: -18, fontSize: 52, lineHeight: 52 },
  title: { color: colors.paper, fontFamily: fonts.display, fontSize: 78, lineHeight: 72, fontWeight: '900', letterSpacing: -1.5 },
  titleMobile: { fontSize: 52, lineHeight: 49 },
  titleSlab: { alignSelf: 'flex-start', marginTop: -2, paddingHorizontal: 18, paddingVertical: 1 },
  titleSlabText: { fontFamily: fonts.display, fontSize: 91, lineHeight: 88, fontWeight: '900', letterSpacing: -2 },
  titleSlabTextMobile: { fontSize: 64, lineHeight: 61 },
  routeMenu: { width: '100%', maxWidth: 650, gap: 2 },
  routeMenuMobile: { gap: 0 },
  optionAngle: { marginVertical: -1 },
  option: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 16, borderWidth: 2, borderColor: colors.ink },
  optionMobile: { minHeight: 66, gap: 11, paddingHorizontal: 12 },
  optionPressed: { opacity: 0.75 },
  iconBox: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  optionCopy: { flex: 1, minWidth: 0 },
  optionEyebrow: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.9 },
  optionLabel: { marginTop: 1, fontFamily: fonts.display, fontSize: 36, lineHeight: 37, fontWeight: '900', letterSpacing: 0.2 },
  optionLabelMobile: { fontSize: 28, lineHeight: 29 },
  optionArrow: { fontFamily: fonts.display, fontSize: 29, fontWeight: '900' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, paddingHorizontal: 4 },
  controlsText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  previewSide: { flex: 0.95, minHeight: 770, position: 'relative', overflow: 'hidden', justifyContent: 'flex-end', padding: 36, backgroundColor: colors.navy },
  previewSideCompact: { minHeight: 620, padding: layout.mobileGutter },
  bigNumberWrap: { position: 'absolute', top: 36, right: 36, width: 160, height: 142, alignItems: 'center', justifyContent: 'center', borderWidth: 2, transform: [{ rotate: '5deg' }] },
  bigNumber: { fontFamily: fonts.display, fontSize: 132, lineHeight: 133, fontWeight: '900' },
  bigNumberMobile: { fontSize: 104, lineHeight: 105 },
  mascotWindow: { position: 'absolute', left: '8%', top: '8%', width: '55%', aspectRatio: 1, overflow: 'hidden', borderWidth: 3, backgroundColor: colors.paper },
  mascotWindowMobile: { width: '58%', top: '10%' },
  mascotBackdrop: { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  mascotSheet: { position: 'absolute', top: 0, width: '400%', height: '100%' },
  mascotTag: { position: 'absolute', left: 10, bottom: 10, paddingHorizontal: 8, paddingVertical: 5 },
  mascotTagText: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  briefCard: { zIndex: 2, padding: 24, backgroundColor: colors.ink, borderWidth: 2, transform: [{ rotate: '-1deg' }] },
  briefCardMobile: { padding: 19 },
  briefKicker: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1.1 },
  briefTitle: { marginTop: 8, color: colors.paper, fontFamily: fonts.display, fontSize: 48, lineHeight: 48, fontWeight: '900' },
  briefTitleMobile: { fontSize: 37, lineHeight: 38 },
  briefCopy: { maxWidth: 500, marginTop: 9, color: colors.fog, fontFamily: fonts.sans, fontSize: 14, lineHeight: 21 },
  briefRule: { height: 1, marginTop: 18, backgroundColor: colors.navy },
  briefHint: { marginTop: 10, color: colors.cyan, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  sparkField: { ...StyleSheet.absoluteFillObject },
  spark: { position: 'absolute', fontFamily: fonts.sans, fontSize: 30, fontWeight: '900' },
  spark0: { left: '8%', bottom: '35%' },
  spark1: { right: '9%', top: '29%', fontSize: 44 },
  spark2: { left: '48%', top: '6%', fontSize: 11 },
  spark3: { right: '5%', bottom: '29%', fontSize: 22 },
  spark4: { left: '4%', top: '51%', fontSize: 40 },
  footerRail: { minHeight: 52, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: layout.gutter, borderTopWidth: 1, borderTopColor: colors.navy },
  railText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
});
