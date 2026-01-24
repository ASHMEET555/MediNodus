import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Surface, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function MedicalInfo() {
  const router = useRouter();
  const { medicalInfo, updateMedicalInfo } = useGlobalState();
  
  const [info, setInfo] = useState(medicalInfo);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateMedicalInfo(info);
    setTimeout(() => {
      setSaving(false);
      router.back();
    }, 800);
  };

  return (
    <Surface style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Medical Data" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <HelperText type="info" visible>
          This information improves AI analysis accuracy.
        </HelperText>

        <TextInput
          label="Known Conditions"
          value={info.conditions}
          onChangeText={(t) => setInfo({ ...info, conditions: t })}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Allergies"
          value={info.allergies}
          onChangeText={(t) => setInfo({ ...info, allergies: t })}
          mode="outlined"
          multiline
          style={styles.input}
          right={<TextInput.Icon icon="alert-circle-outline" />}
        />

        <TextInput
          label="Current Medications"
          value={info.medications}
          onChangeText={(t) => setInfo({ ...info, medications: t })}
          mode="outlined"
          multiline
          style={styles.input}
          right={<TextInput.Icon icon="pill" />}
        />

        <Button mode="contained" onPress={handleSave} loading={saving} icon="content-save">
          Save Medical Data
        </Button>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  input: { marginBottom: 20, backgroundColor: 'transparent' },
});