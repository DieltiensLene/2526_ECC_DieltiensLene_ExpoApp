import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Keyboard, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { setItem } from '@/app/utils/storage';

const API_BASE = 'https://two526-ecc-dieltienslene-backend-app-l7fz.onrender.com/users';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    if (!username.trim() || !name.trim() || !email.trim() || !password) {
      Alert.alert('Validation', 'Please complete all fields');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Validation', 'Password must be at least 8 characters');
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
        body: JSON.stringify({ username: username.trim(), name: name.trim(), email: email.trim(), password }),
      });
      let json = null;
      let text = null;
      try {
        // try parse json, fallback to raw text
        json = await resp.json();
      } catch {
        try { text = await resp.text(); } catch { text = null; }
      }

      if (!resp.ok) {
        const msg = json?.message || json?.error || text || `HTTP ${resp.status}`;
        console.warn('Signup failed', { status: resp.status, body: json || text });
        Alert.alert('Registration failed', String(msg));
        setLoading(false);
        return;
      }

      const userId = json?.id ?? text;
      await setItem('loggedIn', 'true');
      // store username for greeting on home screen
      if (username?.trim()) await setItem('username', username.trim());
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
        <ThemedText type="title" style={styles.title}>Create an account</ThemedText>

        <ThemedText style={styles.label}>Username</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g. cool_creator"
          placeholderTextColor="#9AA0A6"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ThemedText style={styles.label}>Full name</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor="#9AA0A6"
          value={name}
          onChangeText={setName}
        />

        <ThemedText style={styles.label}>Email address</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#9AA0A6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedText style={styles.hint}>We will never share your email.</ThemedText>

        <View style={styles.rowLabel}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <Pressable onPress={() => setShowPassword(s => !s)}>
            <Text style={styles.show}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.input}
          placeholder="At least 8 characters"
          placeholderTextColor="#9AA0A6"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <ThemedText style={styles.hint}>Use a strong password to keep your account safe.</ThemedText>

        <TouchableOpacity style={[styles.create, loading && styles.disabled]} onPress={onCreate} disabled={loading}>
          <Text style={styles.createText}>{loading ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>

        <Pressable onPress={() => router.push('/login')} style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? <Text style={styles.signinLink}>Sign in</Text></Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  box: { margin: 20, padding: 20, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18, color: '#000' },
  label: { fontSize: 13, color: '#333', marginBottom: 6 },
  input: { height: 46, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, paddingHorizontal: 12, marginBottom: 10, backgroundColor: '#fff', color: '#000' },
  create: { backgroundColor: '#FF5C93', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  createText: { color: '#fff', fontSize: 16 },
  disabled: { opacity: 0.7 },
  hint: { fontSize: 12, color: '#666', marginBottom: 8 },
  rowLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  show: { color: '#FF2D86', fontWeight: '600' },
  signinRow: { marginTop: 14, alignItems: 'center' },
  signinText: { color: '#444' },
  signinLink: { color: '#FF2D86', fontWeight: '600' },
});
