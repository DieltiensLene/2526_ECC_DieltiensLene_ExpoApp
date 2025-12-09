import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getItem } from '@/app/utils/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function loadUsername() {
      try {
        const storedUsername = await getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.log("Error loading username:", error);
      }
    }

    loadUsername();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.titleLine}>
          <ThemedText type="title" style={styles.titleText}>
            Hey,{' '}
          </ThemedText>
          <ThemedText type="title" style={[styles.titleText, styles.pink]}>
            {username || '...'}!
          </ThemedText>
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
  content: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center', 
    paddingTop: 0, 
    marginTop: -140 
  },
  titleLine: { lineHeight: 36 },
  titleText: { 
    fontSize: 30, 
    lineHeight: 36, 
    color: '#000' 
  },
  pink: { color: '#FF2D86' },
  subtitle: { 
    fontSize: 30, 
    lineHeight: 36, 
    marginTop: 8, 
    color: '#000' 
  },
});
