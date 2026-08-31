import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCasos } from '../../../data/proyectos';
import { colors, fonts, layout } from '../../design/tokens';
import CaseVisual, { getProjectScheme } from './CaseVisual';

const ArchiveRow = ({ caso, active, onFocus, onPress }) => {
  const scheme = getProjectScheme(caso.repo);
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Abrir caso de estudio: ${caso.titulo}`}
      onHoverIn={onFocus}
      onFocus={onFocus}
      onPress={onPress}
      style={({ pressed, hovered }) => [styles.row, active && { backgroundColor: scheme.accent }, (pressed || hovered) && !active && styles.rowHover]}
    >
      <Text style={[styles.rowIndex, active && { color: scheme.ink }]}>{caso.indice}</Text>
      <View style={styles.rowMain}>
        <Text style={[styles.rowTitle, active && { color: scheme.ink }]}>{caso.titulo.toUpperCase()}</Text>
        <Text style={[styles.rowCategory, active && { color: scheme.ink }]}>{caso.categoria}</Text>
      </View>
      <Text style={[styles.rowYear, active && { color: scheme.ink }]}>{caso.anio}</Text>
      <Ionicons name="arrow-forward" size={20} color={active ? scheme.ink : colors.paper} />
    </Pressable>
  );
};

export default function ProjectArchive({ compact }) {
  const router = useRouter();
  const projects = useMemo(() => obtenerCasos(), []);
  const [activeRepo, setActiveRepo] = useState(projects[0].repo);
  const active = projects.find((project) => project.repo === activeRepo) || projects[0];
  const openProject = (repo) => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: repo } });

  return (
    <View style={styles.section}>
      <View style={[styles.heading, compact && styles.headingCompact]}>
        <View>
          <Text style={styles.kicker}>[01] / ARCHIVO DE TRABAJO</Text>
          <Text style={[styles.headingTitle, compact && styles.headingTitleCompact]}>CASOS{`\n`}SELECCIONADOS.</Text>
        </View>
        <Text style={styles.headingNote}>CUATRO PROYECTOS.{`\n`}CUATRO PROBLEMAS DISTINTOS.{`\n`}UNA MISMA OBSESIÓN POR LA CLARIDAD.</Text>
      </View>

      <View style={[styles.archive, compact && styles.archiveCompact]}>
        <View style={styles.rows}>
          {projects.map((caso) => (
            <ArchiveRow key={caso.repo} caso={caso} active={caso.repo === active.repo} onFocus={() => setActiveRepo(caso.repo)} onPress={() => openProject(caso.repo)} />
          ))}
          <View style={styles.activeCopy}>
            <Text style={styles.activeCopyLabel}>IDEA CENTRAL</Text>
            <Text style={styles.activeCopyText}>{active.frase}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="link" accessibilityLabel={`Abrir el proyecto ${active.titulo}`} onPress={() => openProject(active.repo)} style={({ pressed }) => [styles.preview, pressed && styles.previewPressed]}>
          <CaseVisual key={active.repo} caso={active} compact={compact} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', maxWidth: layout.max, alignSelf: 'center', paddingVertical: 110, backgroundColor: colors.ink },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, paddingHorizontal: layout.gutter, marginBottom: 54 },
  headingCompact: { flexDirection: 'column', alignItems: 'flex-start', paddingHorizontal: layout.mobileGutter, marginBottom: 36 },
  kicker: { color: colors.acid, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  headingTitle: { marginTop: 14, color: colors.paper, fontFamily: fonts.display, fontSize: 72, fontWeight: '900', lineHeight: 68, letterSpacing: -4 },
  headingTitleCompact: { fontSize: 46, lineHeight: 45, letterSpacing: -2.8 },
  headingNote: { maxWidth: 300, color: colors.fog, fontFamily: fonts.mono, fontSize: 8, lineHeight: 15, letterSpacing: 0.8 },
  archive: { flexDirection: 'row', minHeight: 620, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#3c3c44' },
  archiveCompact: { flexDirection: 'column-reverse' },
  rows: { flex: 1, minWidth: 0, borderRightWidth: 1, borderRightColor: '#3c3c44' },
  row: { minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: layout.gutter, borderBottomWidth: 1, borderBottomColor: '#3c3c44' },
  rowHover: { backgroundColor: '#141419' },
  rowIndex: { width: 24, color: colors.fog, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  rowMain: { flex: 1 },
  rowTitle: { color: colors.paper, fontFamily: fonts.display, fontSize: 23, fontWeight: '900', letterSpacing: -1 },
  rowCategory: { marginTop: 5, color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  rowYear: { color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700' },
  activeCopy: { flex: 1, justifyContent: 'flex-end', padding: layout.gutter, backgroundColor: '#0c0c10' },
  activeCopyLabel: { color: colors.cyan, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  activeCopyText: { maxWidth: 540, marginTop: 12, color: colors.paper, fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, fontStyle: 'italic' },
  preview: { flex: 1.1, minWidth: 0 },
  previewPressed: { opacity: 0.84 },
});
