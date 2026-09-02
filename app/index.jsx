import { useRef } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Head from 'expo-router/head';
import PortfolioHero from '../src/components/portfolio/PortfolioHero';
import ProjectArchive from '../src/components/portfolio/ProjectArchive';
import { About, Contact, Manifesto, VisualLab } from '../src/components/portfolio/PortfolioSections';
import { colors } from '../src/design/tokens';

const EMAIL = 'andersonsolanochavarria@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/anderson-solano-chavarria-75a5763b8';

export default function HomePage() {
  const scrollRef = useRef(null);
  const projectsY = useRef(0);
  const loadoutY = useRef(0);
  const labY = useRef(0);
  const profileY = useRef(0);
  const contactY = useRef(0);
  const { width } = useWindowDimensions();
  const compact = width < 920;
  const mobile = width < 560;

  const navigate = (destination) => {
    const targets = {
      work: projectsY,
      loadout: loadoutY,
      lab: labY,
      profile: profileY,
      contact: contactY,
    };
    scrollRef.current?.scrollTo({ y: targets[destination]?.current || 0, animated: true });
  };

  return (
    <View style={styles.page}>
      <Head>
        <title>Anderson Solano — Creative Frontend Developer</title>
        <meta name="description" content="Portafolio de Anderson Solano: frontend, producto y dirección visual para web y móvil." />
        <meta name="theme-color" content="#050507" />
        <meta property="og:title" content="Anderson Solano — Creative Frontend Developer" />
        <meta property="og:description" content="Interfaces con frecuencia: producto, dirección visual y código desde Costa Rica." />
      </Head>
      <StatusBar style="light" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PortfolioHero compact={compact} mobile={mobile} onNavigate={navigate} />
        <View onLayout={(event) => { projectsY.current = event.nativeEvent.layout.y; }}>
          <ProjectArchive compact={compact} />
        </View>
        <View onLayout={(event) => { loadoutY.current = event.nativeEvent.layout.y; }}><Manifesto compact={compact} /></View>
        <View onLayout={(event) => { labY.current = event.nativeEvent.layout.y; }}><VisualLab compact={compact} /></View>
        <View onLayout={(event) => { profileY.current = event.nativeEvent.layout.y; }}><About compact={compact} /></View>
        <View onLayout={(event) => { contactY.current = event.nativeEvent.layout.y; }}><Contact compact={compact} email={EMAIL} linkedin={LINKEDIN} /></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', alignItems: 'stretch', backgroundColor: colors.ink },
});
