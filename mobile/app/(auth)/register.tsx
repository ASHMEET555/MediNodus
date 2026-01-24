import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Surface, Text, HelperText, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useGlobalState();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(email, password, fullName);
      // Auto-redirect happens via GlobalState isLoggedIn check
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Join MediNodus for smarter health insights.</Text>

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
        
        <Button 
          mode="contained" 
          onPress={handleRegister} 
          loading={loading} 
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Sign Up
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { marginBottom: 8, fontWeight: 'bold', color: '#0061A4' },
  subtitle: { marginBottom: 32, opacity: 0.7 },
  input: { marginBottom: 12 },
  button: { marginTop: 24 }
});