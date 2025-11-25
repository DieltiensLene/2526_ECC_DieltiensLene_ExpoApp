import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function AddMessageScreen() {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
        <ThemedText type="title" style={styles.titleLine}>
          <ThemedText type="title" style={styles.titleText}>{"Now add your\nmessage"}</ThemedText>
        </ThemedText>

        <TextInput
          placeholder="Add your message..."
          placeholderTextColor="#9AA0A6"
          style={styles.textInput}
          multiline
        />

        <TouchableOpacity style={styles.done} onPress={() => router.push('/(tabs)/explore' as any)}>
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
