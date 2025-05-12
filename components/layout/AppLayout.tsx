import React, { PropsWithChildren } from 'react';

import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';

import AppMenu from './AppMenu';

type AppLayoutProps = PropsWithChildren<{
  flash?: {
    notice?: string;
    error?: string;
  };
}>;

export default function AppLayout({ children, flash }: AppLayoutProps) {
  const router = useRouter();
  const { user, logout } = useUser();
  console.log('user', user);
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🌿 Green World</Text>
        <View style={styles.navRight}>
          {user ? (
            <Text style={styles.navLink} onPress={logout}>
              Logout
            </Text>
          ) : (
            <>
              <Text style={styles.navLink} onPress={() => router.push('/(auth)/login' as any)}>Login</Text>
              <Text style={styles.navLink} onPress={() => router.push('/(auth)/register' as any)}>Register</Text>
            </>
          )}
        </View>
      </View>

      {/* Flash messages */}
      {flash?.notice && (
        <View style={[styles.flash, styles.flashNotice]}>
          <Text style={styles.flashText}>{flash.notice}</Text>
        </View>
      )}
      {flash?.error && (
        <View style={[styles.flash, styles.flashError]}>
          <Text style={styles.flashText}>{flash.error}</Text>
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>{children}</View>

      {/* App Menu (bottom nav) */}
      <AppMenu/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    height: 60,
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  navRight: { flexDirection: 'row', gap: 16 },
  navLink: { color: 'white', marginLeft: 12, textDecorationLine: 'underline' },
  flash: { padding: 12, margin: 8, borderRadius: 6 },
  flashNotice: { backgroundColor: '#dcfce7' },
  flashError: { backgroundColor: '#fee2e2' },
  flashText: { color: '#111827' },
  content: { flex: 1, padding: 16 },
});
