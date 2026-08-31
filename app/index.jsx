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
  const { width } = useWindowDimensions();
  const compact = width < 920;

  const goToWork = () => scrollRef.current?.scrollTo({ y: projectsY.current, animated: true });

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
        <PortfolioHero compact={compact} onWork={goToWork} email={EMAIL} />
        <Manifesto compact={compact} />
        <View onLayout={(event) => { projectsY.current = event.nativeEvent.layout.y; }}>
          <ProjectArchive compact={compact} />
        </View>
        <VisualLab compact={compact} />
        <About compact={compact} />
        <Contact compact={compact} email={EMAIL} linkedin={LINKEDIN} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', alignItems: 'stretch', backgroundColor: colors.ink },
});
