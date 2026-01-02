import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f1724',
    background: '#F8FAFF', // very light, slightly cool off-white
    tint: '#2563EB', // calming blue accent
    icon: '#64748B', // muted slate for icons
    surface: '#F1F5F9', // very soft surface
    cardBackground: '#F9FBFF', // slightly distinct from background
    border: '#E6EEF8',
    // Additional semantic colors used across the app
    success: '#10B981',
    danger: '#EF4444',
    textSecondary: '#6B7280',
  },
  dark: {
    text: '#E6EEF8', // soft white (not pure)
    background: '#071226', // deep navy (not pure black)
    tint: '#60A5FA', // soft sky blue accent
    icon: '#94A3B8', // muted icon color
    surface: '#0B1724', // slightly lighter than background
    cardBackground: '#0F2333', // calm navy card background
    border: '#122B3B',
    // Additional semantic colors used across the app
    success: '#34D399',
    danger: '#F87171',
    textSecondary: '#94A3B8',
  },
  // Added High Contrast Theme
  highContrast: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#FFFF00', // Yellow is standard for high contrast
    icon: '#FFFFFF',
    surface: '#333333',
    cardBackground: '#000000',
    border: '#FFFFFF',
    success: '#00FF00',
    danger: '#FF0000',
    textSecondary: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});