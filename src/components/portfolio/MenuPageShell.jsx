import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, layout } from '../../design/tokens';
import { useGameTransition } from './GameTransition';
import MascotSticker from './MascotSticker';

const modeMeta = {
  missions: { index: '01', icon: 'map-outline', mascot: 0, mascotLabel: 'Mascota zorro original de Misiones' },
  loadout: { index: '02', icon: 'construct-outline', mascot: 1, mascotLabel: 'Mascota salamandra original de Loadout + Lab' },
  profile: { index: '03', icon: 'person-outline', mascot: 2, mascotLabel: 'Mascota nutria original del Perfil' },
  contact: { index: '04', icon: 'paper-plane-outline', mascot: 3, mascotLabel: 'Mascota gato espectral original de Contacto' },
};

function MissionHero({ accent, code, compact, description, meta, progress, title }) {
  return (
    <View style={[styles.modeHero, styles.missionHero, compact && styles.modeHeroCompact]}>
      <View accessibilityElementsHidden style={styles.missionRoutes}>
        <View style={[styles.missionRoute, styles.missionRouteA]} />
        <View style={[styles.missionRoute, styles.missionRouteB]} />
        <View style={[styles.missionNode, styles.missionNodeA, { borderColor: accent }]} />
        <View style={[styles.missionNode, styles.missionNodeB, { backgroundColor: accent }]} />
      </View>
      <Animated.View style={[styles.heroCopy, compact && styles.heroCopyCompact, { opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-38, 0] }) }] }]}>
        <Text style={[styles.modeCode, { color: accent }]}>ROUTE {meta.index} / {code}</Text>
        <View style={[styles.missionSlab, { backgroundColor: accent }]}>
          <Ionicons name={meta.icon} size={compact ? 25 : 34} color={colors.ink} />
          <Text style={[styles.modeTitle, styles.missionTitle, compact && styles.modeTitleCompact]}>{title.toUpperCase()}</Text>
        </View>
        <Text style={[styles.heroDescription, compact && styles.heroDescriptionCompact]}>{description}</Text>
      </Animated.View>
      <Animated.View style={[styles.missionIndex, { borderColor: accent, opacity: progress, transform: [{ rotate: '5deg' }, { scale: progress }] }]}>
        <Text style={[styles.missionIndexText, { color: accent }]}>{meta.index}</Text>
      </Animated.View>
      <Animated.View style={[styles.missionMascotWrap, compact && styles.missionMascotWrapCompact, { opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [44, 0] }) }, { rotate: '-7deg' }] }]}>
        <MascotSticker index={meta.mascot} size={compact ? 142 : 224} label={meta.mascotLabel} />
      </Animated.View>
    </View>
  );
}

function LoadoutHero({ accent, code, compact, description, meta, progress, title }) {
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
  return (
    <View style={[styles.modeHero, styles.loadoutHero, compact && styles.modeHeroCompact]}>
      <View accessibilityElementsHidden style={styles.loadoutRails}>
        <View style={[styles.loadoutRail, styles.loadoutRailA]} />
        <View style={[styles.loadoutRail, styles.loadoutRailB]} />
        <View style={[styles.loadoutSlot, styles.loadoutSlotA, { backgroundColor: accent }]} />
        <View style={[styles.loadoutSlot, styles.loadoutSlotB]} />
      </View>
      <Animated.View style={[styles.loadoutCopy, compact && styles.loadoutCopyCompact, { opacity: progress, transform: [{ translateY }] }]}>
        <View style={styles.loadoutTag}><Text style={[styles.modeCode, styles.loadoutCode]}>ROUTE {meta.index} / {code}</Text></View>
        <View style={styles.loadoutTitleRow}>
          <View style={[styles.loadoutNumber, { backgroundColor: accent }]}><Text style={styles.loadoutNumberText}>{meta.index}</Text></View>
          <View style={styles.loadoutTitleModule}>
            <Ionicons name={meta.icon} size={compact ? 24 : 31} color={colors.cyan} />
            <Text style={[styles.modeTitle, styles.loadoutTitle, compact && styles.modeTitleCompact]}>{title.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={[styles.heroDescription, styles.loadoutDescription, compact && styles.heroDescriptionCompact]}>{description}</Text>
      </Animated.View>
      <Animated.View style={[styles.loadoutMascotWrap, compact && styles.loadoutMascotWrapCompact, { opacity: progress, transform: [{ translateY }, { scale: progress }] }]}>
        <View style={[styles.mascotModule, { borderColor: accent }]}>
          <MascotSticker index={meta.mascot} size={compact ? 138 : 210} label={meta.mascotLabel} />
        </View>
      </Animated.View>
    </View>
  );
}

function ProfileHero({ code, compact, description, meta, progress, title }) {
  return (
    <View style={[styles.modeHero, styles.profileHero, compact && styles.profileHeroCompact]}>
      <View style={[styles.profileRail, compact && styles.profileRailCompact]}>
        <Text style={styles.profileRailIndex}>{meta.index}</Text>
        <Ionicons name={meta.icon} size={18} color={colors.paper} />
      </View>
      <Animated.View style={[styles.profileCopy, compact && styles.profileCopyCompact, { opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }] }]}>
        <Text style={[styles.modeCode, styles.profileCode]}>ROUTE {meta.index} / {code}</Text>
        <Text style={[styles.modeTitle, styles.profileTitle, compact && styles.profileTitleCompact]}>{title.toUpperCase()}</Text>
        <View style={styles.profileRule} />
        <Text style={[styles.heroDescription, styles.profileDescription, compact && styles.heroDescriptionCompact]}>{description}</Text>
      </Animated.View>
      <Animated.View style={[styles.profileMascotWrap, compact && styles.profileMascotWrapCompact, { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }, { rotate: '6deg' }] }]}>
        <View style={styles.profilePhotoFrame}>
          <View style={styles.profilePhotoCorner} />
          <MascotSticker index={meta.mascot} size={compact ? 150 : 224} label={meta.mascotLabel} />
        </View>
      </Animated.View>
    </View>
  );
}

function ContactHero({ accent, code, compact, description, meta, progress, title }) {
  return (
    <View style={[styles.modeHero, styles.contactHero, compact && styles.modeHeroCompact]}>
      <View accessibilityElementsHidden style={styles.signalField}>
        <View style={[styles.signalRing, styles.signalRingA, { borderColor: accent }]} />
        <View style={[styles.signalRing, styles.signalRingB, { borderColor: colors.acid }]} />
        <View style={[styles.signalLine, { backgroundColor: accent }]} />
      </View>
      <Animated.View style={[styles.contactHeroCopy, compact && styles.contactHeroCopyCompact, { opacity: progress, transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }] }]}>
        <View style={styles.contactCodeRow}>
          <View style={[styles.signalDot, { backgroundColor: accent }]} />
          <Text style={[styles.modeCode, { color: accent }]}>ROUTE {meta.index} / {code}</Text>
        </View>
        <Text style={[styles.modeTitle, styles.contactHeroTitle, compact && styles.contactHeroTitleCompact]}>{title.toUpperCase()}</Text>
        <Text style={[styles.heroDescription, styles.contactHeroDescription, compact && styles.heroDescriptionCompact]}>{description}</Text>
      </Animated.View>
      <Animated.View style={[styles.contactMascotWrap, compact && styles.contactMascotWrapCompact, { opacity: progress, transform: [{ scale: progress }, { rotate: '-5deg' }] }]}>
        <MascotSticker index={meta.mascot} size={compact ? 145 : 220} label={meta.mascotLabel} />
      </Animated.View>
    </View>
  );
}

function ModeHero(props) {
  if (props.mode === 'loadout') return <LoadoutHero {...props} />;
  if (props.mode === 'profile') return <ProfileHero {...props} />;
  if (props.mode === 'contact') return <ContactHero {...props} />;
  return <MissionHero {...props} />;
}

export default function MenuPageShell({ accent, children, code, description, mode = 'missions', title }) {
  const { navigate } = useGameTransition();
  const { width } = useWindowDimensions();
  const compact = width < 920;
  const mobile = width < 560;
  const meta = modeMeta[mode] || modeMeta.missions;
  const progress = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const returnToMenu = () => navigate('/', { replace: true, label: '00' });

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    if (reduceMotion) {
      progress.setValue(1);
      return undefined;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduceMotion]);

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
            style={({ focused, hovered, pressed }) => [styles.back, (pressed || hovered || focused) && { backgroundColor: accent }]}
          >
            {({ focused, hovered, pressed }) => {
              const active = pressed || hovered || focused;
              return (
                <>
                  <Ionicons name="arrow-back" size={17} color={active ? colors.ink : colors.paper} />
                  <Text style={[styles.backText, active && styles.backActive]}>MAIN MENU</Text>
                </>
              );
            }}
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

        <ModeHero accent={accent} code={code} compact={compact} description={description} meta={meta} mode={mode} progress={progress} title={title} />

        {children}

        <View style={styles.endRail}>
          <Text style={styles.endText}>{code} / END OF FILE</Text>
          <Pressable accessibilityRole="link" onPress={returnToMenu} style={({ focused, hovered, pressed }) => [styles.endButton, { borderColor: accent }, (pressed || hovered || focused) && styles.endButtonPressed]}>
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
  modeHero: { width: '100%', maxWidth: layout.max, minHeight: 430, alignSelf: 'center', position: 'relative', overflow: 'hidden', justifyContent: 'center', paddingHorizontal: layout.gutter },
  modeHeroCompact: { minHeight: 500, paddingHorizontal: layout.mobileGutter, paddingTop: 48, paddingBottom: 170, justifyContent: 'flex-start' },
  heroCopy: { zIndex: 2, width: '68%', alignItems: 'flex-start' },
  heroCopyCompact: { width: '100%' },
  modeCode: { fontFamily: fonts.mono, fontSize: 8, lineHeight: 13, fontWeight: '700', letterSpacing: 1.2 },
  modeTitle: { fontFamily: fonts.display, fontSize: 72, lineHeight: 70, fontWeight: '900', letterSpacing: -1.4 },
  modeTitleCompact: { fontSize: 47, lineHeight: 46, letterSpacing: -0.7 },
  heroDescription: { maxWidth: 590, marginTop: 24, color: colors.paper, fontFamily: fonts.sans, fontSize: 17, lineHeight: 25 },
  heroDescriptionCompact: { maxWidth: '100%', fontSize: 15, lineHeight: 22 },
  missionHero: { backgroundColor: '#091426' },
  missionRoutes: { ...StyleSheet.absoluteFillObject },
  missionRoute: { position: 'absolute', height: 1, backgroundColor: '#304363' },
  missionRouteA: { width: '68%', right: '-8%', top: '37%', transform: [{ rotate: '-18deg' }] },
  missionRouteB: { width: '74%', left: '-18%', bottom: '15%', transform: [{ rotate: '13deg' }] },
  missionNode: { position: 'absolute', width: 18, height: 18, borderRadius: 10 },
  missionNodeA: { right: '29%', top: '24%', borderWidth: 2, backgroundColor: colors.ink },
  missionNodeB: { left: '43%', bottom: '20%' },
  missionSlab: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 19, paddingHorizontal: 20, paddingVertical: 8, transform: [{ rotate: '-2deg' }] },
  missionTitle: { color: colors.ink },
  missionIndex: { position: 'absolute', right: 35, top: 28, width: 96, height: 84, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  missionIndexText: { fontFamily: fonts.display, fontSize: 68, lineHeight: 69, fontWeight: '900' },
  missionMascotWrap: { position: 'absolute', zIndex: 3, right: '9%', bottom: 2 },
  missionMascotWrapCompact: { right: 14, bottom: 4 },
  loadoutHero: { minHeight: 470, backgroundColor: colors.violet, borderBottomWidth: 1, borderBottomColor: colors.ink },
  loadoutRails: { ...StyleSheet.absoluteFillObject },
  loadoutRail: { position: 'absolute', backgroundColor: colors.ink, opacity: 0.18 },
  loadoutRailA: { left: '5%', right: '5%', top: 48, height: 1 },
  loadoutRailB: { top: '10%', bottom: '10%', right: '34%', width: 1 },
  loadoutSlot: { position: 'absolute', width: 92, height: 24, borderWidth: 1, borderColor: colors.ink },
  loadoutSlotA: { right: '4%', top: 24 },
  loadoutSlotB: { left: '4%', bottom: 22 },
  loadoutCopy: { zIndex: 2, width: '70%' },
  loadoutCopyCompact: { width: '100%' },
  loadoutTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, backgroundColor: colors.ink },
  loadoutCode: { color: colors.cyan },
  loadoutTitleRow: { flexDirection: 'row', alignItems: 'stretch', gap: 8, marginTop: 12 },
  loadoutNumber: { width: 82, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.ink },
  loadoutNumberText: { color: colors.ink, fontFamily: fonts.display, fontSize: 59, lineHeight: 61, fontWeight: '900' },
  loadoutTitleModule: { maxWidth: 660, flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.ink },
  loadoutTitle: { color: colors.paper },
  loadoutDescription: { color: colors.ink },
  loadoutMascotWrap: { position: 'absolute', zIndex: 3, right: '8%', bottom: 20 },
  loadoutMascotWrapCompact: { right: 15, bottom: 8 },
  mascotModule: { padding: 7, backgroundColor: colors.ink, borderWidth: 2, transform: [{ rotate: '3deg' }] },
  profileHero: { minHeight: 470, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', paddingLeft: 0, paddingRight: layout.gutter, backgroundColor: colors.paper },
  profileHeroCompact: { minHeight: 520, flexDirection: 'column', paddingLeft: 62, paddingRight: layout.mobileGutter, paddingBottom: 170 },
  profileRail: { width: 62, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 30, backgroundColor: colors.ink },
  profileRailCompact: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  profileRailIndex: { color: colors.cyan, fontFamily: fonts.display, fontSize: 34, lineHeight: 35, fontWeight: '900', transform: [{ rotate: '-90deg' }] },
  profileCopy: { zIndex: 2, width: '54%', alignSelf: 'center', marginLeft: 42 },
  profileCopyCompact: { width: '100%', marginLeft: 0 },
  profileCode: { color: colors.violet },
  profileTitle: { marginTop: 18, color: colors.ink, fontSize: 92, lineHeight: 84 },
  profileTitleCompact: { fontSize: 58, lineHeight: 54 },
  profileRule: { width: 86, height: 8, marginTop: 21, backgroundColor: colors.acid, transform: [{ rotate: '-4deg' }] },
  profileDescription: { maxWidth: 520, color: colors.navy },
  profileMascotWrap: { position: 'absolute', zIndex: 3, right: '6%', bottom: 24 },
  profileMascotWrapCompact: { right: 10, bottom: 4 },
  profilePhotoFrame: { padding: 8, borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.cyan },
  profilePhotoCorner: { position: 'absolute', zIndex: 2, right: -2, top: -2, width: 35, height: 35, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: colors.ink, backgroundColor: colors.paper },
  contactHero: { minHeight: 470, backgroundColor: '#071522' },
  signalField: { ...StyleSheet.absoluteFillObject },
  signalRing: { position: 'absolute', borderWidth: 1, borderRadius: 999 },
  signalRingA: { width: 330, height: 330, right: '5%', top: 50, opacity: 0.38 },
  signalRingB: { width: 220, height: 220, right: '9%', top: 105, opacity: 0.35 },
  signalLine: { position: 'absolute', left: 0, right: 0, top: '54%', height: 1, opacity: 0.34 },
  contactHeroCopy: { zIndex: 2, width: '65%' },
  contactHeroCopyCompact: { width: '100%' },
  contactCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  signalDot: { width: 8, height: 8, borderRadius: 5 },
  contactHeroTitle: { marginTop: 19, color: colors.paper, fontSize: 98, lineHeight: 92 },
  contactHeroTitleCompact: { fontSize: 58, lineHeight: 55 },
  contactHeroDescription: { maxWidth: 520, color: colors.fog },
  contactMascotWrap: { position: 'absolute', zIndex: 3, right: '8%', bottom: 18 },
  contactMascotWrapCompact: { right: 12, bottom: 4 },
  endRail: { width: '100%', maxWidth: layout.max, minHeight: 90, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingHorizontal: layout.gutter, borderTopWidth: 1, borderTopColor: colors.navy },
  endText: { color: colors.fog, fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  endButton: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1.5, transform: [{ rotate: '-1deg' }] },
  endButtonPressed: { opacity: 0.65 },
  endAction: { fontFamily: fonts.mono, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
});
