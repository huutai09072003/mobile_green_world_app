// components/forms/UserForm.tsx
import React, { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

interface User {
  name?: string;
  email?: string;
  location?: string;
  recycling_goal?: number;
  role?: string;
  password?: string | undefined;
  password_confirmation?: string | undefined;
}

export default function UserForm({ initialUser = {} as User, endpoint = '', method = 'post', isEdit = false }: { initialUser?: User; endpoint?: string; method?: string; isEdit?: boolean }) {
  const router = useRouter()

  const [user, setUser] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    location: initialUser.location || '',
    recycling_goal: initialUser.recycling_goal?.toString() || '',
    role: initialUser.role || 'user',
    password: '',
    password_confirmation: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)

  const setData = (field: string, value: string) => {
    setUser({ ...user, [field]: value })
  }

  const handleSubmit = async () => {
    setProcessing(true)
    setErrors({})

    const filteredUser = { ...user }

    try {
      await axios({
        method,
        url: endpoint,
        data: { user: filteredUser },
        withCredentials: true,
      })
      router.push('/user/show')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        console.error(error)
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Info</Text>

      <Field label="Name" value={user.name} onChange={(v: string) => setData('name', v)} error={errors['name']} />
      <Field label="Email" value={user.email} onChange={(v: string) => setData('email', v)} error={errors['email']} />
      <Field label="Location" value={user.location} onChange={(v: string) => setData('location', v)} error={errors['location']} />
      <Field label="Recycling Goal (kg)" value={user.recycling_goal} onChange={(v: string) => setData('recycling_goal', v)} error={errors['recycling_goal']} keyboardType="numeric" />

      <Text style={styles.label}>Role</Text>
      <Picker selectedValue={user.role} onValueChange={(v) => setData('role', v)}>
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Collector" value="collector" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
      {errors['role'] && <Text style={styles.error}>{errors['role']}</Text>}

      {isEdit ? (
        <>
          <Text style={styles.section}>Change Password</Text>
          <Field label="New Password" value={user.password} onChange={(v: string) => setData('password', v)} error={errors['password']} secureTextEntry />
          <Field label="Confirm New Password" value={user.password_confirmation} onChange={(v: string) => setData('password_confirmation', v)} error={errors['password_confirmation']} secureTextEntry />
        </>
      ) : (
        <>
          <Field label="Password" value={user.password} onChange={(v: string) => setData('password', v)} error={errors['password']} secureTextEntry />
          <Field label="Confirm Password" value={user.password_confirmation} onChange={(v: string) => setData('password_confirmation', v)} error={errors['password_confirmation']} secureTextEntry />
        </>
      )}

      <TouchableOpacity
        style={[styles.button, processing && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={processing}
      >
        <Text style={styles.buttonText}>{processing ? 'Saving...' : isEdit ? 'Save Changes' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  )
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
}

function Field({ label, value, onChange, error, secureTextEntry = false }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  field: { marginBottom: 12 },
  label: { marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 },
  error: { color: 'red', marginTop: 4 },
  section: { marginTop: 24, fontSize: 18, fontWeight: 'bold' },
  button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#aaa' },
})
