import {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';
import useNotificationCable from '@/hooks/useNotificationCable';
import { api } from '@/utils/api';

interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsScreen() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/notifications')
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error('❌ Fetch notifications failed', err));
  }, [user]);

  useNotificationCable(user?.id, (newNotification) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === newNotification.id);
      return exists ? prev : [newNotification, ...prev];
    });
  });

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}`, { read: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('❌ Failed to mark notification as read', error);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[styles.card, item.read ? styles.read : styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.timestamp}>{item.created_at}</Text>
      {!item.read && (
        <TouchableOpacity style={styles.button} onPress={() => markAsRead(item.id)}>
          <Text style={styles.buttonText}>Đánh dấu đã đọc</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông báo của bạn</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>Không có thông báo nào.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  empty: { color: '#666' },
  card: { padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1 },
  read: { backgroundColor: '#f0f0f0', borderColor: '#ccc' },
  unread: { backgroundColor: '#fff', borderColor: '#3b82f6' },
  title: { fontWeight: '600', marginBottom: 4 },
  body: { color: '#444' },
  timestamp: { color: '#999', fontSize: 12, marginTop: 4 },
  button: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontSize: 14 },
});
