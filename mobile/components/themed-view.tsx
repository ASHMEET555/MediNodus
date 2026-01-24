import { ViewProps } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  highContrastColor?: string;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  safeArea?: boolean; // New Prop
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  elevation = 0, 
  safeArea = false,
  children,
  ...otherProps 
}: ThemedViewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  let backgroundColor = theme.colors.background;
  if (theme.dark && darkColor) backgroundColor = darkColor;
  if (!theme.dark && lightColor) backgroundColor = lightColor;

  // FIX: Apply Safe Area Padding automatically
  const safePadding = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right
  } : {};
  return (
    <Surface 
      style={[{ backgroundColor }, safePadding, style]} 
      elevation={elevation} 
      {...otherProps}
    >
      {children}
    </Surface>
  );
}