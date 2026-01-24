// mobile/app/(tabs)/reports.tsx
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, List, Surface, Text, Divider, useTheme, Avatar } from 'react-native-paper';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function ReportsScreen() {
  const { reports } = useGlobalState();
  const theme = useTheme();

  // Render each history item using RNP components
  const renderItem = ({ item }: { item: any }) => (
    <List.Item
      title={item.title}
      description={item.date}
      titleStyle={{ fontWeight: '600' }}
      // Dynamic icon based on status
      left={props => (
        <Avatar.Icon 
          {...props} 
          size={40} 
          icon="file-document-outline" 
          style={{ backgroundColor: item.status === 'safe' ? theme.colors.primaryContainer : theme.colors.errorContainer }}
          color={item.status === 'safe' ? theme.colors.primary : theme.colors.error}
        />
      )}
      right={props => <List.Icon {...props} icon="chevron-right" />}
      onPress={() => console.log('View Report', item.id)}
      style={styles.listItem}
    />
  );

  return (
    <Surface style={styles.container}>
      {/* Paper Header */}
      <Appbar.Header elevated>
        <Appbar.Content title="Medical History" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="filter-variant" onPress={() => {}} />
      </Appbar.Header>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Avatar.Icon size={64} icon="clipboard-text-off-outline" style={{ backgroundColor: 'transparent' }} color={theme.colors.outline} />
            <Text variant="bodyLarge" style={{ color: theme.colors.outline, marginTop: 16 }}>
              No reports found
            </Text>
          </View>
        }
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 80 },
  listItem: { paddingVertical: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
});