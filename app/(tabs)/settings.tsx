import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  // Clean settings page — intentionally no text or images
  return <ThemedView style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
