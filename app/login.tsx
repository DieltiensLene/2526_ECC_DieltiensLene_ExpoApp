import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { setItem, getItem } from '@/app/utils/storage';

// Backend base URL — match the deployed host used for signup.
const API_BASE = process.env.API_BASE || 'https://two526-ecc-dieltienslene-backend-app-l7fz.onrender.com/users';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const savedEmail = await getItem('savedEmail');
        const savedPassword = await getItem('savedPassword');
        if (mounted) {
          if (savedEmail) setEmail(savedEmail);
          if (savedPassword) setPassword(savedPassword);
        }
      } catch (err) {
        console.warn('Prefill credentials failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function validate() {
    if (!email.trim() || !password) {
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
      const normalizedEmail = email.trim().toLowerCase();
      const resp = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      let json = null;
      let text = null;
      try {
        json = await resp.json();
      } catch {
        try { text = await resp.text(); } catch { text = null; }
      }

      if (!resp.ok) {
        const msg = json?.message || json?.error || text || `HTTP ${resp.status}`;
        console.warn('Login failed', { status: resp.status, body: json || text });
        Alert.alert('Login failed', String(msg));
        setLoading(false);
        return;
      }

      // backend returns { message, id }
      const userId = json?.id ?? text;

      await setItem('loggedIn', 'true');
      if (userId) await setItem('userId', String(userId));
      await setItem('savedEmail', normalizedEmail);
      await setItem('savedPassword', password);

      const serverUsernameRaw = typeof json?.username === 'string' ? json.username.trim() : '';
      let usernameToStore = serverUsernameRaw;

      if (!usernameToStore) {
        const storedUsername = await getItem('username');
        if (storedUsername) usernameToStore = storedUsername;
      }

      if (!usernameToStore) {
        const savedEmail = await getItem('savedEmail');
        if (savedEmail) {
          const emailLocalPart = savedEmail.split('@')[0] || savedEmail;
          usernameToStore = emailLocalPart;
        }
      }

      if (!usernameToStore) {
        usernameToStore = normalizedEmail.split('@')[0] || normalizedEmail;
      }

      await setItem('username', usernameToStore);

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Error', String(err) || 'Unable to sign in. Please check your network and try again.');
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
