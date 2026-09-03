import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, layout } from '../../design/tokens';
import MascotSticker from './MascotSticker';

const CapabilityRow = ({ compact, index, title, detail }) => (
  <View style={[styles.capabilityRow, compact && styles.capabilityRowCompact]}>
    <View style={styles.capabilityHeader}>
      <Text style={styles.capabilityIndex}>{index}</Text>
      <Ionicons name="add" size={16} color={colors.cyan} />
    </View>
    <Text style={styles.capabilityTitle}>{title}</Text>
    <Text style={styles.capabilityDetail}>{detail}</Text>
  </View>
);

export function Manifesto({ compact }) {
  return (
    <View style={[styles.manifesto, compact && styles.manifestoCompact]}>
      <View style={styles.manifestoLead}>
        <View style={styles.manifestoLeadRail} />
        <MascotSticker index={1} size={compact ? 108 : 136} label="Mascota salamandra original" style={styles.manifestoMascot} />
        <Text style={styles.sectionKicker}>[02.A] / BUILD SYSTEM</Text>
        <Text style={[styles.manifestoTitle, compact && styles.manifestoTitleCompact]}>
          LO DIGITAL NO TIENE QUE SENTIRSE <Text style={styles.manifestoItalic}>DESECHABLE.</Text>
        </Text>
      </View>
      <View style={styles.manifestoBody}>
        <Text style={styles.manifestoCopy}>Me muevo entre la lógica de producto y la dirección visual. Primero encuentro la estructura; después decido dónde vale la pena romperla.</Text>
        <View style={[styles.capabilities, compact && styles.capabilitiesCompact]}>
          <CapabilityRow compact={compact} index="01" title="FRONTEND" detail="Interfaces web y móviles" />
          <CapabilityRow compact={compact} index="02" title="DIRECCIÓN VISUAL" detail="Sistemas con una idea reconocible" />
          <CapabilityRow compact={compact} index="03" title="PROTOTIPADO" detail="Del flujo al comportamiento" />
          <CapabilityRow compact={compact} index="04" title="ARQUITECTURA" detail="Código que permite seguir iterando" />
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
        <Text style={styles.labKicker}>[02.B] / SIGNAL LAB / 03 FRAGMENTS</Text>
        <Text style={[styles.labTitle, compact && styles.labTitleCompact]}>UN SISTEMA{`\n`}QUE PUEDE{`\n`}CAMBIAR DE PIEL.</Text>
        <Text style={styles.labCopy}>El archivo visual no es decoración: funciona como tensión entre orden técnico, ruido, textura y luz.</Text>
        <MascotSticker index={1} size={compact ? 118 : 148} label="Mascota salamandra original explorando el laboratorio visual" style={styles.labMascot} />
      </View>
      <View style={[styles.labCanvas, compact && styles.labCanvasCompact]}>
        <View style={styles.labCanvasHeader}>
          <Text style={styles.labAnnotation}>ESTRUCTURA{`\n`}ANTES QUE EFECTO →</Text>
          <View style={styles.labCross}><Text style={styles.labCrossText}>＋</Text></View>
        </View>
        <View style={[styles.labSpecimens, compact && styles.labSpecimensCompact]}>
          <LabTile source={require('../../../assets/editorial/shape-atlas.jpg')} label="A / SHAPE ATLAS" style={[styles.labTileA, compact && styles.labTileCompact]} />
          <View style={[styles.labSpecimenStack, compact && styles.labSpecimenStackCompact]}>
            <LabTile source={require('../../../assets/editorial/future-poster.jpg')} label="B / TYPE SYSTEM" style={styles.labTileB} />
            <LabTile source={require('../../../assets/editorial/signal-kit.jpg')} label="C / SIGNAL KIT" style={styles.labTileC} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function About({ compact }) {
  return (
    <View style={[styles.about, compact && styles.aboutCompact]}>
      <View style={[styles.aboutVisual, compact && styles.aboutVisualCompact]}>
        <Image source={require('../../../assets/editorial/shape-atlas.jpg')} style={styles.aboutImage} resizeMode="cover" accessibilityLabel="Atlas editorial de formas geométricas en blanco y negro" />
        <View style={styles.aboutImageShade} />
        <View style={styles.aboutIndex}><Text style={styles.aboutIndexText}>AS / 26</Text></View>
        <View style={styles.aboutVisualFrame} />
      </View>
      <View style={styles.aboutCopyWrap}>
        <View style={styles.aboutFileTop}>
          <Text style={styles.aboutKicker}>[03] / PLAYER FILE</Text>
          <MascotSticker index={2} size={compact ? 104 : 128} label="Mascota nutria original del perfil" style={styles.aboutMascot} />
        </View>
        <Text style={[styles.aboutTitle, compact && styles.aboutTitleCompact]}>DESARROLLO{`\n`}CON CRITERIO{`\n`}VISUAL.</Text>
        <Text style={styles.aboutCopy}>Soy Anderson Solano, desarrollador frontend en Costa Rica. Me interesan los productos donde la experiencia, el movimiento y la implementación forman una sola conversación.</Text>
        <Text style={styles.aboutQuote}>“La rareza sirve cuando también mejora la lectura.”</Text>
        <View style={[styles.aboutFacts, compact && styles.aboutFactsCompact]}>
          <View style={styles.aboutFactCell}><Text style={styles.aboutFact}>BASE / COSTA RICA</Text></View>
          <View style={styles.aboutFactCell}><Text style={styles.aboutFact}>FOCUS / WEB + MOBILE</Text></View>
          <View style={styles.aboutFactCell}><Text style={styles.aboutFact}>STATUS / OPEN TO WORK</Text></View>
        </View>
      </View>
    </View>
  );
}

const ContactLink = ({ icon, label, onPress }) => (
  <Pressable accessibilityRole="link" accessibilityLabel={`Abrir ${label}`} onPress={onPress}>
    {({ focused, hovered, pressed }) => {
      const active = pressed || hovered || focused;
      return (
        <View style={[styles.contactLink, active && styles.contactLinkActive]}>
          <View style={styles.contactLinkLead}>
            <View style={[styles.contactIconFrame, active && styles.contactIconFrameActive]}>
              <Ionicons name={icon} size={18} color={active ? colors.ink : colors.cyan} />
            </View>
            <Text style={[styles.contactLinkText, active && styles.contactLinkTextActive]}>{label}</Text>
          </View>
          <View style={styles.channelTail}>
            <View style={[styles.channelDot, active && styles.channelDotActive]} />
            <Ionicons name="arrow-up" size={21} color={active ? colors.ink : colors.acid} style={styles.contactArrow} />
          </View>
        </View>
      );
    }}
  </Pressable>
);

export function Contact({ compact, email, linkedin }) {
  return (
    <View style={[styles.contact, compact && styles.contactCompact]}>
      <View accessibilityElementsHidden style={styles.contactSignalField}>
        <View style={[styles.contactRing, styles.contactRingA]} />
        <View style={[styles.contactRing, styles.contactRingB]} />
        <View style={styles.contactSignalRule} />
      </View>
      <MascotSticker index={3} size={compact ? 122 : 166} label="Mascota gato espectral original de contacto" style={styles.contactMascot} />
      <Text style={styles.contactKicker}>¿TIENES UNA IDEA QUE MERECE UNA FORMA PROPIA?</Text>
      <Text style={[styles.contactTitle, compact && styles.contactTitleCompact]}>HAGAMOS{`\n`}QUE EMITA{`\n`}SEÑAL.</Text>
      <View style={[styles.contactBottom, compact && styles.contactBottomCompact]}>
        <View style={styles.contactMessagePanel}>
          <View style={styles.waveform}>
            {[10, 22, 34, 17, 41, 26, 13, 31, 19, 38, 15, 28].map((height, index) => <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />)}
          </View>
          <Text style={styles.contactNote}>Disponible para proyectos, productos digitales y colaboraciones donde diseño y código tengan el mismo peso.</Text>
        </View>
        <View style={styles.contactLinks}>
          <ContactLink icon="mail-outline" label="EMAIL" onPress={() => Linking.openURL(`mailto:${email}`)} />
          <ContactLink icon="logo-linkedin" label="LINKEDIN" onPress={() => Linking.openURL(linkedin)} />
          <ContactLink icon="logo-github" label="GITHUB" onPress={() => Linking.openURL('https://github.com/Kokeeu')} />
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
  manifesto: { width: '100%', maxWidth: layout.max, alignSelf: 'center', flexDirection: 'row', gap: 12, padding: layout.gutter, backgroundColor: colors.ink },
  manifestoCompact: { flexDirection: 'column', paddingHorizontal: layout.mobileGutter, paddingVertical: 56 },
  manifestoLead: { flex: 0.95, minHeight: 510, justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', padding: 36, backgroundColor: colors.violet, borderWidth: 1, borderColor: colors.cyan },
  manifestoLeadRail: { position: 'absolute', left: 0, right: 0, top: 18, height: 8, backgroundColor: colors.ink, opacity: 0.26 },
  manifestoMascot: { position: 'absolute', right: 18, top: 32, transform: [{ rotate: '7deg' }] },
  sectionKicker: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  manifestoTitle: { marginTop: 20, color: colors.paper, fontFamily: fonts.display, fontSize: 65, lineHeight: 62, fontWeight: '900', letterSpacing: -1 },
  manifestoTitleCompact: { fontSize: 45, lineHeight: 43, letterSpacing: -0.5 },
  manifestoItalic: { color: colors.cyan, fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: '400' },
  manifestoBody: { flex: 1.05, minHeight: 510, justifyContent: 'space-between', padding: 28, backgroundColor: '#0b2039', borderWidth: 1, borderColor: colors.navy },
  manifestoCopy: { maxWidth: 610, color: colors.paper, fontFamily: fonts.sans, fontSize: 18, lineHeight: 27 },
  capabilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 32 },
  capabilitiesCompact: { flexDirection: 'column' },
  capabilityRow: { width: '48.8%', minHeight: 155, justifyContent: 'flex-end', padding: 17, backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.violet },
  capabilityRowCompact: { width: '100%' },
  capabilityHeader: { position: 'absolute', left: 17, right: 17, top: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  capabilityIndex: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  capabilityTitle: { color: colors.paper, fontFamily: fonts.display, fontSize: 21, lineHeight: 22, fontWeight: '900' },
  capabilityDetail: { marginTop: 8, color: colors.fog, fontFamily: fonts.mono, fontSize: 8, lineHeight: 13 },
  lab: { width: '100%', maxWidth: layout.max, minHeight: 760, alignSelf: 'center', flexDirection: 'row', backgroundColor: colors.violet },
  labCompact: { flexDirection: 'column', minHeight: 0 },
  labIntro: { flex: 0.76, justifyContent: 'center', position: 'relative', padding: 44, borderRightWidth: 1, borderRightColor: colors.ink },
  labMascot: { alignSelf: 'flex-end', marginTop: 30, marginBottom: -34, transform: [{ rotate: '-7deg' }] },
  labKicker: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  labTitle: { marginTop: 24, color: colors.ink, fontFamily: fonts.display, fontSize: 61, lineHeight: 57, fontWeight: '900', letterSpacing: -0.7 },
  labTitleCompact: { fontSize: 45, lineHeight: 43, letterSpacing: -0.4 },
  labCopy: { maxWidth: 450, marginTop: 28, color: colors.ink, fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  labCanvas: { flex: 1.24, minHeight: 760, padding: 16, backgroundColor: colors.ink },
  labCanvasCompact: { flex: 0, minHeight: 980, borderTopWidth: 1, borderTopColor: colors.ink },
  labCanvasHeader: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 7, borderBottomWidth: 1, borderBottomColor: colors.navy },
  labAnnotation: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, lineHeight: 14, fontWeight: '700' },
  labCross: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.acid },
  labCrossText: { color: colors.ink, fontSize: 25, lineHeight: 27 },
  labSpecimens: { flex: 1, flexDirection: 'row', gap: 12, paddingTop: 12 },
  labSpecimensCompact: { flexDirection: 'column' },
  labSpecimenStack: { flex: 0.82, gap: 12 },
  labSpecimenStackCompact: { minHeight: 490 },
  labTile: { flex: 1, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.paper },
  labTileA: { flex: 1.18 },
  labTileCompact: { minHeight: 380 },
  labTileB: { flex: 1.08 },
  labTileC: { flex: 0.92 },
  labImage: { width: '100%', height: '100%' },
  labLabel: { position: 'absolute', left: 0, bottom: 0, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: colors.paper },
  labLabelText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700' },
  about: { width: '100%', maxWidth: layout.max, minHeight: 780, alignSelf: 'center', flexDirection: 'row', padding: 20, gap: 20, backgroundColor: colors.paper },
  aboutCompact: { flexDirection: 'column', minHeight: 0, paddingHorizontal: layout.mobileGutter, paddingVertical: 54 },
  aboutVisual: { flex: 0.82, minHeight: 740, position: 'relative', overflow: 'hidden', backgroundColor: colors.ink },
  aboutVisualCompact: { minHeight: 500 },
  aboutImage: { width: '100%', height: '100%' },
  aboutImageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,120,242,0.17)' },
  aboutVisualFrame: { position: 'absolute', left: 17, right: 17, top: 17, bottom: 17, borderWidth: 1, borderColor: colors.paper },
  aboutIndex: { position: 'absolute', right: 18, top: 18, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.cyan },
  aboutIndexText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.9 },
  aboutCopyWrap: { flex: 1.18, justifyContent: 'center', position: 'relative', padding: 40, borderWidth: 1, borderColor: colors.ink },
  aboutFileTop: { minHeight: 95, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.ink },
  aboutMascot: { marginTop: -30, transform: [{ rotate: '7deg' }] },
  aboutKicker: { color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  aboutTitle: { marginTop: 28, color: colors.ink, fontFamily: fonts.display, fontSize: 65, lineHeight: 61, fontWeight: '900', letterSpacing: -0.8 },
  aboutTitleCompact: { fontSize: 46, lineHeight: 44, letterSpacing: -0.4 },
  aboutCopy: { maxWidth: 600, marginTop: 27, color: colors.navy, fontFamily: fonts.sans, fontSize: 18, lineHeight: 28 },
  aboutQuote: { maxWidth: 580, marginTop: 30, paddingLeft: 18, color: colors.violet, fontFamily: fonts.serif, fontSize: 24, lineHeight: 31, fontStyle: 'italic', borderLeftWidth: 5, borderLeftColor: colors.acid },
  aboutFacts: { flexDirection: 'row', marginTop: 38, borderTopWidth: 1, borderTopColor: colors.ink, borderLeftWidth: 1, borderLeftColor: colors.ink },
  aboutFactsCompact: { flexDirection: 'column' },
  aboutFactCell: { flex: 1, minHeight: 66, justifyContent: 'center', padding: 10, borderRightWidth: 1, borderRightColor: colors.ink, borderBottomWidth: 1, borderBottomColor: colors.ink },
  aboutFact: { color: colors.ink, fontFamily: fonts.mono, fontSize: 7, lineHeight: 12, fontWeight: '700', letterSpacing: 0.6 },
  contact: { width: '100%', maxWidth: layout.max, minHeight: 760, alignSelf: 'center', position: 'relative', overflow: 'hidden', padding: 48, backgroundColor: '#071522' },
  contactCompact: { paddingHorizontal: layout.mobileGutter, paddingVertical: 58 },
  contactSignalField: { ...StyleSheet.absoluteFillObject },
  contactRing: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: colors.cyan, opacity: 0.2 },
  contactRingA: { width: 520, height: 520, right: -90, top: -80 },
  contactRingB: { width: 330, height: 330, right: 5, top: 15, borderColor: colors.acid },
  contactSignalRule: { position: 'absolute', left: 0, right: 0, top: 310, height: 1, backgroundColor: colors.cyan, opacity: 0.18 },
  contactMascot: { position: 'absolute', zIndex: 2, right: '7%', top: 12, transform: [{ rotate: '-8deg' }] },
  contactKicker: { zIndex: 2, color: colors.cyan, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  contactTitle: { zIndex: 2, maxWidth: 900, marginTop: 45, color: colors.paper, fontFamily: fonts.display, fontSize: 112, lineHeight: 98, fontWeight: '900', letterSpacing: -1.5 },
  contactTitleCompact: { maxWidth: '76%', fontSize: 59, lineHeight: 54, letterSpacing: -0.6 },
  contactBottom: { zIndex: 2, flexDirection: 'row', alignItems: 'stretch', gap: 18, marginTop: 66 },
  contactBottomCompact: { flexDirection: 'column' },
  contactMessagePanel: { flex: 0.8, justifyContent: 'space-between', minHeight: 220, padding: 22, backgroundColor: colors.navy, borderWidth: 1, borderColor: colors.cyan },
  waveform: { height: 52, flexDirection: 'row', alignItems: 'center', gap: 6 },
  waveBar: { width: 3, backgroundColor: colors.acid },
  contactNote: { maxWidth: 520, color: colors.paper, fontFamily: fonts.sans, fontSize: 17, lineHeight: 25 },
  contactLinks: { flex: 1.2, borderTopWidth: 1, borderTopColor: colors.cyan },
  contactLink: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: colors.cyan },
  contactLinkActive: { backgroundColor: colors.cyan, transform: [{ translateX: 7 }] },
  contactLinkLead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  contactIconFrame: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cyan },
  contactIconFrameActive: { borderColor: colors.ink },
  contactLinkText: { color: colors.paper, fontFamily: fonts.display, fontSize: 21, fontWeight: '900' },
  contactLinkTextActive: { color: colors.ink },
  channelTail: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  channelDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cyan },
  channelDotActive: { backgroundColor: colors.acid },
  contactArrow: { transform: [{ rotate: '45deg' }] },
  footer: { zIndex: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 70, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.navy },
  footerText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
