import React, {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';
import useWasteCable from '@/hooks/useWasteCable';
import { api } from '@/utils/api';

interface Waste {
  id: number;
  waste_type: string;
  status: string;
  image_url?: string;
}

export default function WasteHistoryScreen() {
  const { user } = useUser();
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get('/wastes')
      .then((res) => setWastes(res.data.wastes || []))
      .catch((err) => console.error('❌ Failed to fetch wastes:', err))
      .finally(() => setLoading(false));
  }, []);

  useWasteCable(user?.id ?? 0, (newWaste) => {
    setWastes((prev) => [newWaste, ...prev]);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#facc15'; // yellow-400
      case 'identified':
        return '#3b82f6'; // blue-500
      case 'processed':
        return '#22c55e'; // green-500
      default:
        return '#9ca3af'; // gray-400
    }
  };

  const renderItem = ({ item }: { item: Waste }) => (
    <View style={[styles.card, { borderLeftColor: getStatusColor(item.status) }]}>
      <View style={styles.row}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.type}>
            Type: <Text style={{ color: '#16a34a' }}>{item.waste_type || 'N/A'}</Text>
          </Text>
          <Text style={styles.status}>
            Status:{' '}
            <Text style={{ fontWeight: '600', color: getStatusColor(item.status) }}>
              {item.status}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste History</Text>
      <FlatList
        data={wastes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/identify' as any)}
      >
        <Text style={styles.addButtonText}>Identify New Waste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { flexDirection: 'row' },
  image: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imagePlaceholderText: { color: '#6b7280', fontSize: 12 },
  info: { flex: 1, justifyContent: 'center' },
  type: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  status: { fontSize: 14, color: '#6b7280' },
  addButton: {
    marginTop: 16,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
