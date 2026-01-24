import { ViewProps } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  highContrastColor?: string;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5; // Support elevation
};

export function ThemedView({ style, lightColor, darkColor, highContrastColor, elevation = 0, children, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  
  // Calculate specific background if overrides exist
  let backgroundColor = theme.colors.background;
  if (theme.dark && darkColor) backgroundColor = darkColor;
  if (!theme.dark && lightColor) backgroundColor = lightColor;

  return (
    <Surface 
      style={[{ backgroundColor }, style]} 
      elevation={elevation} 
      {...otherProps}
    >
      {children}
    </Surface>
  );
}