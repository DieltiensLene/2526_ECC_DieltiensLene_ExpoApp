import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Make active tab/icon color pink and ensure tab bar uses a white background
        tabBarActiveTintColor: '#FF2D86',
        tabBarInactiveTintColor: '#687076',
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus" color={color} />,
          // hide the bottom tab bar when the Add screen is active so it behaves like a separate full-screen page
          tabBarStyle: { display: 'none' },
          // keep the add tab visually centered by placing it in the middle order
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
          
    </Tabs>
  );
}