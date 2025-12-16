import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { setItem, getItem } from '@/app/utils/storage';

type Entry = {
  id: string;
  type: string;
  text: string;
  createdAt: string;
};

export default function AddMessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string | string[] }>();
  const rawType = params?.type;
  const normalizedType = Array.isArray(rawType) ? rawType[0] : rawType;
  const mood =
    normalizedType === 'thorn'
      ? 'thorn'
      : normalizedType === 'rose'
      ? 'rose'
      : null;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (mood === 'rose') return 'Share your rose';
    if (mood === 'thorn') return 'Share your thorn';
    return 'Now add your message';
  }, [mood]);

  async function postMessage(entry: Entry) {
    console.log('Posting message to remote API:', entry);
    const response = await fetch('https://two526-ecc-dieltienslene-backend-app-l7fz.onrender.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Failed to post message');
    }
  }

  async function handleDone() {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert('Message empty', 'Write a quick note before saving.');
      return;
    }

    setLoading(true);

    const entry: Entry = {
      id: Date.now().toString(),
      type: mood ?? 'rose',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    
      console.log('Submitting entry to remote API:', entry);

    try {
      // Post message to remote API
      await postMessage(entry);

      const existing = await getItem('entries');
      let parsed: Entry[] = [];

      if (existing) {
        try {
          parsed = JSON.parse(existing);
        } catch {
          parsed = [];
        }
      }

      const next = [entry, ...parsed].slice(0, 50);
      await setItem('entries', JSON.stringify(next));

      router.push('/(tabs)/explore');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not post your message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.titleLine}>
            <ThemedText type="title" style={styles.titleText}>
              {title}
            </ThemedText>
          </ThemedText>

          <TextInput
            placeholder="Add your message..."
            placeholderTextColor="#9AA0A6"
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.done, loading && styles.disabled]}
            onPress={handleDone}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.doneText}>Done</Text>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 56 },
  titleLine: { lineHeight: 36 },
  titleText: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700',
    color: '#000',
  },
  textInput: {
    height: 160,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 12,
    paddingTop: 18,
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
  disabled: {
    opacity: 0.7,
  },
  doneText: { color: '#fff', fontSize: 16 },
});
