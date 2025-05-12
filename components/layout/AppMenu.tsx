import React, { useState } from 'react';

import {
  usePathname,
  useRouter,
} from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';

export default function AppMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [unreadCount, setUnreadCount] = useState(user?.unread_notifications_count || 0);

  // useEffect(() => {
  //   if (user) {
  //     const interval = setInterval(() => {
  //       setUnreadCount((prev) => prev + 1);
  //     }, 15000);
  //     return () => clearInterval(interval);
  //   }
  // }, [user]);

  const navigate = (path: any) => {
    if (pathname === path) {
      // optional: scroll to top if same
      return;
    }
    router.push(path);
  };

  if (!user) return null;

  return (
    <View style={styles.menu}>
      <MenuItem
        title="Home"
        icon="🏠"
        active={pathname === '/'}
        onPress={() => navigate('/')}
      />
      <MenuItem
        title="Notifications"
        icon="🔔"
        badge={unreadCount}
        active={pathname === '/notifications'} 
        onPress={() => {
          setUnreadCount(0);
          navigate('/notifications'); 
        }}
      />
      <MenuItem
        title="Account"
        icon="👤"
        active={pathname.startsWith('/user')}
        onPress={() => navigate('/user/show')}
      />
    </View>
  );
}

type MenuItemProps = {
  title: string;
  icon: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
};

function MenuItem({ title, icon, active, badge, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={[styles.item, active && styles.active]} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menu: {
    height: 60,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  item: {
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  active: {
    backgroundColor: '#15803d',
    borderRadius: 8,
  },
  icon: {
    fontSize: 18,
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
