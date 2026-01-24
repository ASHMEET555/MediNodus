import { ScrollView, StyleSheet } from 'react-native';
import { Surface, Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { Redirect } from 'expo-router';


export default function Dashboard() {
  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.header}>MediNodus</Text>
        
        <Card style={styles.card} mode="elevated">
          <Card.Title 
            title="Next Scan" 
            subtitle="Analyze your medical report"
            left={(props) => <Avatar.Icon {...props} icon="camera" />}
          />
          <Card.Content>
            <Text variant="bodyMedium">Last analysis: 2 days ago</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" icon="plus" onPress={() => {}}>Start New</Button>
          </Card.Actions>
        </Card>

        <Text variant="titleLarge" style={styles.sectionTitle}>Recent Insights</Text>
        
        {['Blood Test', 'MRI Scan'].map((item, index) => (
          <Card key={index} style={styles.itemCard} mode="outlined">
            <Card.Title
              title={item}
              right={(props) => <IconButton {...props} icon="chevron-right" />}
            />
          </Card>
        ))}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  header: { marginBottom: 24, fontWeight: 'bold', color: '#0061A4' },
  card: { marginBottom: 20 },
  itemCard: { marginBottom: 12 },
  sectionTitle: { marginVertical: 16 }
});