import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GameTransitionProvider } from '../src/components/portfolio/GameTransition';

export default function RootLayout() {
  return (
    <GameTransitionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'web' ? 'none' : 'fade',
          contentStyle: { backgroundColor: '#070d1b' },
        }}
      />
    </GameTransitionProvider>
  );
}
