import React, { useMemo, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { setItem, getItem } from '@/app/utils/storage';

export default function AddMessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[] }>();
  const rawType = params?.type;
  const normalizedType = Array.isArray(rawType) ? rawType[0] : rawType;
  const mood = normalizedType === 'thorn' ? 'thorn' : normalizedType === 'rose' ? 'rose' : null;
  const [message, setMessage] = useState('');

  const title = useMemo(() => {
    if (mood === 'rose') return "Share your rose";
    if (mood === 'thorn') return "Share your thorn";
    return 'Now add your message';
  }, [mood]);

  async function handleDone() {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert('Message empty', 'Write a quick note before saving.');
      return;
    }

    try {
      const existing = await getItem('entries');
      let parsed: Array<{ id: string; type: string; message: string; createdAt: string }> = [];
      if (existing) {
        try {
          parsed = JSON.parse(existing);
        } catch {
          parsed = [];
        }
      }
      const next = [
        {
          id: Date.now().toString(),
          type: mood ?? 'rose',
          message: trimmed,
          createdAt: new Date().toISOString(),
        },
        ...parsed,
      ].slice(0, 50);

      await setItem('entries', JSON.stringify(next));
      router.push('/explore');
    } catch (err) {
      console.error('Save entry failed', err);
      Alert.alert('Error', 'Unable to save your entry. Please try again.');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
        <ThemedText type="title" style={styles.titleLine}>
          <ThemedText type="title" style={styles.titleText}>{title}</ThemedText>
        </ThemedText>

        <TextInput
          placeholder="Add your message..."
          placeholderTextColor="#9AA0A6"
          style={styles.textInput}
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.done} onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 24 },
  titleLine: { lineHeight: 36 },
  titleText: { fontSize: 34, lineHeight: 42, fontWeight: '700', color: '#000' },
  textInput: {
    height: 160,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  done: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#FF5C93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  doneText: { color: '#fff', fontSize: 16 },
});
