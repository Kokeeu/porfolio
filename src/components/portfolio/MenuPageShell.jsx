import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, layout } from '../../design/tokens';

export default function MenuPageShell({ accent, children, code, description, title }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const mobile = width < 560;

  return (
    <View style={styles.page}>
      <Head>
        <title>{title} — Anderson Solano</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#050507" />
        <meta property="og:title" content={`${title} — Anderson Solano`} />
        <meta property="og:description" content={description} />
      </Head>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.topbar, mobile && styles.topbarMobile]}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Volver al menú principal"
            onPress={() => router.replace('/')}
            style={({ pressed, hovered }) => [styles.back, (pressed || hovered) && { backgroundColor: accent }]}
          >
            {({ hovered }) => (
              <>
                <Text style={[styles.backArrow, hovered && styles.backActive]}>←</Text>
                <Text style={[styles.backText, hovered && styles.backActive]}>ESC / MAIN MENU</Text>
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

        {children}

        <View style={styles.endRail}>
          <Text style={styles.endText}>{code} / END OF FILE</Text>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/')}>
            <Text style={[styles.endAction, { color: accent }]}>RETURN TO MAIN MENU ↗</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', alignItems: 'stretch', backgroundColor: colors.ink },
  topbar: {
    width: '100%',
    maxWidth: layout.max,
    minHeight: 72,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.gutter,
    backgroundColor: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: '#3c3c44',
  },
  topbarMobile: { minHeight: 64, paddingHorizontal: layout.mobileGutter },
  back: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 10 },
  backArrow: { color: colors.paper, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' },
  backText: { color: colors.paper, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  backActive: { color: colors.ink },
  routeStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  routeCode: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.9 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: { fontFamily: fonts.display, fontSize: 18, fontWeight: '900' },
  identityText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  endRail: {
    width: '100%',
    maxWidth: layout.max,
    minHeight: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: layout.gutter,
    borderTopWidth: 1,
    borderTopColor: '#3c3c44',
  },
  endText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  endAction: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
