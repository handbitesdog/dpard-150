import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  // Avenir Next is a preinstalled iOS system font, so it needs no loading there.
  // Android has no equivalent installed, so this loads Nunito Sans as its stand-in.
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
