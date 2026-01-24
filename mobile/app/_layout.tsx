import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // FIX: Added this
import { GlobalProvider, useGlobalState } from '../context/GlobalStateContext';
import { AppLightTheme, AppDarkTheme } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

function RootNavigation() {
  const { theme: appTheme, isLoggedIn, isLoading } = useGlobalState();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  // FIX: Redirect Logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isLoggedIn && !inAuthGroup) {
      // Force user to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Force user to tabs if already logged in
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0061A4" />
      </View>
    );
  }

  const activeTheme = appTheme === 'system' 
    ? (colorScheme === 'dark' ? AppDarkTheme : AppLightTheme)
    : (appTheme === 'dark' ? AppDarkTheme : AppLightTheme);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={activeTheme}>
        <ThemeProvider value={activeTheme as any}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="scan" options={{ presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <RootNavigation />
    </GlobalProvider>
  );
}