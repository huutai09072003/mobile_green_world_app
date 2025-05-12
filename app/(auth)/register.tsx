import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { api } from '@/utils/api';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
} & TextInputProps;

type RegisterErrors = {
  name?: string;
  email?: string;
  location?: string;
  recycling_goal?: string;
  password?: string;
  password_confirmation?: string;
  base?: string;
};

export default function RegisterScreen() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    email: '',
    location: '',
    recycling_goal: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [processing, setProcessing] = useState(false);

  const setData = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setErrors({});
    try {
      const response = await api.post('/users', { user });
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(auth)/login' as any);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
        setErrors({ base: 'An unexpected error occurred' });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Field label="Name" value={user.name} onChangeText={(v) => setData('name', v)} error={errors['name']} />
      <Field label="Email" value={user.email} onChangeText={(v) => setData('email', v)} error={errors['email']} keyboardType="email-address" />
      <Field label="Location" value={user.location} onChangeText={(v) => setData('location', v)} error={errors['location']} />
      <Field label="Recycling Goal (kg)" value={user.recycling_goal.toString()} onChangeText={(v) => setData('recycling_goal', v)} keyboardType="numeric" />
      <Field label="Password" value={user.password} onChangeText={(v) => setData('password', v)} secureTextEntry />
      <Field label="Confirm Password" value={user.password_confirmation} onChangeText={(v) => setData('password_confirmation', v)} secureTextEntry />

      {errors['base'] && <Text style={styles.error}>{errors['base']}</Text>}

      {processing ? (
        <ActivityIndicator />
      ) : (
        <Button title="Register" onPress={handleSubmit} />
      )}
    </View>
  );
}

function Field({ label, value, onChangeText, error, ...props }: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, error && { borderColor: 'red' }]}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginBottom: 4, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  error: { color: 'red', fontSize: 12, marginTop: 4 },
});
