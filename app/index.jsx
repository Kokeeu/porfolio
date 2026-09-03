import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import PortfolioHero from '../src/components/portfolio/PortfolioHero';
import { useGameTransition } from '../src/components/portfolio/GameTransition';
import { colors } from '../src/design/tokens';

const routes = {
  work: '/misiones',
  loadout: '/loadout',
  profile: '/perfil',
  contact: '/contacto',
};

export default function HomePage() {
  const { navigate: transitionTo } = useGameTransition();
  const { width } = useWindowDimensions();
  const compact = width < 920;

  const navigate = (destination, label) => {
    const route = routes[destination];
    if (route) transitionTo(route, { label });
  };

  return (
    <View style={styles.page}>
      <Head>
        <title>Anderson Solano — Creative Frontend Developer</title>
        <meta name="description" content="Portafolio interactivo de Anderson Solano: frontend, producto y dirección visual para web y móvil." />
        <meta name="theme-color" content="#070d1b" />
        <meta property="og:title" content="Anderson Solano — Creative Frontend Developer" />
        <meta property="og:description" content="Interfaces con frecuencia: selecciona una ruta para explorar el archivo." />
      </Head>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PortfolioHero compact={compact} mobile={width < 560} onNavigate={navigate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ink },
  scroll: { width: '100%', minHeight: '100%', alignItems: 'stretch', justifyContent: 'center', backgroundColor: colors.ink },
});
