import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddScreen() {
  const [selected, setSelected] = useState<'rose' | 'thorn' | null>(null);
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.titleLine}>
          <ThemedText type="title" style={styles.titleText}>
            Is it time for a{' '}
          </ThemedText>
          <ThemedText type="title" style={[styles.titleText, styles.pink]}>Rose</ThemedText>
          <ThemedText type="title" style={styles.titleText}>?</ThemedText>
        </ThemedText>

        <ThemedText type="title" style={styles.subtitle}>
          of a <Text style={styles.green}>thorn</Text>...
        </ThemedText>
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          accessibilityLabel="Thorn"
          style={[styles.option, selected === 'thorn' && styles.optionActive]}
          onPress={() => setSelected('thorn')}
        >
          <Text style={styles.emoji}>🌿</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Rose"
          style={[styles.option, selected === 'rose' && styles.optionActive]}
          onPress={() => setSelected('rose')}
        >
          <Text style={styles.emoji}>🌹</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continue} onPress={() => router.push('add/message' as any)}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center', paddingTop: 0, marginTop: -140 },
  titleLine: { lineHeight: 36 },
  titleText: { fontSize: 30, lineHeight: 36, color: '#000' },
  pink: { color: '#FF2D86' },
  subtitle: { fontSize: 30, lineHeight: 36, marginTop: 8, color: '#000' },
  green: { color: '#2BB673' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 48, paddingHorizontal: 24 },
  option: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  optionActive: { backgroundColor: '#fff2f6' },
  emoji: { fontSize: 72 },
  continue: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#FF5C93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueText: { color: '#fff', fontSize: 16 },
});
