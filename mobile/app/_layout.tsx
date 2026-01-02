import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { GlobalProvider, useGlobalState } from '../context/GlobalStateContext';

function RootLayoutNav() {
  const { isLoggedIn } = useGlobalState();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Use a second effect to signal when the layout has mounted
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return; // Wait until the layout is mounted

    // segments can be a union of literal string types; coerce to string to avoid
    // a TypeScript "no overlap" error when comparing to route-group names.
    const firstSegment = Array.isArray(segments) ? segments[0] : segments;
    const inAuthGroup = String(firstSegment) === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if not logged in
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to main app if logged in but trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isReady]);

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