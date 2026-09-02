import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import { Manifesto } from '../src/components/portfolio/PortfolioSections';
import { colors } from '../src/design/tokens';

export default function LoadoutPage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={colors.violet}
      code="BUILD_SYSTEM"
      title="Loadout"
      description="Método, capacidades y sistema de trabajo de Anderson Solano."
    >
      <Manifesto compact={width < 920} />
    </MenuPageShell>
  );
}
