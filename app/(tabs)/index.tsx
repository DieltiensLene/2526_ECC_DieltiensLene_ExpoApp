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
          setUsername(storedUsername.trim());
          return;
        }

        const savedEmail = await getItem('savedEmail');
        if (savedEmail) {
          const localPart = savedEmail.split('@')[0] ?? savedEmail;
          setUsername(localPart);
        }
      } catch (error) {
        console.log('Error loading username:', error);
      }
    }

    loadUsername();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.gradientBlobLarge} pointerEvents="none" />
      <View style={styles.gradientBlobSmall} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.titleLine}>
            <ThemedText type="title" style={styles.titleText}>
              Hey,
            </ThemedText>
            <ThemedText type="title" style={[styles.titleText, styles.pink]}>
              {` ${username || '...'}!`}
            </ThemedText>
          </ThemedText>

          <ThemedText type="title" style={styles.subtitle}>
            {"How are you doing\n"}today?
          </ThemedText>

          <ThemedText style={styles.prompt}>
            Roses celebrate the bright spots. Thorns keep things honest. Tap Add to jot down what stands out right now.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7FB' },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#FF2D86',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 32,
    elevation: 6,
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
  prompt: {
    marginTop: 18,
    fontSize: 16,
    color: '#6A6A6A',
    lineHeight: 22,
  },
  gradientBlobLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#FFD9EB',
    top: -60,
    right: -40,
    opacity: 0.6,
  },
  gradientBlobSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E0FFF2',
    bottom: -60,
    left: -30,
    opacity: 0.5,
  },
});
