import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import { About } from '../src/components/portfolio/PortfolioSections';
import { colors } from '../src/design/tokens';

export default function ProfilePage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={colors.paper}
      code="PROFILE_01"
      title="Perfil"
      description="Perfil de Anderson Solano, desarrollador frontend creativo en Costa Rica."
    >
      <About compact={width < 920} />
    </MenuPageShell>
  );
}
