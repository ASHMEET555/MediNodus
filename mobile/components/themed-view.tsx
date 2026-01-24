// mobile/components/themed-view.tsx
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  highContrastColor?: string; // Add this
};

export function ThemedView({ style, lightColor, darkColor, highContrastColor, ...otherProps }: ThemedViewProps) {
  // Pass the full object to the hook
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor, highContrast: highContrastColor }, 
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}