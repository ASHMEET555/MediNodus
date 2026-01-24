import { Button, TextInput, Surface, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome to MediNodus</Text>
      
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
      />
      
      <TextInput
        label="Password"
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      
      <Button mode="contained" onPress={() => {}} style={styles.button}>
        Login
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { marginBottom: 30, textAlign: 'center' },
  input: { marginBottom: 15 },
  button: { marginTop: 10 }
});