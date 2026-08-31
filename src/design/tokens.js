import { Platform } from 'react-native';

export const colors = {
  ink: '#050507',
  paper: '#f2f1ec',
  acid: '#d9ff43',
  cyan: '#74f7ee',
  violet: '#8f7cff',
  fog: '#b9b8bf',
  panel: '#111116',
};

export const fonts = {
  display: Platform.OS === 'web' ? 'Arial Black' : undefined,
  sans: Platform.OS === 'web' ? 'Arial' : undefined,
  serif: Platform.OS === 'web' ? 'Georgia' : undefined,
  mono: Platform.OS === 'web' ? 'Courier New' : undefined,
};

export const layout = {
  max: 1440,
  gutter: 28,
  mobileGutter: 16,
};

