import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

// FIX: Define a full Blue-based palette to override default Purple
const lightColors = {
  primary: '#0061A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  
  // Changed from Purple to Blue-Grey/Slate
  secondary: '#535F70',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D7E3F7', // Blue-ish grey container
  onSecondaryContainer: '#101C2B',
  
  tertiary: '#6B5778', // Kept slightly distinct or change to '#3B6470' for teal-blue
  tertiaryContainer: '#F2DAFF',
  
  background: '#FDFCFF',
  surface: '#FDFCFF',
  surfaceVariant: '#DFE2EB', // Neutral grey, not purple-grey
  onSurfaceVariant: '#43474E',
  
  outline: '#73777F',
  error: '#BA1A1A',
};

const darkColors = {
  primary: '#9ECAFF',
  onPrimary: '#003258',
  primaryContainer: '#00497D',
  onPrimaryContainer: '#D1E4FF',
  
  secondary: '#BBC7DB',
  onSecondary: '#253140',
  secondaryContainer: '#3B4858',
  onSecondaryContainer: '#D7E3F7',
  
  surfaceVariant: '#43474E',
  onSurfaceVariant: '#C3C7CF',
  
  error: '#FFB4AB',
};

export const AppLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...lightColors, // Apply our Blue palette
  },
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...darkColors, // Apply our Blue palette
  },
};