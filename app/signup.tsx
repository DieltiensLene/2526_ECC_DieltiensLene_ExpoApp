import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { setItem } from '@/app/utils/storage';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/users';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!username || !name || !email || !password) {
      Alert.alert('Validation', 'Please complete all fields');
      return false;
    }
    return true;
  }

  async function onCreate() {
    if (!validate()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password }),
      });
      const json = await resp.json();

      if (!resp.ok) {
        const msg = json?.message || json?.error || 'Registration failed';
        Alert.alert('Registration failed', msg.toString());
        setLoading(false);
        return;
      }

      const userId = json?.id;
      await setItem('loggedIn', 'true');
      if (userId) await setItem('userId', String(userId));

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Signup error', err);
      Alert.alert('Error', 'Unable to create account. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.box}>
        <ThemedText type="title" style={styles.title}>Create account</ThemedText>

        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={[styles.create, loading && styles.disabled]} onPress={onCreate} disabled={loading}>
          <Text style={styles.createText}>{loading ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  box: { margin: 24, padding: 20, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#000' },
  input: { height: 44, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, backgroundColor: '#fff', color: '#000' },
  create: { backgroundColor: '#FF5C93', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  createText: { color: '#fff', fontSize: 16 },
  disabled: { opacity: 0.7 },
});
