import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  // Intentionally empty home screen — no text or images as requested
  return <ThemedView style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});