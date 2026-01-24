import { Text, TextProps, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps<any> & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  
  let textColor = theme.colors.onBackground;
  if (theme.dark && darkColor) textColor = darkColor;
  if (!theme.dark && lightColor) textColor = lightColor;

  // Map 'type' to React Native Paper variants
  let variant: 'bodyMedium' | 'headlineMedium' | 'titleMedium' | 'bodyLarge' = 'bodyMedium';
  let customStyle = {};

  switch (type) {
    case 'title':
      variant = 'headlineMedium';
      customStyle = styles.title;
      break;
    case 'defaultSemiBold':
      variant = 'bodyLarge';
      customStyle = styles.semiBold;
      break;
    case 'subtitle':
      variant = 'titleMedium';
      customStyle = styles.subtitle;
      break;
    case 'link':
      variant = 'bodyMedium';
      textColor = theme.colors.primary;
      break;
    default:
      variant = 'bodyMedium';
  }

  return (
    <Text
      variant={variant}
      style={[{ color: textColor }, customStyle, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold' },
  semiBold: { fontWeight: '600' },
  subtitle: { fontWeight: '500' },
});