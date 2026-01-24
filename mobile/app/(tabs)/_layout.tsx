import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 0.5,
          height: Platform.OS === 'android' ? 65 : 90,
          paddingBottom: Platform.OS === 'android' ? 10 : 30,
          paddingTop: 10,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.bullet.rectangle.portrait.fill" color={color} />,
        }}
      />

      {/* FIX: Listener Button for Separate Profile Screen */}
      <Tabs.Screen
        name="profile_nav" // Dummy name, doesn't need a file
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.crop.circle" color={color} />,
        }}
        listeners={() => ({
          tabPress: () => {
            router.push('/profile'); // Go to the separate app/profile.tsx
          },
        })}
      />
    </Tabs>
  );
}