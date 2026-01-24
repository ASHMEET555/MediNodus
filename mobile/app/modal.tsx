import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();
  
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Quick Info</Text>
      <Text variant="bodyLarge" style={styles.body}>
        This is a modal screen. It can be used for quick actions or information.
      </Text>
      
      <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 20 }}>
        Close
      </Button>

      {/* Use a light status bar on iOS to account for the modal presentation */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { marginBottom: 10, fontWeight: 'bold' },
  body: { textAlign: 'center', marginBottom: 20 }
});