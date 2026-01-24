import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, List, Switch, Surface, Button, Dialog, Portal, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function DataPrivacyScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(true);
  const [visible, setVisible] = useState(false);

  return (
    <Surface style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Data & Privacy" />
      </Appbar.Header>

      <List.Section>
        <List.Subheader>Usage Data</List.Subheader>
        <List.Item
          title="Share Analytics"
          description="Help improve MediNodus by sharing anonymous usage data."
          right={() => <Switch value={analytics} onValueChange={setAnalytics} />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Account Data</List.Subheader>
        <List.Item
          title="Export My Data"
          description="Download a copy of your medical history."
          left={() => <List.Icon icon="download" />}
          onPress={() => {}}
        />
        <List.Item
          title="Delete Account"
          titleStyle={{ color: 'red' }}
          left={() => <List.Icon icon="delete" color="red" />}
          onPress={() => setVisible(true)}
        />
      </List.Section>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Delete Account?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This action cannot be undone. All your reports will be permanently deleted.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button textColor="red" onPress={() => setVisible(false)}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});