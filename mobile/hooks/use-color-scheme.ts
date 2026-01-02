import { useColorScheme as useRNColorScheme } from 'react-native';
import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalStateContext';

/**
 * Resolve the active color scheme for the app, considering user preference
 * stored in GlobalState (light/dark/system) and the high-contrast toggle.
 */
export function useColorScheme(): 'light' | 'dark' | 'highContrast' {
			// Read context directly (no throw) so hook order stays stable. If provider
			// isn't mounted, ctx will be undefined and we'll fall back to system/native.
			const ctx = useContext(GlobalContext);
			const preferredTheme = ctx?.theme ?? 'system';
			const isHighContrast = ctx?.isHighContrast ?? false;

			const native = useRNColorScheme();

			if (isHighContrast) return 'highContrast';
			if (preferredTheme === 'system') return (native ?? 'light') as 'light' | 'dark';
			return preferredTheme as 'light' | 'dark';
}
