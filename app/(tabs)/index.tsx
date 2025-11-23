import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.titleLine}>
          <ThemedText type="title" style={styles.titleText}>
            Hey,{' '}
          </ThemedText>
          <ThemedText type="title" style={[styles.titleText, styles.pink]}>Lene!</ThemedText>
        </ThemedText>

        <ThemedText type="title" style={styles.subtitle}>
          {"How are you doing\n"}today?
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, justifyContent: 'center' },
  titleLine: { lineHeight: 56 },
  titleText: { fontSize: 48, lineHeight: 56, color: '#000' },
  pink: { color: '#FF2D86' },
  subtitle: { fontSize: 40, lineHeight: 48, marginTop: 8, color: '#000' },
});