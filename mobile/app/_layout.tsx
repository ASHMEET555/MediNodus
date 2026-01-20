import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GlobalProvider, useGlobalState } from '../context/GlobalStateContext';

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useGlobalState();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 1. Wait for app to mount and loading to finish
    if (!isMounted || isLoading) return;

    // 2. Determine if user is in the Auth group
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      // FORCE Redirect to Login
      // Using setImmediate ensures this runs after the current render cycle
      setImmediate(() => {
        if (router.canGoBack()) {
          router.dismissAll(); // Clear stack if possible
        }
        router.replace('/(auth)/login');
      });
    } else if (isLoggedIn && inAuthGroup) {
      // FORCE Redirect to Tabs
      setImmediate(() => {
        router.replace('/(tabs)');
      });
    }
  }, [isLoggedIn, segments, isLoading, isMounted]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <RootLayoutNav />
    </GlobalProvider>
  );
}