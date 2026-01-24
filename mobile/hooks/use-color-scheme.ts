import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const systemScheme = useRNColorScheme();
  return systemScheme ?? 'light';
}