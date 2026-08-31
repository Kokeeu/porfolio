import { Linking, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCasoProyecto, obtenerSiguienteProyecto, PROYECTOS_DESTACADOS } from '../../data/proyectos';
import CaseVisual, { getProjectScheme } from '../../src/components/portfolio/CaseVisual';
import { colors, fonts, layout } from '../../src/design/tokens';

const GITHUB_USER = 'Kokeeu';

export function generateStaticParams() {
  return PROYECTOS_DESTACADOS.map((nombre) => ({ nombre }));
}

const NavAction = ({ label, onPress, icon }) => (
  <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={onPress} style={({ pressed, hovered }) => [styles.navAction, (pressed || hovered) && styles.navActionActive]}>
    <Ionicons name={icon} size={15} color={colors.paper} />
    <Text style={styles.navActionText}>{label}</Text>
  </Pressable>
);

const ProjectLink = ({ label, onPress, light = false }) => (
  <Pressable accessibilityRole="link" onPress={onPress} style={({ pressed, hovered }) => [styles.projectLink, light && styles.projectLinkLight, (pressed || hovered) && styles.projectLinkActive]}>
    <Text style={[styles.projectLinkText, light && styles.projectLinkTextLight]}>{label}</Text>
    <Ionicons name="arrow-forward" size={16} color={light ? colors.ink : colors.paper} />
  </Pressable>
);

const Metric = ({ value, label, accent }) => (
  <View style={styles.metric}>
    <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

export default function ProjectPage() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const routeName = Array.isArray(nombre) ? nombre[0] : nombre;
  const caso = obtenerCasoProyecto(routeName);

  if (!caso) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundCode}>404</Text>
        <Text style={styles.notFoundText}>ESTE CASO NO EXISTE EN EL ARCHIVO.</Text>
        <ProjectLink label="VOLVER AL INICIO" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const next = obtenerSiguienteProyecto(caso.repo);
  const scheme = getProjectScheme(caso.repo);
  const githubUrl = `https://github.com/${GITHUB_USER}/${caso.repo}`;

  return (
    <View style={styles.page}>
      <Head>
        <title>{caso.titulo} — Anderson Solano</title>
        <meta name="description" content={caso.resumen} />
        <meta name="theme-color" content="#050507" />
        <meta property="og:title" content={`${caso.titulo} — Anderson Solano`} />
        <meta property="og:description" content={caso.resumen} />
      </Head>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <NavAction label="VOLVER" icon="arrow-back" onPress={() => router.replace('/')} />
          <View style={styles.brand}>
            <Text style={styles.brandMark}>AS</Text>
            <Text style={styles.brandText}>PROJECT ARCHIVE / {caso.indice}</Text>
          </View>
          <NavAction label="GITHUB" icon="logo-github" onPress={() => Linking.openURL(githubUrl)} />
        </View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={styles.heroCopy}>
            <View style={styles.heroMeta}>
              <Text style={[styles.heroMetaText, { color: scheme.accent }]}>{caso.categoria}</Text>
              <Text style={styles.heroMetaText}>{caso.anio} / COSTA RICA</Text>
            </View>
            <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>{caso.titulo.toUpperCase()}</Text>
            <Text style={styles.heroThesis}>{caso.frase}</Text>
            <Text style={styles.heroSummary}>{caso.resumen}</Text>
            <View style={styles.heroLinks}>
              <ProjectLink label="VER CÓDIGO" onPress={() => Linking.openURL(githubUrl)} />
              {caso.demo ? <ProjectLink label="ABRIR DEMO" light onPress={() => Linking.openURL(caso.demo)} /> : null}
            </View>
          </View>
          <View style={styles.heroVisual}><CaseVisual caso={caso} compact={compact} hero={!compact} /></View>
        </View>

        <View style={[styles.metrics, compact && styles.metricsCompact]}>
          <Metric value={caso.metrica} label={caso.etiquetaMetrica} accent={scheme.accent} />
          <Metric value={caso.stack.length.toString().padStart(2, '0')} label="PIEZAS DEL STACK" accent={scheme.accent} />
          <Metric value={caso.indice} label="CASO EN EL ARCHIVO" accent={scheme.accent} />
        </View>

        <View style={[styles.story, compact && styles.storyCompact]}>
          <View style={[styles.storyPanel, styles.storyProblem]}>
            <Text style={styles.storyIndex}>01 / EL PROBLEMA</Text>
            <Text style={styles.storyTitle}>HABÍA RUIDO.{`\n`}FALTABA UNA RUTA.</Text>
            <Text style={styles.storyText}>{caso.problema}</Text>
          </View>
          <View style={[styles.storyPanel, { backgroundColor: scheme.accent }]}>
            <Text style={[styles.storyIndex, { color: scheme.ink }]}>02 / LA RESPUESTA</Text>
            <Text style={[styles.storyTitle, { color: scheme.ink }]}>LA ESTRUCTURA{`\n`}EMPEZÓ A HABLAR.</Text>
            <Text style={[styles.storyText, { color: scheme.ink }]}>{caso.solucion}</Text>
          </View>
        </View>

        <View style={[styles.decisions, compact && styles.decisionsCompact]}>
          <View style={styles.decisionsLead}>
            <Text style={styles.decisionsKicker}>[03] / DECISIONES QUE MUEVEN EL PROYECTO</Text>
            <Text style={[styles.decisionsTitle, compact && styles.decisionsTitleCompact]}>NO FUE{`\n`}SOLO HACERLO{`\n`}FUNCIONAR.</Text>
            <Text style={styles.decisionsQuote}>{caso.notaAutor}</Text>
          </View>
          <View style={styles.decisionsList}>
            {caso.decisiones.map((decision, index) => (
              <View key={decision} style={styles.decision}>
                <Text style={[styles.decisionIndex, { color: scheme.accent }]}>0{index + 1}</Text>
                <Text style={styles.decisionText}>{decision}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.outcome, compact && styles.outcomeCompact]}>
          <View style={styles.stackBlock}>
            <Text style={styles.outcomeKicker}>STACK / MATERIAL</Text>
            <View style={styles.stackList}>
              {caso.stack.map((technology) => <Text key={technology} style={styles.stackItem}>{technology}</Text>)}
            </View>
          </View>
          <View style={styles.resultsBlock}>
            <Text style={styles.outcomeKicker}>RESULTADO / SEÑALES</Text>
            {caso.resultados.map((result, index) => (
              <View key={result} style={styles.resultRow}>
                <Text style={styles.resultNumber}>{index + 1}</Text>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.futureBlock, { backgroundColor: scheme.accent }]}>
            <Text style={[styles.outcomeKicker, { color: scheme.ink }]}>SIGUIENTE ITERACIÓN</Text>
            <Text style={[styles.futureText, { color: scheme.ink }]}>{caso.loQueCambiaria}</Text>
          </View>
        </View>

        <Pressable accessibilityRole="link" accessibilityLabel={`Siguiente caso: ${next.titulo}`} onPress={() => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: next.repo } })} style={({ pressed }) => [styles.next, { backgroundColor: scheme.accent }, pressed && styles.nextPressed]}>
          <View>
            <Text style={[styles.nextKicker, { color: scheme.ink }]}>SIGUIENTE CASO / {next.indice}</Text>
            <Text style={[styles.nextTitle, compact && styles.nextTitleCompact, { color: scheme.ink }]}>{next.titulo.toUpperCase()}</Text>
          </View>
          <View style={[styles.nextArrow, { borderColor: scheme.ink }]}><Ionicons name="arrow-forward" size={34} color={scheme.ink} /></View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', alignItems: 'stretch', backgroundColor: colors.ink },
  topbar: { width: '100%', maxWidth: layout.max, minHeight: 74, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#3c3c44' },
  navAction: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  navActionActive: { opacity: 0.62 },
  navActionText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { color: colors.acid, fontFamily: fonts.display, fontSize: 19, fontWeight: '900' },
  brandText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  hero: { width: '100%', maxWidth: layout.max, minHeight: 720, alignSelf: 'center', flexDirection: 'row' },
  heroCompact: { flexDirection: 'column' },
  heroCopy: { flex: 1, justifyContent: 'center', padding: 42 },
  heroVisual: { flex: 0.9 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  heroMetaText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  heroTitle: { marginTop: 54, color: colors.paper, fontFamily: fonts.display, fontSize: 88, lineHeight: 82, fontWeight: '900', letterSpacing: -5 },
  heroTitleCompact: { marginTop: 38, fontSize: 50, lineHeight: 49, letterSpacing: -3 },
  heroThesis: { maxWidth: 650, marginTop: 30, color: colors.paper, fontFamily: fonts.serif, fontSize: 28, lineHeight: 35, fontStyle: 'italic' },
  heroSummary: { maxWidth: 620, marginTop: 24, color: colors.fog, fontFamily: fonts.sans, fontSize: 16, lineHeight: 25 },
  heroLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 34 },
  projectLink: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 18, borderWidth: 1, borderColor: colors.paper },
  projectLinkLight: { backgroundColor: colors.paper },
  projectLinkActive: { transform: [{ translateY: -2 }], borderColor: colors.acid },
  projectLinkText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  projectLinkTextLight: { color: colors.ink },
  metrics: { width: '100%', maxWidth: layout.max, minHeight: 190, alignSelf: 'center', flexDirection: 'row', backgroundColor: '#0c0c10', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#3c3c44' },
  metricsCompact: { flexDirection: 'column' },
  metric: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, borderRightWidth: 1, borderRightColor: '#3c3c44' },
  metricValue: { fontFamily: fonts.display, fontSize: 49, fontWeight: '900', letterSpacing: -2 },
  metricLabel: { marginTop: 8, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  story: { width: '100%', maxWidth: layout.max, minHeight: 560, alignSelf: 'center', flexDirection: 'row' },
  storyCompact: { flexDirection: 'column' },
  storyPanel: { flex: 1, justifyContent: 'center', padding: 48 },
  storyProblem: { backgroundColor: colors.paper },
  storyIndex: { color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  storyTitle: { marginTop: 24, color: colors.ink, fontFamily: fonts.display, fontSize: 45, lineHeight: 44, fontWeight: '900', letterSpacing: -2.3 },
  storyText: { maxWidth: 580, marginTop: 26, color: '#38383e', fontFamily: fonts.sans, fontSize: 17, lineHeight: 27 },
  decisions: { width: '100%', maxWidth: layout.max, alignSelf: 'center', flexDirection: 'row', gap: 70, paddingHorizontal: 42, paddingVertical: 120, backgroundColor: colors.ink },
  decisionsCompact: { flexDirection: 'column', gap: 58, paddingHorizontal: 20, paddingVertical: 86 },
  decisionsLead: { flex: 0.9 },
  decisionsList: { flex: 1.1, borderTopWidth: 1, borderTopColor: '#4b4b54' },
  decisionsKicker: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  decisionsTitle: { marginTop: 20, color: colors.paper, fontFamily: fonts.display, fontSize: 57, lineHeight: 56, fontWeight: '900', letterSpacing: -3 },
  decisionsTitleCompact: { fontSize: 42, lineHeight: 42, letterSpacing: -2.3 },
  decisionsQuote: { maxWidth: 560, marginTop: 30, color: colors.fog, fontFamily: fonts.serif, fontSize: 24, lineHeight: 32, fontStyle: 'italic' },
  decision: { minHeight: 105, flexDirection: 'row', alignItems: 'center', gap: 22, borderBottomWidth: 1, borderBottomColor: '#4b4b54' },
  decisionIndex: { width: 28, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700' },
  decisionText: { flex: 1, color: colors.paper, fontFamily: fonts.sans, fontSize: 15, lineHeight: 23 },
  outcome: { width: '100%', maxWidth: layout.max, minHeight: 420, alignSelf: 'center', flexDirection: 'row', backgroundColor: colors.paper },
  outcomeCompact: { flexDirection: 'column' },
  stackBlock: { flex: 0.8, padding: 36 },
  resultsBlock: { flex: 1, padding: 36, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.ink },
  futureBlock: { flex: 1.2, justifyContent: 'center', padding: 36 },
  outcomeKicker: { color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  stackList: { marginTop: 28, gap: 12 },
  stackItem: { color: colors.ink, fontFamily: fonts.display, fontSize: 23, fontWeight: '900' },
  resultRow: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: colors.ink },
  resultNumber: { color: colors.violet, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  resultText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700' },
  futureText: { marginTop: 26, fontFamily: fonts.serif, fontSize: 28, lineHeight: 36, fontStyle: 'italic' },
  next: { width: '100%', maxWidth: layout.max, minHeight: 330, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 30, padding: 44 },
  nextPressed: { opacity: 0.8 },
  nextKicker: { fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  nextTitle: { marginTop: 20, fontFamily: fonts.display, fontSize: 75, lineHeight: 72, fontWeight: '900', letterSpacing: -4 },
  nextTitleCompact: { fontSize: 42, lineHeight: 42, letterSpacing: -2.2 },
  nextArrow: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, padding: 30, backgroundColor: colors.ink },
  notFoundCode: { color: colors.acid, fontFamily: fonts.display, fontSize: 120, lineHeight: 125, fontWeight: '900' },
  notFoundText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});
