// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color'; // Use your hook!

export default function TabLayout() {
  // Use the hook to safely resolve each color
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor, // Safe
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom, 
          backgroundColor: backgroundColor, // Safe
          ...Platform.select({
            ios: { shadowColor: "#333", shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 10 },
          }),
        },
      }}>
;
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet.rectangle.portrait.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: -20, 
    justifyContent: 'center',
    alignItems: 'center',
    width: 120, 
    // Ensure the button itself doesn't catch the padding from the tab bar
    height: 60, 
  },
  splitButton: {
    flexDirection: 'row',
    width: 150,
    height: 56,
    borderRadius: 28, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  halfButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 2,
    height: '60%',
    backgroundColor: "#000",
  },
});