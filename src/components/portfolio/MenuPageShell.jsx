import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, layout } from '../../design/tokens';
import { useGameTransition } from './GameTransition';

const routeMeta = {
  Misiones: { index: '01', icon: 'map-outline' },
  'Loadout + Lab': { index: '02', icon: 'construct-outline' },
  Perfil: { index: '03', icon: 'person-outline' },
  Contacto: { index: '04', icon: 'paper-plane-outline' },
};

export default function MenuPageShell({ accent, children, code, description, title }) {
  const { navigate } = useGameTransition();
  const { width } = useWindowDimensions();
  const mobile = width < 560;
  const meta = routeMeta[title] || { index: '00', icon: 'sparkles-outline' };
  const returnToMenu = () => navigate('/', { replace: true, label: '00' });

  return (
    <View style={styles.page}>
      <Head>
        <title>{title} — Anderson Solano</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#070d1b" />
        <meta property="og:title" content={`${title} — Anderson Solano`} />
        <meta property="og:description" content={description} />
      </Head>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.topbar, mobile && styles.topbarMobile]}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Volver al menú principal"
            onPress={returnToMenu}
            style={({ pressed, hovered }) => [styles.back, (pressed || hovered) && { backgroundColor: accent }]}
          >
            {({ hovered }) => (
              <>
                <Ionicons name="arrow-back" size={17} color={hovered ? colors.ink : colors.paper} />
                <Text style={[styles.backText, hovered && styles.backActive]}>MAIN MENU</Text>
              </>
            )}
          </Pressable>

          {!mobile ? (
            <View style={styles.routeStatus}>
              <View style={[styles.statusDot, { backgroundColor: accent }]} />
              <Text style={[styles.routeCode, { color: accent }]}>{code} / LOADED</Text>
            </View>
          ) : null}

          <View style={styles.identity}>
            <Text style={[styles.mark, { color: accent }]}>AS</Text>
            {!mobile ? <Text style={styles.identityText}>PLAYER 01</Text> : null}
          </View>
        </View>

        <View style={[styles.routeBanner, mobile && styles.routeBannerMobile]}>
          <Text style={styles.bannerGhost}>{title.toUpperCase()}</Text>
          <View style={[styles.bannerNumber, { borderColor: accent }]}><Text style={[styles.bannerNumberText, { color: accent }]}>{meta.index}</Text></View>
          <View style={[styles.bannerSlab, { backgroundColor: accent }]}>
            <Ionicons name={meta.icon} size={mobile ? 28 : 38} color={colors.ink} />
            <Text style={[styles.bannerTitle, mobile && styles.bannerTitleMobile]}>{title.toUpperCase()}</Text>
          </View>
          <Text style={styles.bannerHint}>ROUTE {meta.index} / {code}</Text>
        </View>

        {children}

        <View style={styles.endRail}>
          <Text style={styles.endText}>{code} / END OF FILE</Text>
          <Pressable accessibilityRole="link" onPress={returnToMenu} style={({ pressed }) => [styles.endButton, { borderColor: accent }, pressed && styles.endButtonPressed]}>
            <Text style={[styles.endAction, { color: accent }]}>VOLVER AL MENÚ</Text>
            <Ionicons name="arrow-forward" size={15} color={accent} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', alignItems: 'stretch', backgroundColor: colors.ink },
  topbar: { width: '100%', maxWidth: layout.max, minHeight: 72, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: layout.gutter, backgroundColor: colors.ink, borderBottomWidth: 1, borderBottomColor: colors.navy },
  topbarMobile: { minHeight: 64, paddingHorizontal: layout.mobileGutter },
  back: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.navy },
  backText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  backActive: { color: colors.ink },
  routeStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  routeCode: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 1 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: { fontFamily: fonts.display, fontSize: 24, lineHeight: 25, fontWeight: '900' },
  identityText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  routeBanner: { width: '100%', maxWidth: layout.max, minHeight: 310, alignSelf: 'center', position: 'relative', overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 52, backgroundColor: colors.navy },
  routeBannerMobile: { minHeight: 230, paddingHorizontal: layout.mobileGutter },
  bannerGhost: { position: 'absolute', right: -18, bottom: -28, color: colors.ink, opacity: 0.55, fontFamily: fonts.display, fontSize: 148, lineHeight: 150, fontWeight: '900' },
  bannerNumber: { position: 'absolute', right: 34, top: 24, width: 100, height: 88, alignItems: 'center', justifyContent: 'center', borderWidth: 2, transform: [{ rotate: '5deg' }] },
  bannerNumberText: { fontFamily: fonts.display, fontSize: 72, lineHeight: 73, fontWeight: '900' },
  bannerSlab: { zIndex: 1, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 23, paddingVertical: 7, transform: [{ rotate: '-2deg' }] },
  bannerTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 74, lineHeight: 74, fontWeight: '900', letterSpacing: -1 },
  bannerTitleMobile: { fontSize: 43, lineHeight: 44 },
  bannerHint: { zIndex: 1, marginTop: 24, color: colors.paper, fontFamily: fonts.mono, fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },
  endRail: { width: '100%', maxWidth: layout.max, minHeight: 90, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingHorizontal: layout.gutter, borderTopWidth: 1, borderTopColor: colors.navy },
  endText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  endButton: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1.5, transform: [{ rotate: '-1deg' }] },
  endButtonPressed: { opacity: 0.65 },
  endAction: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
