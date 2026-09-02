import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import { VisualLab } from '../src/components/portfolio/PortfolioSections';
import { colors } from '../src/design/tokens';

export default function SignalLabPage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={colors.cyan}
      code="RESEARCH_MODE"
      title="Signal Lab"
      description="Archivo visual, investigación y lenguaje gráfico de Anderson Solano."
    >
      <VisualLab compact={width < 920} />
    </MenuPageShell>
  );
}
