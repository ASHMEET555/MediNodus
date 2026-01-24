import { useTheme } from 'react-native-paper';
import { useColorScheme } from './use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string; highContrast?: string },
  colorName: string // Relaxed type since we use Paper now
) {
  const theme = useTheme();
  const scheme = useColorScheme() as string | 'light' | 'dark' | 'highContrast'; // 'light', 'dark', or 'highContrast'

  // 1. Priority: Specific prop for the current mode
  if (scheme === 'highContrast' && props.highContrast) return props.highContrast;
  if (scheme === 'dark' && props.dark) return props.dark;
  if (scheme === 'light' && props.light) return props.light;

  // 2. Fallback: Return the color from the active Paper Theme
  // @ts-ignore - Paper colors are dynamic
  return theme.colors[colorName] || theme.colors.primary;
}