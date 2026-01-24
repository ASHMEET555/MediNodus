import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

// Add your icon mappings here
const MAPPING = {
  'house.fill': 'home',
  'list.bullet.rectangle.portrait.fill': 'list-alt',
  'paperplane.fill': 'send',
  'chevron.right': 'chevron-right',
  'doc.text.magnifyingglass': 'find-in-page',
  'bell.fill': 'notifications',
  'gear': 'settings'
} as Partial<Record<string, React.ComponentProps<typeof MaterialIcons>['name']>>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const theme = useTheme();
  const iconColor = color ?? theme.colors.onSurface; // Default to theme color

  return (
    <MaterialIcons
      color={iconColor}
      size={size}
      name={MAPPING[name] ?? 'help-outline'}
      style={style}
    />
  );
}