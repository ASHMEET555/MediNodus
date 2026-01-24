import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';

// 1. Merge React Navigation themes with Paper themes
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

// 2. Define your Custom Colors (Medical Blue)
const customColors = {
  primary: '#0061A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  secondary: '#535F70',
  onSecondary: '#FFFFFF',
  error: '#BA1A1A',
};

// 3. Export the Final Themes
// FIX: Do NOT spread ...LightTheme here. It overwrites MD3 fonts with incompatible Nav fonts.
export const AppLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors, // Merge the adapted colors (which include card, border, etc.)
    ...customColors,
  },
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...customColors,
    primary: '#9ECAFF',
    onPrimary: '#003258',
  },
};

// High Contrast Theme
export const AppHighContrastTheme = {
  ...AppDarkTheme,
  colors: {
    ...AppDarkTheme.colors,
    background: '#000000',
    surface: '#121212',
    primary: '#FFFF00',
    onPrimary: '#000000',
    text: '#FFFFFF',
  }
};