import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, Card, Button, Avatar, IconButton, useTheme, List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../components/themed-view';
import { useGlobalState } from '../../context/GlobalStateContext';

const HEALTH_QUOTES = [
  "The greatest wealth is health.",
  "Let food be thy medicine and medicine be thy food.",
  "Early to bed and early to rise makes a man healthy, wealthy and wise.",
  "Physical fitness is the first requisite of happiness.",
  "A healthy outside starts from the inside.",
  "Take care of your body. It's the only place you have to live.",
  "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
  "Hydration is key to a healthy mind and body."
];

export default function Dashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { user, reports } = useGlobalState();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a random quote every time the component mounts
    const random = HEALTH_QUOTES[Math.floor(Math.random() * HEALTH_QUOTES.length)];
    setQuote(random);
  }, []);

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <ThemedView style={styles.container} safeArea={true}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
            Hello, {user?.name || 'Guest'}
          </Text>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            MediNodus
          </Text>
        </View>
        <IconButton 
          mode="contained" 
          containerColor={theme.colors.secondaryContainer} 
          iconColor={theme.colors.onSecondaryContainer}
          icon="account" 
          size={28} 
          onPress={() => router.push('/profile')} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Daily Quote Card (Replaced the Image Card) */}
        <Card style={[styles.quoteCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Avatar.Icon size={32} icon="format-quote-open" style={{ backgroundColor: 'transparent' }} color={theme.colors.onTertiaryContainer} />
              <Text variant="titleSmall" style={{ color: theme.colors.onTertiaryContainer, fontWeight: 'bold' }}>
                Daily Wisdom
              </Text>
            </View>
            <Text variant="headlineSmall" style={{ color: theme.colors.onTertiaryContainer, fontStyle: 'italic', lineHeight: 32 }}>
              "{quote}"
            </Text>
          </Card.Content>
        </Card>

        {/* 2. Actions Grid (Renamed & Resized) */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Actions</Text>
        <View style={styles.grid}>
          
          {/* Upload Button */}
          <Card mode="outlined" style={styles.gridCard} onPress={() => router.push({ pathname: '/scan', params: { action: 'upload' } })}>
            <Card.Content style={styles.centerContent}>
              <Avatar.Icon size={64} icon="file-upload" style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.onSecondaryContainer} />
              <Text variant="titleMedium" style={styles.gridLabel}>Upload File</Text>
              <Text variant="bodySmall" style={{color: 'gray'}}>PDF or Image</Text>
            </Card.Content>
          </Card>
          
          {/* Scan Button (Moved here from Hero) */}
          <Card mode="outlined" style={styles.gridCard} onPress={() => router.push('/scan')}>
             <Card.Content style={styles.centerContent}>
              <Avatar.Icon size={64} icon="camera" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
              <Text variant="titleMedium" style={styles.gridLabel}>Scan Report</Text>
              <Text variant="bodySmall" style={{color: 'gray'}}>Use Camera</Text>
            </Card.Content>
          </Card>

        </View>

        {/* 3. Recent Activity */}
        <View style={styles.recentHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Recent</Text>
          <Button compact onPress={() => router.push('/(tabs)/reports')}>History Tab</Button>
        </View>
        
        <Surface style={styles.recentList} elevation={1}>
          {latestReport ? (
            <List.Item
              title={latestReport.title || "Untitled Analysis"}
              description={latestReport.date}
              left={props => <List.Icon {...props} icon="file-document-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push('/(tabs)/reports')}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>No recent scans found.</Text>
            </View>
          )}
        </Surface>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 10,
    marginBottom: 20
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  
  quoteCard: { marginBottom: 25, borderRadius: 24 },
  
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  
  grid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  // FIX: Increased height for bigger buttons
  gridCard: { flex: 1, borderRadius: 20, minHeight: 160, justifyContent: 'center' },
  centerContent: { alignItems: 'center', paddingVertical: 20 },
  gridLabel: { marginTop: 12, fontWeight: 'bold' },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recentList: { borderRadius: 16, overflow: 'hidden', backgroundColor: 'transparent' }, 
  emptyState: { padding: 20, alignItems: 'center' }
});