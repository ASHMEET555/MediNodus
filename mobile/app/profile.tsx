// mobile/app/profile.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Surface, Avatar, Text, List, Switch, Button, Divider, useTheme } from 'react-native-paper';
import { useGlobalState } from '../context/GlobalStateContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, setUser } = useGlobalState();
  const theme = useTheme();
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false); // You can link this to context later

  const handleLogout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Header */}
        <Surface style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }]} elevation={1}>
          <Avatar.Text size={80} label={user?.name?.[0] || 'G'} />
          <Text variant="headlineSmall" style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>{user?.email || 'guest@medinodus.com'}</Text>
          <Button mode="outlined" style={styles.editBtn} onPress={() => {}}>Edit Profile</Button>
        </Surface>

        {/* Settings List */}
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={isDark} onValueChange={setIsDark} />}
          />
          <List.Item
            title="Notifications"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & FAQ"
            left={() => <List.Icon icon="help-circle-outline" />}
          />
          <List.Item
            title="Privacy Policy"
            left={() => <List.Icon icon="shield-check-outline" />}
          />
        </List.Section>

        <View style={styles.logoutContainer}>
            <Button mode="contained" buttonColor={theme.colors.error} icon="logout" onPress={handleLogout}>
                Sign Out
            </Button>
        </View>

      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { alignItems: 'center', padding: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 10 },
  name: { marginTop: 12, fontWeight: 'bold' },
  editBtn: { marginTop: 16, borderColor: '#888' },
  logoutContainer: { padding: 20, marginTop: 20 }
});