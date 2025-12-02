import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { setItem } from '@/app/utils/storage';

// Update this to your backend URL as needed. On emulators, 'localhost' may need
// to be replaced with the host IP (e.g. 10.0.2.2 for Android emulator).
const API_BASE = process.env.API_BASE || 'http://localhost:3000/users';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return false;
    }
    return true;
  }

  async function onSignIn() {
    if (!validate()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await resp.json();

      if (!resp.ok) {
        const msg = json?.message || json?.error || 'Login failed';
        Alert.alert('Login failed', msg.toString());
        setLoading(false);
        return;
      }

      // backend returns { message, id }
      const userId = json?.id;

      await setItem('loggedIn', 'true');
      if (userId) await setItem('userId', String(userId));

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Error', 'Unable to sign in. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  }

  function onCreateAccount() {
    router.push('/signup');
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.box}>
        <ThemedText type="title" style={styles.title}>Welcome back</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9AA0A6"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9AA0A6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={[styles.signin, loading && styles.disabled]} onPress={onSignIn} disabled={loading}>
          <Text style={styles.signinText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.create} onPress={onCreateAccount}>
          <Text style={styles.createText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  box: { margin: 24, padding: 20, borderRadius: 12 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#000' },
  input: { height: 48, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, backgroundColor: '#fff', color: '#000' },
  signin: { backgroundColor: '#FF5C93', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  signinText: { color: '#fff', fontSize: 16 },
  create: { marginTop: 12, alignItems: 'center' },
  createText: { color: '#FF2D86' },
  disabled: { opacity: 0.7 },
});
