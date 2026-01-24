import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, List, Switch, Surface, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function AppearanceScreen() {
  const router = useRouter();
  const { theme: currentTheme, setTheme, isHighContrast, setHighContrast } = useGlobalState();
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Appearance" />
      </Appbar.Header>

      <List.Section>
        <List.Subheader>Theme Mode</List.Subheader>
        
        <List.Item
          title="System Default"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => <Switch value={currentTheme === 'system'} onValueChange={() => setTheme('system')} />}
        />
        
        <List.Item
          title="Light Mode"
          left={() => <List.Icon icon="white-balance-sunny" />}
          right={() => <Switch value={currentTheme === 'light'} onValueChange={() => setTheme('light')} />}
        />
        
        <List.Item
          title="Dark Mode"
          left={() => <List.Icon icon="weather-night" />}
          right={() => <Switch value={currentTheme === 'dark'} onValueChange={() => setTheme('dark')} />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Accessibility</List.Subheader>
        <List.Item
          title="High Contrast"
          description="Increase color contrast for better visibility"
          left={() => <List.Icon icon="contrast-circle" />}
          right={() => <Switch value={isHighContrast} onValueChange={setHighContrast} color={theme.colors.error} />}
        />
      </List.Section>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});