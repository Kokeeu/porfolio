import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import ProjectArchive from '../src/components/portfolio/ProjectArchive';
import { colors } from '../src/design/tokens';

export default function MissionsPage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={colors.acid}
      code="MISSION_SELECT"
      title="Misiones"
      description="Casos de estudio y productos digitales seleccionados de Anderson Solano."
    >
      <ProjectArchive compact={width < 920} />
    </MenuPageShell>
  );
}
