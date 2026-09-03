import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCasos } from '../../../data/proyectos';
import { colors, fonts, layout } from '../../design/tokens';
import { getProjectImage, getProjectScheme } from './CaseVisual';
import { useGameTransition } from './GameTransition';
import MascotSticker from './MascotSticker';

const SlideMeta = ({ caso, dark = false }) => (
  <View style={styles.slideMeta}>
    <Text style={[styles.slideMetaText, dark && styles.slideMetaDark]}>{caso.indice} / {caso.anio}</Text>
    <Text style={[styles.slideMetaText, dark && styles.slideMetaDark]}>{caso.categoria}</Text>
  </View>
);

function ProjectSlide({ caso, variant, compact, onPress }) {
  const scheme = getProjectScheme(caso.repo);
  const darkCopy = variant === 'data' || variant === 'quote';

  if (variant === 'lead') {
    return (
      <Pressable accessibilityRole="link" accessibilityLabel={`Abrir caso de estudio: ${caso.titulo}`} onPress={onPress} style={({ pressed, hovered }) => [styles.slide, styles.leadSlide, (pressed || hovered) && styles.slideActive]}>
        <Image source={getProjectImage(caso.repo)} style={styles.fullImage} resizeMode={caso.repo === 'Siwo' ? 'contain' : 'cover'} accessibilityLabel={`Visual de ${caso.titulo}`} />
        <View style={styles.leadShade} />
        <View style={styles.leadFrame} />
        <SlideMeta caso={caso} />
        <View style={styles.leadCopy}>
          <Text style={styles.leadTitle}>{caso.titulo.toUpperCase()}</Text>
          <Text style={styles.leadPhrase}>{caso.frase}</Text>
        </View>
        <View style={[styles.metricStamp, { backgroundColor: scheme.accent }]}>
          <Text style={[styles.metricStampValue, { color: scheme.ink }]}>{caso.metrica}</Text>
          <Text style={[styles.metricStampLabel, { color: scheme.ink }]}>MISSION SIGNAL</Text>
        </View>
      </Pressable>
    );
  }

  if (variant === 'data') {
    return (
      <Pressable accessibilityRole="link" accessibilityLabel={`Abrir caso de estudio: ${caso.titulo}`} onPress={onPress} style={({ pressed, hovered }) => [styles.slide, styles.dataSlide, { backgroundColor: scheme.accent }, (pressed || hovered) && styles.slideActive]}>
        <SlideMeta caso={caso} dark />
        <View style={styles.dataVisual}>
          <Image source={getProjectImage(caso.repo)} style={styles.fullImage} resizeMode="cover" accessibilityLabel={`Visual de ${caso.titulo}`} />
          <View style={styles.dataCross}><Text style={styles.dataCrossText}>＋</Text></View>
        </View>
        <View style={styles.dataCopy}>
          <Text style={[styles.dataTitle, { color: scheme.ink }]}>{caso.titulo.toUpperCase()}</Text>
          <Text style={[styles.dataSummary, { color: scheme.ink }]}>{caso.resumen}</Text>
          <View style={[styles.dataRule, { backgroundColor: scheme.ink }]} />
          <Text style={[styles.dataRole, { color: scheme.ink }]}>{caso.rol}</Text>
        </View>
      </Pressable>
    );
  }

  if (variant === 'quote') {
    return (
      <Pressable accessibilityRole="link" accessibilityLabel={`Abrir caso de estudio: ${caso.titulo}`} onPress={onPress} style={({ pressed, hovered }) => [styles.slide, styles.quoteSlide, { backgroundColor: scheme.accent }, (pressed || hovered) && styles.slideActive]}>
        <SlideMeta caso={caso} dark={darkCopy} />
        <Text style={[styles.quoteMark, { color: scheme.ink }]}>“</Text>
        <Text style={[styles.quoteText, compact && styles.quoteTextCompact, { color: scheme.ink }]}>{caso.frase}</Text>
        <View style={styles.quoteVisual}>
          <Image source={getProjectImage(caso.repo)} style={styles.fullImage} resizeMode="cover" accessibilityLabel={`Visual de ${caso.titulo}`} />
        </View>
        <View style={styles.quoteFooter}>
          <Text style={[styles.quoteTitle, { color: scheme.ink }]}>{caso.titulo.toUpperCase()}</Text>
          <Ionicons name="arrow-forward" size={23} color={scheme.ink} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`Abrir caso de estudio: ${caso.titulo}`} onPress={onPress} style={({ pressed, hovered }) => [styles.slide, styles.systemSlide, (pressed || hovered) && styles.slideActive]}>
      <SlideMeta caso={caso} />
      <View style={styles.systemGrid}>
        <View style={styles.systemCopy}>
          <Text style={styles.systemTitle}>{caso.titulo.toUpperCase()}</Text>
          <Text style={styles.systemPhrase}>{caso.frase}</Text>
          <View style={styles.stackRow}>
            {caso.stack.slice(0, 3).map((item) => <Text key={item} style={styles.stackTag}>{item}</Text>)}
          </View>
        </View>
        <View style={styles.systemVisual}>
          <Image source={getProjectImage(caso.repo)} style={styles.fullImage} resizeMode="cover" accessibilityLabel={`Visual de ${caso.titulo}`} />
          <View style={styles.systemTarget}><Text style={styles.systemTargetText}>◎</Text></View>
        </View>
      </View>
      <View style={styles.systemFooter}>
        <Text style={styles.systemFooterText}>OPEN MISSION BRIEF</Text>
        <Text style={styles.systemFooterText}>{caso.indice} — {caso.metrica}</Text>
      </View>
    </Pressable>
  );
}

export default function ProjectArchive({ compact }) {
  const { navigate } = useGameTransition();
  const projects = obtenerCasos();
  const openProject = (repo, index) => navigate({ pathname: '/proyecto/[nombre]', params: { nombre: repo } }, { label: index });

  return (
    <View style={styles.section}>
      <View style={[styles.heading, compact && styles.headingCompact]}>
        <View>
          <Text style={styles.kicker}>[01] / MISSION SELECT / 04 ACTIVE</Text>
          <Text style={[styles.headingTitle, compact && styles.headingTitleCompact]}>ELIGE UNA{`\n`}SEÑAL PARA{`\n`}DESBLOQUEAR.</Text>
        </View>
        <View style={styles.headingAside}>
          <MascotSticker index={0} size={compact ? 118 : 156} label="Mascota zorro original de la ruta Misiones" style={styles.missionMascot} />
          <Text style={styles.headingCount}>04</Text>
          <Text style={styles.headingNote}>CADA MISIÓN CONTIENE UN PROBLEMA,{`\n`}UN SISTEMA Y DECISIONES REALES.</Text>
        </View>
      </View>

      <View style={[styles.deck, compact && styles.deckCompact]}>
        <View style={[styles.deckRow, compact && styles.deckRowCompact]}>
          <View style={styles.deckLead}><ProjectSlide caso={projects[0]} variant="lead" compact={compact} onPress={() => openProject(projects[0].repo, projects[0].indice)} /></View>
          <View style={styles.deckSide}><ProjectSlide caso={projects[1]} variant="data" compact={compact} onPress={() => openProject(projects[1].repo, projects[1].indice)} /></View>
        </View>
        <View style={[styles.deckRow, styles.deckRowBottom, compact && styles.deckRowCompact]}>
          <View style={styles.deckQuote}><ProjectSlide caso={projects[2]} variant="quote" compact={compact} onPress={() => openProject(projects[2].repo, projects[2].indice)} /></View>
          <View style={styles.deckSystem}><ProjectSlide caso={projects[3]} variant="system" compact={compact} onPress={() => openProject(projects[3].repo, projects[3].indice)} /></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', maxWidth: layout.max, alignSelf: 'center', paddingVertical: 108, backgroundColor: colors.ink },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, paddingHorizontal: layout.gutter, marginBottom: 52 },
  headingCompact: { flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: layout.mobileGutter, marginBottom: 34 },
  kicker: { color: colors.acid, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  headingTitle: { marginTop: 16, color: colors.paper, fontFamily: fonts.display, fontSize: 71, lineHeight: 66, fontWeight: '900', letterSpacing: -1.5 },
  headingTitleCompact: { fontSize: 47, lineHeight: 45, letterSpacing: -1 },
  headingAside: { alignItems: 'flex-end', gap: 10 },
  missionMascot: { marginBottom: -56, marginRight: 66, zIndex: 2, transform: [{ rotate: '7deg' }] },
  headingCount: { color: colors.violet, fontFamily: fonts.display, fontSize: 70, lineHeight: 68, fontWeight: '900' },
  headingNote: { maxWidth: 280, color: colors.fog, fontFamily: fonts.mono, fontSize: 8, lineHeight: 15, letterSpacing: 0.7, textAlign: 'right' },
  deck: { paddingHorizontal: layout.gutter, gap: 12 },
  deckCompact: { paddingHorizontal: layout.mobileGutter },
  deckRow: { minHeight: 570, flexDirection: 'row', gap: 12 },
  deckRowBottom: { minHeight: 480 },
  deckRowCompact: { minHeight: 0, flexDirection: 'column' },
  deckLead: { flex: 1.35 },
  deckSide: { flex: 0.75 },
  deckQuote: { flex: 0.82 },
  deckSystem: { flex: 1.18 },
  slide: { flex: 1, minHeight: 460, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.navy },
  slideActive: { transform: [{ translateY: -4 }], borderColor: colors.acid },
  leadSlide: { backgroundColor: colors.navy },
  fullImage: { width: '100%', height: '100%', backgroundColor: colors.navy },
  leadShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,13,27,0.2)' },
  leadFrame: { position: 'absolute', left: 18, right: 18, top: 18, bottom: 18, borderWidth: 1, borderColor: 'rgba(242,241,236,0.7)' },
  slideMeta: { position: 'absolute', zIndex: 3, left: 20, right: 20, top: 19, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  slideMetaText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  slideMetaDark: { color: colors.ink },
  leadCopy: { position: 'absolute', left: 19, right: 19, bottom: 18, padding: 22, backgroundColor: 'rgba(7,13,27,0.95)' },
  leadTitle: { color: colors.paper, fontFamily: fonts.display, fontSize: 50, lineHeight: 49, fontWeight: '900', letterSpacing: -2.8 },
  leadPhrase: { maxWidth: 560, marginTop: 10, color: colors.fog, fontFamily: fonts.serif, fontSize: 18, lineHeight: 24, fontStyle: 'italic' },
  metricStamp: { position: 'absolute', right: 32, top: 52, width: 92, height: 92, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '4deg' }] },
  metricStampValue: { fontFamily: fonts.display, fontSize: 28, lineHeight: 30, fontWeight: '900' },
  metricStampLabel: { marginTop: 4, fontFamily: fonts.mono, fontSize: 5, fontWeight: '700', letterSpacing: 0.5 },
  dataSlide: { padding: 20 },
  dataVisual: { height: '49%', marginTop: 35, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.ink },
  dataCross: { position: 'absolute', right: 0, bottom: 0, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  dataCrossText: { color: colors.ink, fontSize: 24 },
  dataCopy: { flex: 1, justifyContent: 'flex-end', paddingTop: 20 },
  dataTitle: { fontFamily: fonts.display, fontSize: 34, lineHeight: 34, fontWeight: '900', letterSpacing: -1.7 },
  dataSummary: { marginTop: 10, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18 },
  dataRule: { height: 1, marginTop: 17 },
  dataRole: { marginTop: 9, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  quoteSlide: { padding: 24 },
  quoteMark: { marginTop: 32, fontFamily: fonts.serif, fontSize: 74, lineHeight: 64 },
  quoteText: { width: '73%', fontFamily: fonts.display, fontSize: 30, lineHeight: 31, fontWeight: '900', letterSpacing: -1.2 },
  quoteTextCompact: { fontSize: 26, lineHeight: 28 },
  quoteVisual: { position: 'absolute', right: -16, top: 92, width: '39%', height: '54%', overflow: 'hidden', borderWidth: 1, borderColor: colors.ink, transform: [{ rotate: '4deg' }] },
  quoteFooter: { position: 'absolute', left: 24, right: 24, bottom: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.ink },
  quoteTitle: { fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 0.9 },
  systemSlide: { padding: 20, backgroundColor: colors.ink },
  systemGrid: { flex: 1, flexDirection: 'row', gap: 18, marginTop: 38, marginBottom: 52 },
  systemCopy: { flex: 1, justifyContent: 'center' },
  systemTitle: { color: colors.paper, fontFamily: fonts.display, fontSize: 38, lineHeight: 38, fontWeight: '900', letterSpacing: -2 },
  systemPhrase: { marginTop: 14, color: colors.fog, fontFamily: fonts.serif, fontSize: 17, lineHeight: 23, fontStyle: 'italic' },
  stackRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 24 },
  stackTag: { paddingHorizontal: 7, paddingVertical: 5, color: colors.cyan, fontFamily: fonts.mono, fontSize: 6, fontWeight: '700', borderWidth: 1, borderColor: colors.navy },
  systemVisual: { flex: 0.78, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.paper },
  systemTarget: { position: 'absolute', left: '50%', top: '50%', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginLeft: -28, marginTop: -28, borderRadius: 30, backgroundColor: colors.acid },
  systemTargetText: { color: colors.ink, fontSize: 28 },
  systemFooter: { position: 'absolute', left: 20, right: 20, bottom: 16, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 11, borderTopWidth: 1, borderTopColor: '#555560' },
  systemFooterText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
