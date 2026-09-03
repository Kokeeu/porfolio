import { Platform } from 'react-native';

export const colors = {
  ink: '#070d1b',
  paper: '#f4f5fa',
  acid: '#ff2d78',
  cyan: '#70f1f2',
  violet: '#1478f2',
  fog: '#aeb8d5',
  panel: '#102b4a',
  blue: '#1478f2',
  pink: '#ff2d78',
  navy: '#102b4a',
  lavender: '#aeb8d5',
};

export const fonts = {
  display: Platform.OS === 'web' ? '"Big Shoulders Display", Impact, sans-serif' : undefined,
  sans: Platform.OS === 'web' ? 'Inter, Arial, sans-serif' : undefined,
  serif: Platform.OS === 'web' ? 'Georgia' : undefined,
  mono: Platform.OS === 'web' ? '"IBM Plex Mono", "Courier New", monospace' : undefined,
};

export const layout = {
  max: 1440,
  gutter: 28,
  mobileGutter: 16,
};
