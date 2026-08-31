import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, layout } from '../../design/tokens';

const CapabilityRow = ({ index, title, detail }) => (
  <View style={styles.capabilityRow}>
    <Text style={styles.capabilityIndex}>{index}</Text>
    <Text style={styles.capabilityTitle}>{title}</Text>
    <Text style={styles.capabilityDetail}>{detail}</Text>
  </View>
);

export function Manifesto({ compact }) {
  return (
    <View style={[styles.manifesto, compact && styles.manifestoCompact]}>
      <View style={styles.manifestoLead}>
        <Text style={styles.sectionKicker}>[00] / PRINCIPIO DE TRABAJO</Text>
        <Text style={[styles.manifestoTitle, compact && styles.manifestoTitleCompact]}>
          LO DIGITAL NO TIENE QUE SENTIRSE <Text style={styles.manifestoItalic}>DESECHABLE.</Text>
        </Text>
      </View>
      <View style={styles.manifestoBody}>
        <Text style={styles.manifestoCopy}>Me muevo entre la lógica de producto y la dirección visual. Primero encuentro la estructura; después decido dónde vale la pena romperla.</Text>
        <View style={styles.capabilities}>
          <CapabilityRow index="01" title="FRONTEND" detail="Interfaces web y móviles" />
          <CapabilityRow index="02" title="DIRECCIÓN VISUAL" detail="Sistemas con una idea reconocible" />
          <CapabilityRow index="03" title="PROTOTIPADO" detail="Del flujo al comportamiento" />
          <CapabilityRow index="04" title="ARQUITECTURA" detail="Código que permite seguir iterando" />
        </View>
      </View>
    </View>
  );
}

const LabTile = ({ source, label, style }) => (
  <View style={[styles.labTile, style]}>
    <Image source={source} style={styles.labImage} resizeMode="cover" accessibilityLabel={label} />
    <View style={styles.labLabel}><Text style={styles.labLabelText}>{label}</Text></View>
  </View>
);

export function VisualLab({ compact }) {
  return (
    <View style={[styles.lab, compact && styles.labCompact]}>
      <View style={styles.labIntro}>
        <Text style={styles.labKicker}>VISUAL RESEARCH / 03 FRAGMENTS</Text>
        <Text style={[styles.labTitle, compact && styles.labTitleCompact]}>UN SISTEMA{`\n`}QUE PUEDE{`\n`}CAMBIAR DE PIEL.</Text>
        <Text style={styles.labCopy}>El archivo visual no es decoración: funciona como tensión entre orden técnico, ruido, textura y luz.</Text>
      </View>
      <View style={[styles.labCanvas, compact && styles.labCanvasCompact]}>
        <LabTile source={require('../../../assets/editorial/chroma-knot.jpg')} label="A / CHROMA" style={styles.labTileA} />
        <LabTile source={require('../../../assets/editorial/signal-kit.jpg')} label="B / SIGNAL KIT" style={styles.labTileB} />
        <LabTile source={require('../../../assets/editorial/signal-eye.jpg')} label="C / SIGNAL" style={styles.labTileC} />
        <View style={styles.labCross}><Text style={styles.labCrossText}>＋</Text></View>
        <Text style={styles.labAnnotation}>ESTRUCTURA{`\n`}ANTES QUE EFECTO →</Text>
      </View>
    </View>
  );
}

export function About({ compact }) {
  return (
    <View style={[styles.about, compact && styles.aboutCompact]}>
      <View style={[styles.aboutVisual, compact && styles.aboutVisualCompact]}>
        <Image source={require('../../../assets/editorial/shape-atlas.jpg')} style={styles.aboutImage} resizeMode="cover" accessibilityLabel="Atlas editorial de formas geométricas en blanco y negro" />
        <View style={styles.aboutIndex}><Text style={styles.aboutIndexText}>AS / 26</Text></View>
      </View>
      <View style={styles.aboutCopyWrap}>
        <Text style={styles.aboutKicker}>[02] / SOBRE MÍ</Text>
        <Text style={[styles.aboutTitle, compact && styles.aboutTitleCompact]}>DESARROLLO{`\n`}CON CRITERIO{`\n`}VISUAL.</Text>
        <Text style={styles.aboutCopy}>Soy Anderson Solano, desarrollador frontend en Costa Rica. Me interesan los productos donde la experiencia, el movimiento y la implementación forman una sola conversación.</Text>
        <Text style={styles.aboutQuote}>“La rareza sirve cuando también mejora la lectura.”</Text>
        <View style={styles.aboutFacts}>
          <Text style={styles.aboutFact}>BASE / COSTA RICA</Text>
          <Text style={styles.aboutFact}>FOCUS / WEB + MOBILE</Text>
          <Text style={styles.aboutFact}>STATUS / OPEN TO WORK</Text>
        </View>
      </View>
    </View>
  );
}

const ContactLink = ({ label, onPress }) => (
  <Pressable accessibilityRole="link" onPress={onPress} style={({ pressed, hovered }) => [styles.contactLink, (pressed || hovered) && styles.contactLinkActive]}>
    <Text style={styles.contactLinkText}>{label}</Text>
    <Ionicons name="arrow-up" size={21} color={colors.ink} style={styles.contactArrow} />
  </Pressable>
);

export function Contact({ compact, email, linkedin }) {
  return (
    <View style={styles.contact}>
      <Text style={styles.contactKicker}>¿TIENES UNA IDEA QUE MERECE UNA FORMA PROPIA?</Text>
      <Text style={[styles.contactTitle, compact && styles.contactTitleCompact]}>HAGAMOS{`\n`}QUE EMITA{`\n`}SEÑAL.</Text>
      <View style={[styles.contactBottom, compact && styles.contactBottomCompact]}>
        <Text style={styles.contactNote}>Disponible para proyectos, productos digitales y colaboraciones donde diseño y código tengan el mismo peso.</Text>
        <View style={styles.contactLinks}>
          <ContactLink label="EMAIL" onPress={() => Linking.openURL(`mailto:${email}`)} />
          <ContactLink label="LINKEDIN" onPress={() => Linking.openURL(linkedin)} />
          <ContactLink label="GITHUB" onPress={() => Linking.openURL('https://github.com/Kokeeu')} />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 ANDERSON SOLANO</Text>
        <Text style={styles.footerText}>DESIGNED + BUILT IN COSTA RICA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  manifesto: { width: '100%', maxWidth: layout.max, alignSelf: 'center', flexDirection: 'row', gap: 70, paddingHorizontal: layout.gutter, paddingVertical: 120, backgroundColor: colors.paper },
  manifestoCompact: { flexDirection: 'column', gap: 48, paddingHorizontal: layout.mobileGutter, paddingVertical: 82 },
  manifestoLead: { flex: 1.15 },
  sectionKicker: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  manifestoTitle: { marginTop: 20, color: colors.ink, fontFamily: fonts.display, fontSize: 62, lineHeight: 63, fontWeight: '900', letterSpacing: -3.5 },
  manifestoTitleCompact: { fontSize: 42, lineHeight: 44, letterSpacing: -2.3 },
  manifestoItalic: { color: colors.violet, fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: '400' },
  manifestoBody: { flex: 0.85 },
  manifestoCopy: { maxWidth: 560, color: '#313137', fontFamily: fonts.sans, fontSize: 18, lineHeight: 27 },
  capabilities: { marginTop: 42, borderTopWidth: 1, borderTopColor: colors.ink },
  capabilityRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.ink },
  capabilityIndex: { width: 24, color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  capabilityTitle: { flex: 0.8, color: colors.ink, fontFamily: fonts.display, fontSize: 15, fontWeight: '900' },
  capabilityDetail: { flex: 1.2, color: '#4d4d54', fontFamily: fonts.mono, fontSize: 8, lineHeight: 13 },
  lab: { width: '100%', maxWidth: layout.max, minHeight: 800, alignSelf: 'center', flexDirection: 'row', backgroundColor: colors.violet },
  labCompact: { flexDirection: 'column' },
  labIntro: { flex: 0.78, justifyContent: 'center', padding: 44 },
  labKicker: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  labTitle: { marginTop: 24, color: colors.ink, fontFamily: fonts.display, fontSize: 58, lineHeight: 57, fontWeight: '900', letterSpacing: -3 },
  labTitleCompact: { fontSize: 41, lineHeight: 42, letterSpacing: -2 },
  labCopy: { maxWidth: 450, marginTop: 28, color: '#17151f', fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  labCanvas: { flex: 1.22, minHeight: 800, position: 'relative', overflow: 'hidden', backgroundColor: colors.ink, borderLeftWidth: 1, borderLeftColor: colors.ink },
  labCanvasCompact: { flex: 0, minHeight: 660, borderLeftWidth: 0, borderTopWidth: 1, borderTopColor: colors.ink },
  labTile: { position: 'absolute', overflow: 'hidden', borderWidth: 1, borderColor: colors.paper },
  labTileA: { left: '6%', top: '6%', width: '54%', height: '58%', transform: [{ rotate: '-3deg' }] },
  labTileB: { right: '5%', top: '15%', width: '38%', height: '54%', transform: [{ rotate: '3deg' }] },
  labTileC: { left: '25%', bottom: '5%', width: '58%', height: '34%', transform: [{ rotate: '1.5deg' }] },
  labImage: { width: '100%', height: '100%' },
  labLabel: { position: 'absolute', left: 0, bottom: 0, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: colors.paper },
  labLabelText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700' },
  labCross: { position: 'absolute', right: '4%', bottom: '3%', width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.acid },
  labCrossText: { color: colors.ink, fontSize: 28, lineHeight: 30 },
  labAnnotation: { position: 'absolute', left: '3%', bottom: '2%', color: colors.acid, fontFamily: fonts.mono, fontSize: 8, lineHeight: 14, fontWeight: '700' },
  about: { width: '100%', maxWidth: layout.max, minHeight: 760, alignSelf: 'center', flexDirection: 'row', backgroundColor: colors.paper },
  aboutCompact: { flexDirection: 'column', minHeight: 0 },
  aboutVisual: { flex: 0.9, minHeight: 760, position: 'relative', overflow: 'hidden', backgroundColor: colors.ink },
  aboutVisualCompact: { minHeight: 560 },
  aboutImage: { width: '100%', height: '100%' },
  aboutIndex: { position: 'absolute', right: 18, top: 18, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.cyan },
  aboutIndexText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.9 },
  aboutCopyWrap: { flex: 1.1, justifyContent: 'center', padding: 52 },
  aboutKicker: { color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  aboutTitle: { marginTop: 22, color: colors.ink, fontFamily: fonts.display, fontSize: 60, lineHeight: 59, fontWeight: '900', letterSpacing: -3.2 },
  aboutTitleCompact: { fontSize: 43, lineHeight: 43, letterSpacing: -2.3 },
  aboutCopy: { maxWidth: 600, marginTop: 30, color: '#33333a', fontFamily: fonts.sans, fontSize: 18, lineHeight: 28 },
  aboutQuote: { maxWidth: 580, marginTop: 34, paddingLeft: 18, color: colors.violet, fontFamily: fonts.serif, fontSize: 26, lineHeight: 33, fontStyle: 'italic', borderLeftWidth: 5, borderLeftColor: colors.acid },
  aboutFacts: { marginTop: 44, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.ink, gap: 9 },
  aboutFact: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  contact: { width: '100%', maxWidth: layout.max, alignSelf: 'center', padding: 44, backgroundColor: colors.acid },
  contactKicker: { color: colors.ink, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  contactTitle: { marginTop: 45, color: colors.ink, fontFamily: fonts.display, fontSize: 115, lineHeight: 101, fontWeight: '900', letterSpacing: -7 },
  contactTitleCompact: { fontSize: 57, lineHeight: 53, letterSpacing: -3.5 },
  contactBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, marginTop: 64 },
  contactBottomCompact: { flexDirection: 'column', alignItems: 'stretch' },
  contactNote: { flex: 1, maxWidth: 520, color: colors.ink, fontFamily: fonts.sans, fontSize: 17, lineHeight: 25 },
  contactLinks: { flex: 1, borderTopWidth: 1, borderTopColor: colors.ink },
  contactLink: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.ink },
  contactLinkActive: { paddingHorizontal: 10, backgroundColor: colors.paper },
  contactLinkText: { color: colors.ink, fontFamily: fonts.display, fontSize: 18, fontWeight: '900' },
  contactArrow: { transform: [{ rotate: '45deg' }] },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 70, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.ink },
  footerText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
