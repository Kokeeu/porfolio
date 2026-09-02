import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, layout } from '../../design/tokens';

const menuItems = [
  {
    key: 'work',
    index: '01',
    command: 'INICIAR',
    target: 'CASOS SELECCIONADOS',
    code: 'MISSION_SELECT / 04 FILES',
    description: 'Cuatro productos. Cuatro decisiones distintas.',
    accent: colors.acid,
    foreground: colors.ink,
    source: require('../../../assets/editorial/prism-field.jpg'),
  },
  {
    key: 'loadout',
    index: '02',
    command: 'LOADOUT',
    target: 'MÉTODO + SISTEMA',
    code: 'BUILD_SYSTEM / EQUIPPED',
    description: 'Producto, dirección visual y arquitectura trabajando juntos.',
    accent: colors.violet,
    foreground: colors.paper,
    source: require('../../../assets/editorial/signal-kit.jpg'),
  },
  {
    key: 'lab',
    index: '03',
    command: 'SIGNAL LAB',
    target: 'ARCHIVO VISUAL',
    code: 'RESEARCH_MODE / ONLINE',
    description: 'Texturas, señales y reglas para construir una piel propia.',
    accent: colors.cyan,
    foreground: colors.ink,
    source: require('../../../assets/editorial/chroma-knot.jpg'),
  },
  {
    key: 'profile',
    index: '04',
    command: 'PLAYER FILE',
    target: 'ANDERSON SOLANO',
    code: 'PROFILE_01 / COSTA RICA',
    description: 'Frontend creativo con criterio de producto y obsesión visual.',
    accent: colors.paper,
    foreground: colors.ink,
    source: require('../../../assets/editorial/shape-atlas.jpg'),
  },
  {
    key: 'contact',
    index: '05',
    command: 'OPEN CHANNEL',
    target: 'NUEVA PARTIDA',
    code: 'COMMS_LINK / AVAILABLE',
    description: 'Un canal directo para ideas que necesitan una forma propia.',
    accent: '#ff6dcb',
    foreground: colors.ink,
    source: require('../../../assets/editorial/fluid-state.jpg'),
  },
];

const wave = [5, 12, 8, 18, 10, 22, 14, 7, 17, 11, 20, 6];
const rowHeight = 66;

function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription?.remove();
  }, []);

  return reduceMotion;
}

function MainMenu({ activeIndex, compact, mobile, onLaunch, onSelect, reduceMotion }) {
  const cursorPosition = useRef(new Animated.Value(0)).current;
  const optionRefs = useRef([]);
  const selection = menuItems[activeIndex];

  useEffect(() => {
    const toValue = activeIndex * (mobile ? 58 : rowHeight);
    if (reduceMotion) {
      cursorPosition.setValue(toValue);
      return;
    }

    Animated.spring(cursorPosition, {
      toValue,
      damping: 19,
      stiffness: 230,
      mass: 0.72,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, cursorPosition, mobile, reduceMotion]);

  const handleKeyDown = (event, index) => {
    const key = event.nativeEvent?.key || event.key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

    event.preventDefault?.();
    const direction = key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + direction + menuItems.length) % menuItems.length;
    onSelect(nextIndex);
    optionRefs.current[nextIndex]?.focus?.();
  };

  return (
    <View style={styles.menuConsole}>
      <View style={[styles.menuHeader, compact && styles.menuHeaderCompact]}>
        <Text style={styles.menuHeaderLabel}>MAIN MENU / SELECT ROUTE</Text>
        {!mobile ? (
          <View style={styles.waveform} accessibilityElementsHidden>
            {wave.map((height, index) => (
              <View key={index} style={[styles.waveBar, { height, backgroundColor: selection.accent }]} />
            ))}
          </View>
        ) : null}
        <Text style={[styles.menuStatus, { color: selection.accent }]}>{selection.code}</Text>
      </View>

      <View style={styles.menuOptions} accessibilityRole="menu">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.menuCursor,
            mobile && styles.menuCursorMobile,
            {
              backgroundColor: selection.accent,
              transform: [{ translateY: cursorPosition }],
            },
          ]}
        >
          <View style={[styles.cursorBracket, { borderColor: selection.foreground }]} />
        </Animated.View>

        {menuItems.map((item, index) => {
          const selected = index === activeIndex;
          const selectedColor = selected ? selection.foreground : colors.paper;

          return (
            <Pressable
              key={item.key}
              ref={(node) => { optionRefs.current[index] = node; }}
              accessibilityRole="menuitem"
              accessibilityLabel={`${item.command}: ${item.target}`}
              accessibilityState={{ selected }}
              onFocus={() => onSelect(index)}
              onHoverIn={() => onSelect(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPress={() => onLaunch(item.key)}
              style={({ pressed }) => [
                styles.menuOption,
                mobile && styles.menuOptionMobile,
                pressed && styles.menuOptionPressed,
              ]}
            >
              <Text style={[styles.menuIndex, { color: selectedColor }]}>{item.index}</Text>
              <View style={styles.menuOptionCopy}>
                <Text style={[styles.menuCommand, { color: selectedColor }]}>{item.command}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.menuTarget,
                    mobile && styles.menuTargetMobile,
                    { color: selected ? selection.foreground : colors.fog },
                  ]}
                >
                  {item.target}
                </Text>
              </View>
              <Text style={[styles.menuArrow, { color: selectedColor }]}>{selected ? '▶' : '·'}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.menuFooter}>
        <Text style={styles.menuFooterText}>↑↓ NAVIGATE</Text>
        <Text style={[styles.menuFooterText, { color: selection.accent }]}>ENTER / LAUNCH</Text>
      </View>
    </View>
  );
}

export default function PortfolioHero({ compact, mobile, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const previewOpacity = useRef(new Animated.Value(1)).current;
  const selection = menuItems[activeIndex];

  useEffect(() => {
    if (reduceMotion) {
      previewOpacity.setValue(1);
      return;
    }

    previewOpacity.setValue(0.35);
    Animated.timing(previewOpacity, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, previewOpacity, reduceMotion]);

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
      <View style={[styles.topbar, mobile && styles.topbarMobile]}>
        <View style={styles.identity}>
          <View style={[styles.monogram, { backgroundColor: selection.accent }]}>
            <Text style={[styles.monogramText, { color: selection.foreground }]}>AS</Text>
          </View>
          <View>
            <Text style={styles.name}>ANDERSON SOLANO</Text>
            <Text style={styles.role}>CREATIVE FRONTEND / COSTA RICA</Text>
          </View>
        </View>

        {!compact ? (
          <View style={styles.navLinks}>
            <Pressable onPress={() => onNavigate('work')} accessibilityRole="link"><Text style={styles.navLink}>01 / MISIONES</Text></Pressable>
            <Pressable onPress={() => onNavigate('contact')} accessibilityRole="link"><Text style={styles.navLink}>05 / CONTACTO</Text></Pressable>
          </View>
        ) : null}

        <View style={styles.availability}>
          <View style={[styles.statusDot, { backgroundColor: selection.accent }]} />
          {!mobile ? <Text style={[styles.availabilityText, { color: selection.accent }]}>PLAYER ONLINE</Text> : null}
        </View>
      </View>

      <View style={[styles.heroGrid, compact && styles.heroGridCompact]}>
        <View style={[styles.copy, compact && styles.copyCompact, mobile && styles.copyMobile]}>
          <View style={styles.eyebrowRow}>
            <View style={[styles.marker, { backgroundColor: selection.accent }]}>
              <Text style={[styles.markerText, { color: selection.foreground }]}>PORTFOLIO SYSTEM / 2026</Text>
            </View>
            {!mobile ? <Text style={styles.coordinates}>09.93° N — 84.08° W</Text> : null}
          </View>

          <View style={[styles.titleBlock, mobile && styles.titleBlockMobile]}>
            <Text style={[styles.title, compact && styles.titleCompact, mobile && styles.titleMobile]}>INTERFACES</Text>
            <View style={styles.titleLastLine}>
              <Text style={[styles.titleOutline, compact && styles.titleCompact, mobile && styles.titleMobile]}>CON</Text>
              <Text style={[styles.titleAccent, compact && styles.titleCompact, mobile && styles.titleMobile, { color: selection.accent }]}>FRECUENCIA.</Text>
            </View>
          </View>

          <Text style={[styles.intro, mobile && styles.introMobile]}>
            Diseño y desarrollo productos digitales que se entienden rápido, se sienten vivos y no podrían confundirse con una plantilla.
          </Text>

          <MainMenu
            activeIndex={activeIndex}
            compact={compact}
            mobile={mobile}
            onLaunch={onNavigate}
            onSelect={setActiveIndex}
            reduceMotion={reduceMotion}
          />
        </View>

        <View style={[styles.visual, compact && styles.visualCompact, mobile && styles.visualMobile]}>
          <Animated.View style={[styles.previewLayer, { opacity: previewOpacity }]}>
            <Image
              source={selection.source}
              style={styles.visualImage}
              resizeMode="cover"
              accessibilityLabel={`Vista previa de ${selection.target}`}
            />
          </Animated.View>
          <View style={styles.imageTint} />
          <View style={styles.visualGrid} pointerEvents="none">
            <View style={styles.gridVertical} />
            <View style={styles.gridHorizontal} />
          </View>
          <View style={styles.visualTopline}>
            <Text style={styles.visualMeta}>SLOT_{selection.index} / LOADED</Text>
            <Text style={styles.visualMeta}>{selection.code}</Text>
          </View>
          <View style={[styles.scanline, { backgroundColor: selection.accent }]} />
          <View style={[styles.reticle, { borderColor: selection.accent }]}>
            <View style={[styles.reticleDot, { backgroundColor: selection.accent }]} />
          </View>
          <View style={[styles.slotBadge, { backgroundColor: selection.accent }]}>
            <Text style={[styles.slotLabel, { color: selection.foreground }]}>ACTIVE</Text>
            <Text style={[styles.slotNumber, { color: selection.foreground }]}>{selection.index}</Text>
          </View>
          <View style={styles.visualBriefing}>
            <Text style={[styles.briefingKicker, { color: selection.accent }]}>CURRENT SELECTION</Text>
            <Text style={[styles.briefingTitle, mobile && styles.briefingTitleMobile]}>{selection.target}</Text>
            <Text style={styles.briefingCopy}>{selection.description}</Text>
            <View style={styles.briefingFooter}>
              <Text style={styles.briefingMeta}>STATUS / READY</Text>
              <Text style={styles.briefingMeta}>INPUT / ENABLED</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footerRail}>
        <Text style={styles.railText}>REACT NATIVE</Text>
        <Text style={[styles.railStar, { color: selection.accent }]}>✦</Text>
        <Text style={styles.railText}>WEB EXPERIENCES</Text>
        <Text style={[styles.railStar, { color: selection.accent }]}>✦</Text>
        <Text style={styles.railText}>PRODUCT THINKING</Text>
        {!compact ? <><Text style={[styles.railStar, { color: selection.accent }]}>✦</Text><Text style={styles.railText}>NO GENERIC OUTPUT</Text></> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: layout.max,
    minHeight: 900,
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
  topbarMobile: { minHeight: 68, paddingHorizontal: layout.mobileGutter },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  monogram: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monogramText: { fontFamily: fonts.display, fontSize: 15, fontWeight: '900' },
  name: { color: colors.paper, fontFamily: fonts.mono, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  role: { marginTop: 4, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.8 },
  navLinks: { flexDirection: 'row', gap: 30 },
  navLink: { color: colors.paper, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  availabilityText: { fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  heroGrid: { minHeight: 760, flexDirection: 'row' },
  heroGridCompact: { flexDirection: 'column' },
  copy: { flex: 1.08, minWidth: 0, justifyContent: 'center', padding: 34 },
  copyCompact: { minHeight: 760, padding: layout.mobileGutter },
  copyMobile: { minHeight: 690 },
  eyebrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  marker: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6 },
  markerText: { fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  coordinates: { color: colors.fog, fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.4 },
  titleBlock: { marginTop: 27, marginBottom: 20 },
  titleBlockMobile: { marginTop: 24, marginBottom: 18 },
  title: { color: colors.paper, fontFamily: fonts.display, fontSize: 74, fontWeight: '900', letterSpacing: -4.5, lineHeight: 71 },
  titleOutline: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 74,
    fontWeight: '900',
    letterSpacing: -4.5,
    lineHeight: 71,
    textShadowColor: colors.paper,
    textShadowOffset: { width: 1.5, height: 0 },
    textShadowRadius: 0,
  },
  titleAccent: { fontFamily: fonts.display, fontSize: 74, fontWeight: '900', letterSpacing: -4.5, lineHeight: 71 },
  titleCompact: { fontSize: 51, lineHeight: 50, letterSpacing: -3 },
  titleMobile: { fontSize: 39, lineHeight: 39, letterSpacing: -2.4 },
  titleLastLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  intro: { maxWidth: 560, color: '#d7d6dc', fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  introMobile: { fontSize: 15, lineHeight: 22 },
  menuConsole: { width: '100%', maxWidth: 610, marginTop: 27 },
  menuHeader: {
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#4a4952',
  },
  menuHeaderCompact: { minHeight: 27 },
  menuHeaderLabel: { color: colors.fog, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.8 },
  waveform: { flex: 1, height: 22, marginHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  waveBar: { width: 2 },
  menuStatus: { fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.55, textAlign: 'right' },
  menuOptions: { position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.paper },
  menuCursor: { position: 'absolute', zIndex: 0, left: 0, right: 0, top: 0, height: rowHeight },
  menuCursorMobile: { height: 58 },
  cursorBracket: { position: 'absolute', right: 11, top: 11, bottom: 11, width: 12, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1 },
  menuOption: {
    zIndex: 1,
    height: rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#4a4952',
  },
  menuOptionMobile: { height: 58, gap: 10, paddingHorizontal: 11 },
  menuOptionPressed: { opacity: 0.68 },
  menuIndex: { width: 22, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700' },
  menuOptionCopy: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'baseline', gap: 13 },
  menuCommand: { minWidth: 82, fontFamily: fonts.display, fontSize: 13, fontWeight: '900', letterSpacing: -0.2 },
  menuTarget: { flex: 1, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.65 },
  menuTargetMobile: { fontSize: 6 },
  menuArrow: { width: 18, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  menuFooter: { minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 9, borderWidth: 1, borderTopWidth: 0, borderColor: '#4a4952' },
  menuFooterText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.7 },
  visual: { flex: 0.92, minWidth: 0, position: 'relative', overflow: 'hidden', backgroundColor: '#0d0d12', borderLeftWidth: 1, borderLeftColor: '#34343c' },
  visualCompact: { minHeight: 650, borderLeftWidth: 0, borderTopWidth: 1, borderTopColor: '#34343c' },
  visualMobile: { minHeight: 540 },
  previewLayer: { ...StyleSheet.absoluteFillObject },
  visualImage: { width: '100%', height: '100%', backgroundColor: '#111116' },
  imageTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,3,10,0.22)' },
  visualGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.38 },
  gridVertical: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: colors.paper },
  gridHorizontal: { position: 'absolute', left: 0, right: 0, top: '42%', height: 1, backgroundColor: colors.paper },
  visualTopline: { position: 'absolute', left: 18, right: 18, top: 17, flexDirection: 'row', justifyContent: 'space-between', gap: 14 },
  visualMeta: { flexShrink: 1, color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.7 },
  scanline: { position: 'absolute', left: 0, right: 0, top: '42%', height: 2, opacity: 0.9 },
  reticle: { position: 'absolute', left: '50%', top: '42%', width: 78, height: 78, alignItems: 'center', justifyContent: 'center', marginLeft: -39, marginTop: -39, borderRadius: 40, borderWidth: 1 },
  reticleDot: { width: 7, height: 7, borderRadius: 4 },
  slotBadge: { position: 'absolute', right: 22, top: 52, width: 96, height: 96, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '4deg' }] },
  slotLabel: { fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.8 },
  slotNumber: { fontFamily: fonts.display, fontSize: 38, lineHeight: 40, fontWeight: '900' },
  visualBriefing: { position: 'absolute', left: 18, right: 18, bottom: 18, padding: 20, backgroundColor: 'rgba(5,5,7,0.94)', borderWidth: 1, borderColor: '#767681' },
  briefingKicker: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  briefingTitle: { marginTop: 8, color: colors.paper, fontFamily: fonts.display, fontSize: 34, lineHeight: 34, fontWeight: '900', letterSpacing: -1.5 },
  briefingTitleMobile: { fontSize: 27, lineHeight: 28 },
  briefingCopy: { maxWidth: 480, marginTop: 9, color: colors.fog, fontFamily: fonts.serif, fontSize: 15, lineHeight: 21, fontStyle: 'italic' },
  briefingFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 18, paddingTop: 11, borderTopWidth: 1, borderTopColor: '#565660' },
  briefingMeta: { color: colors.paper, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', letterSpacing: 0.7 },
  footerRail: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.ink },
  railText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  railStar: { fontSize: 13 },
});
