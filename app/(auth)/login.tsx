import React, { useState } from 'react';

import axios from 'axios';
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

import { useUser } from '@/context/UserContext';
import { api } from '@/utils/api';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
} & TextInputProps;

type LoginErrors = {
  email?: string;
  password?: string;
  base?: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  

  const [user, setUser] = useState({ email: '', password: '' });  
  const [errors, setErrors] = useState<LoginErrors>({});
  const [processing, setProcessing] = useState(false);

  const setData = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setErrors({});

    try {
      const response = await api.post('/users/sign_in', { user }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        router.replace('/');
        login(response.data.user);
        console.log("aaaaaaaaaaaaaaaaaaa", response);
      } else {
        setErrors(response.data.errors || { base: response.data.message || 'Đăng nhập thất bại' });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors(error.response.data.errors || { base: error.response.data.message || 'Đăng nhập thất bại' });
      } else {
        setErrors({ base: 'Lỗi mạng hoặc server' });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Field
        label="Email"
        value={user.email}
        onChangeText={(val) => setData('email', val)}
        error={errors['email']}
        keyboardType="email-address"
      />

      <Field
        label="Password"
        value={user.password}
        onChangeText={(val) => setData('password', val)}
        error={errors['password']}
        secureTextEntry
      />

      {errors['base'] && <Text style={styles.error}>{errors['base']}</Text>}

      {processing ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={handleSubmit} />
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
