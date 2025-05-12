import React from 'react';

import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useUser } from '@/context/UserContext';

export default function ShowUserScreen() {
  const { user } = useUser()
  const router = useRouter()

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Account Details</Text>
        <Text style={styles.value}>User data is not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>

      <Info label="Name" value={user.name} />
      <Info label="Email" value={user.email} />
      <Info label="Location" value={user.location || '—'} />
      <Info label="Points" value={user.points?.toString() || '0'} />
      <Info label="Role" value={user.role} />
      <Info label="Recycling Goal" value={`${user.recycling_goal || '—'} kg`} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/user/edit')}>
          <Text style={styles.buttonText}>Edit Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#6b7280' }]}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 6 },
  label: { fontWeight: '600', color: '#374151' },
  value: { color: '#111827' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button: { flex: 1, backgroundColor: '#2563eb', padding: 10, borderRadius: 8, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
})
