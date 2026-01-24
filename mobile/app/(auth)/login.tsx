import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Surface, Text, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useGlobalState();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Router will auto-redirect in _layout.tsx based on isLoggedIn state
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
      
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
        onPress={handleLogin} 
        loading={loading} 
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        Login
      </Button>

      <View style={styles.footer}>
        <Text variant="bodyMedium">Don't have an account?</Text>
        <Button mode="text" onPress={() => router.push('/(auth)/register')}>
          Sign Up
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { marginBottom: 32, textAlign: 'center', fontWeight: 'bold', color: '#0061A4' },
  input: { marginBottom: 12 },
  button: { marginTop: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }
});