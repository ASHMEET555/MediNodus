import React from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Card, Text, Chip, Divider, Surface, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AnalysisScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  
  // Mock data since we can't pass full objects via params easily
  const report = {
    title: (Array.isArray(params.title) ? params.title[0] : params.title) || 'Blood Test Analysis',
    date: (Array.isArray(params.date) ? params.date[0] : params.date) || 'Today',
    status: (Array.isArray(params.status) ? params.status[0] : params.status) || 'warning',
    summary: "Elevated cholesterol levels detected. Other markers are within normal range.",
    recommendation: "Consult with a cardiologist. Reduce saturated fat intake.",
  };

  const statusColor = report.status === 'safe' ? theme.colors.primary : theme.colors.error;

  return (
    <Surface style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Report Details" />
        <Appbar.Action icon="share-variant" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <Card style={styles.card}>
          <Card.Title 
            title={report.title} 
            subtitle={report.date}
            left={(props) => <Chip selectedColor={statusColor} style={{backgroundColor: theme.colors.surfaceVariant}} icon="file-document">{report.status.toUpperCase()}</Chip>}
          />
          <Card.Content>
             <Image 
              source={{ uri: 'https://via.placeholder.com/300x150' }} 
              style={styles.image} 
            />
          </Card.Content>
        </Card>

        {/* AI Analysis */}
        <Text variant="titleMedium" style={styles.sectionTitle}>AI Summary</Text>
        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={{ lineHeight: 24 }}>
              {report.summary}
            </Text>
          </Card.Content>
        </Card>

        {/* Recommendations */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Recommendations</Text>
        <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
              {report.recommendation}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 20 },
  image: { width: '100%', height: 150, borderRadius: 8, marginTop: 10 },
  sectionTitle: { marginBottom: 12, fontWeight: 'bold' }
});