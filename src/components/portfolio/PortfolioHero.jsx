import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, layout } from '../../design/tokens';

const Marker = ({ children, dark = false }) => (
  <View style={[styles.marker, dark && styles.markerDark]}>
    <Text style={[styles.markerText, dark && styles.markerTextDark]}>{children}</Text>
  </View>
);

const Action = ({ children, onPress, inverted = false, label }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={({ pressed, hovered }) => [
      styles.action,
      inverted && styles.actionInverted,
      (pressed || hovered) && styles.actionActive,
    ]}
  >
    <Text style={[styles.actionText, inverted && styles.actionTextInverted]}>{children}</Text>
    <Ionicons name="arrow-forward" size={16} color={inverted ? colors.ink : colors.paper} />
  </Pressable>
);

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

          <View style={styles.actions}>
            <Action onPress={onWork} label="Ver proyectos seleccionados">VER PROYECTOS</Action>
            <Action onPress={sendEmail} label="Escribir a Anderson" inverted>HABLEMOS</Action>
          </View>
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 },
  action: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 18, backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.paper },
  actionInverted: { backgroundColor: colors.paper },
  actionActive: { transform: [{ translateY: -2 }], borderColor: colors.acid },
  actionText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  actionTextInverted: { color: colors.ink },
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

