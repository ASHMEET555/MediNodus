/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  // Determine scheme from the unified hook (which safely reads global state).
  const scheme = useColorScheme();
  const resolvedBase: 'light' | 'dark' = scheme === 'highContrast' ? 'dark' : (scheme as 'light' | 'dark');
  const isHighContrast = scheme === 'highContrast';

  // If a prop color for the resolved theme exists, prefer it.
  const colorFromProps = props[resolvedBase];
  if (colorFromProps) return colorFromProps;

  // If high contrast is enabled, only override certain semantic colors.
  const highContrastOverridden = ['text', 'icon', 'tint', 'border', 'textSecondary', 'success', 'danger'];
  if (isHighContrast && highContrastOverridden.includes(colorName as string)) {
    return Colors.highContrast[colorName as keyof typeof Colors.highContrast] as string;
  }

  return Colors[resolvedBase][colorName];
}
