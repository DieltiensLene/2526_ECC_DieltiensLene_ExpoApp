import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddScreen() {
  const [selected, setSelected] = useState<'rose' | 'thorn' | null>(null);
  const router = useRouter();

  function handleContinue() {
    console.log('Selected mood:', selected);
    if (!selected) {
      Alert.alert('Pick one first', 'Select a rose or thorn before continuing.');
      return;
    }

    router.push(`/add/message?type=${selected}`);
  }

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
          style={[
            styles.option,
            selected === 'thorn' && styles.optionActiveThorn,
          ]}
          onPress={() => setSelected('thorn')}
        >
          <Text style={styles.emoji}>🌿</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Rose"
          style={[
            styles.option,
            selected === 'rose' && styles.optionActiveRose,
          ]}
          onPress={() => setSelected('rose')}
        >
          <Text style={styles.emoji}>🌹</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.continue, !selected && styles.continueDisabled]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // place the header at the absolute top (where the buttons used to be)
  content: { position: 'absolute', top: 68, left: 24, right: 24 },
  titleLine: { lineHeight: 36 },
  titleText: { fontSize: 30, lineHeight: 36, color: '#000' },
  pink: { color: '#FF2D86' },
  subtitle: { fontSize: 30, lineHeight: 36, marginTop: 8, color: '#000' },
  green: { color: '#2BB673' },
  // place the selectable options where the header used to be (centered)
  optionsRow: {
    flex: 1,
    padding: 24,
    marginTop: -140,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  option: {
    width: 140,
    height: 140,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 8,
  },
  optionActiveRose: { borderColor: '#FF2D86', backgroundColor: 'rgba(255,45,134,0.04)' },
  optionActiveThorn: { borderColor: '#2BB673', backgroundColor: 'rgba(43,182,115,0.04)' },
  emoji: { fontSize: 88 },
  continue: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#FF5C93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueDisabled: { opacity: 0.5 },
  continueText: { color: '#fff', fontSize: 16 },
});
