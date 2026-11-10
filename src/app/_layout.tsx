import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StageCurtains } from '@/components/StageCurtains';

import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StageCurtains />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
