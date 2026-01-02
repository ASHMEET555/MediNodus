import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useGlobalState } from '@/context/GlobalStateContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * and should also respect the global theme/high-contrast settings.
 */
export function useColorScheme(): 'light' | 'dark' | 'highContrast' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { theme: preferredTheme, isHighContrast } = useGlobalState();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const native = useRNColorScheme();

  if (!hasHydrated) return 'light';

  if (isHighContrast) return 'highContrast';
  if (preferredTheme === 'system') return (native ?? 'light') as 'light' | 'dark';
  return preferredTheme as 'light' | 'dark';
}
