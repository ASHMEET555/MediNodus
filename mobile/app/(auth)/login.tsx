import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGlobalState } from '@/context/GlobalStateContext'; //
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const { login, hapticFeedback } = useGlobalState(); //
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleLogin = async () => {
    if (name.trim().length < 2) {
      alert("Please enter a valid name to continue.");
      return;
    }
    hapticFeedback(); // Corrected naming
    await login(name); // Now passes the 'name' state to global context
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Welcome to MediNodus</ThemedText>
        <ThemedText style={styles.subtitle}>Enter your name to personalize your health analysis.</ThemedText>
        
        <TextInput 
          style={[
            styles.input, 
            { 
              backgroundColor: theme.cardBackground, 
              color: theme.text, 
              borderColor: theme.border 
            }
          ]} 
          placeholder="Full Name" 
          placeholderTextColor={theme.icon}
          value={name} 
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.tint }]} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Login / Sign Up</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { gap: 12 },
  title: { textAlign: 'center', marginBottom: 4 },
  subtitle: { textAlign: 'center', opacity: 0.6, marginBottom: 24, lineHeight: 20 },
  input: { 
    height: 56, 
    borderWidth: 1, 
    borderRadius: 16, 
    paddingHorizontal: 20, 
    fontSize: 16 
  },
  button: { 
    height: 56, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 28, 
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});