import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../design/tokens';

const sources = {
  Siwo: require('../../../assets/projects/siwo.png'),
  CodeCut: require('../../../assets/editorial/signal-eye.jpg'),
  portfolio: require('../../../assets/editorial/hyper-vision.jpg'),
  'Buscador-de-correos': require('../../../assets/editorial/fluid-state.jpg'),
};

const schemes = {
  Siwo: { accent: colors.acid, ink: colors.ink, label: 'REAL INTERFACE / SIWÖ' },
  CodeCut: { accent: colors.violet, ink: colors.paper, label: 'VISUAL REFERENCE / MOTION' },
  portfolio: { accent: colors.cyan, ink: colors.ink, label: 'VISUAL SYSTEM / PORTFOLIO' },
  'Buscador-de-correos': { accent: colors.paper, ink: colors.ink, label: 'VISUAL REFERENCE / DATA' },
};

export const getProjectScheme = (repo) => schemes[repo] || schemes.portfolio;

export default function CaseVisual({ caso, compact = false, hero = false }) {
  const scheme = getProjectScheme(caso.repo);

  return (
    <View style={[styles.frame, compact && styles.frameCompact, hero && styles.frameHero]}>
      <Image
        source={sources[caso.repo] || sources.portfolio}
        style={styles.image}
        resizeMode={caso.repo === 'Siwo' ? 'contain' : 'cover'}
        accessibilityLabel={`Visual editorial de ${caso.titulo}`}
      />
      <View style={styles.shade} />
      <View style={styles.metaTop}>
        <Text style={styles.metaLight}>{scheme.label}</Text>
        <Text style={styles.metaLight}>{caso.anio} / {caso.indice}</Text>
      </View>
      <View style={[styles.indexBlock, { backgroundColor: scheme.accent }]}>
        <Text style={[styles.index, { color: scheme.ink }]}>{caso.indice}</Text>
      </View>
      <View style={styles.caption}>
        <Text style={styles.captionTitle}>{caso.titulo.toUpperCase()}</Text>
        <Text style={styles.captionRole}>{caso.rol}</Text>
      </View>
      <View style={[styles.signal, { backgroundColor: scheme.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { minHeight: 620, position: 'relative', overflow: 'hidden', backgroundColor: '#17171d', borderWidth: 1, borderColor: '#3c3c44' },
  frameCompact: { minHeight: 430 },
  frameHero: { minHeight: 720 },
  image: { width: '100%', height: '100%', backgroundColor: '#111116' },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,3,6,0.14)' },
  metaTop: { position: 'absolute', left: 16, right: 16, top: 15, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metaLight: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  indexBlock: { position: 'absolute', right: 16, top: 44, width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  index: { fontFamily: fonts.display, fontSize: 29, fontWeight: '900' },
  caption: { position: 'absolute', left: 16, right: 16, bottom: 16, padding: 16, backgroundColor: 'rgba(5,5,7,0.92)', borderWidth: 1, borderColor: '#777781' },
  captionTitle: { color: colors.paper, fontFamily: fonts.display, fontSize: 25, fontWeight: '900', letterSpacing: -1 },
  captionRole: { marginTop: 6, color: colors.cyan, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  signal: { position: 'absolute', left: 0, top: '43%', width: 44, height: 4 },
});

