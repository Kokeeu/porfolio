import { useWindowDimensions } from 'react-native';
import MenuPageShell from '../src/components/portfolio/MenuPageShell';
import { Contact } from '../src/components/portfolio/PortfolioSections';

const EMAIL = 'andersonsolanochavarria@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/anderson-solano-chavarria-75a5763b8';
const PINK = '#ff6dcb';

export default function ContactPage() {
  const { width } = useWindowDimensions();

  return (
    <MenuPageShell
      accent={PINK}
      code="COMMS_LINK"
      title="Contacto"
      description="Contacto y enlaces profesionales de Anderson Solano."
    >
      <Contact compact={width < 920} email={EMAIL} linkedin={LINKEDIN} />
    </MenuPageShell>
  );
}
