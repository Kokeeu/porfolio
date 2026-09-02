import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import PortfolioHero from '../src/components/portfolio/PortfolioHero';
import { colors } from '../src/design/tokens';

const routes = {
  work: '/misiones',
  loadout: '/loadout',
  lab: '/signal-lab',
  profile: '/perfil',
  contact: '/contacto',
};

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 920;

  const navigate = (destination) => {
    const route = routes[destination];
    if (route) router.push(route);
  };

  return (
    <View style={styles.page}>
      <Head>
        <title>Anderson Solano — Creative Frontend Developer</title>
        <meta name="description" content="Portafolio interactivo de Anderson Solano: frontend, producto y dirección visual para web y móvil." />
        <meta name="theme-color" content="#050507" />
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
