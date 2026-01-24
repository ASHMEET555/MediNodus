import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Button, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function EditProfile() {
  const router = useRouter();
  const { userName, updateProfile } = useGlobalState();
  const [name, setName] = useState(userName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      updateProfile(name);
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <Surface style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edit Profile" />
      </Appbar.Header>

      <Surface style={styles.content}>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={loading}
          style={styles.button}
        >
          Save Changes
        </Button>
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flex: 1 },
  input: { marginBottom: 20 },
  button: { marginTop: 10, paddingVertical: 6 },
});