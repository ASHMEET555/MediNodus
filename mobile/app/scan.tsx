import { View, StyleSheet } from 'react-native';
import { Appbar, ProgressBar, Text, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Scanning Document" />
      </Appbar.Header>

      <View style={styles.cameraPlaceholder}>
        <Text variant="bodyLarge">Align document within the frame</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text variant="labelLarge" style={styles.status}>Analyzing Text...</Text>
        <ProgressBar progress={0.4} color="#0061A4" style={styles.progress} />
      </View>

      <FAB
        icon="camera"
        label="Capture"
        style={styles.fab}
        onPress={() => console.log('Captured')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSection: { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  status: { textAlign: 'center', marginBottom: 8 },
  progress: { height: 8, borderRadius: 4 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 100 }
});