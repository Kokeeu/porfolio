import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import { Manifesto, VisualLab } from '../src/components/portfolio/PortfolioSections';
import { colors } from '../src/design/tokens';

export default function LoadoutPage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={colors.violet}
      code="BUILD_SYSTEM_VISUAL_R&D"
      mode="loadout"
      title="Loadout + Lab"
      description="Método, capacidades, herramientas y exploración visual de Anderson Solano."
    >
      <Manifesto compact={width < 920} />
      <VisualLab compact={width < 920} />
    </MenuPageShell>
  );
}
