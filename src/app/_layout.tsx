import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StageBubbles } from '@/components/StageBubbles';

import '../global.css';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Jua: require('../assets/fonts/Jua-Regular.ttf') });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, orientation: 'landscape' }} />
        <StageBubbles />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
