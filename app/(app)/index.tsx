import React from 'react';

import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/context/UserContext';

const IndexScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Green World - Waste Management</Text>
        <Text style={styles.subtitle}>
          Welcome to Green World! Upload a photo of waste to identify its type and get instructions on how to handle it properly.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identify Waste</Text>

        {user ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.buttonGreen}
              onPress={() => router.push('/waste/identify' as any)}
            >
              <Text style={styles.buttonText}>Start Identifying Waste</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonTeal}
              onPress={() => router.push('/waste' as any)}
            >
              <Text style={styles.buttonText}>View Waste History</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.loginPrompt}>
            Please{' '}
            <Text style={styles.loginLink} onPress={() => router.push('/(auth)/login' as any)}>
              log in
            </Text>{' '}
            to start identifying waste or view your history.
          </Text>
        )}
      </View>

      <View style={styles.grid}>
        <WasteBox color="green" title="Recyclable" description="Learn how to recycle plastic, paper, and more." />
        <WasteBox color="orange" title="Organic" description="Turn food waste into compost for your garden." />
        <WasteBox color="red" title="Hazardous" description="Handle batteries and chemicals safely." />
      </View>
    </ScrollView>
  );
};

const WasteBox = ({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: 'green' | 'orange' | 'red';
}) => {
  const borderColor = {
    green: '#22c55e',
    orange: '#eab308',
    red: '#ef4444',
  }[color];

  const titleColor = {
    green: '#16a34a',
    orange: '#ca8a04',
    red: '#dc2626',
  }[color];

  return (
    <View style={[styles.box, { borderTopColor: borderColor }]}>
      <Text style={[styles.boxTitle, { color: titleColor }]}>{title}</Text>
      <Text style={styles.boxDesc}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 10,
  },
  buttonGreen: {
    backgroundColor: '#15803d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonTeal: {
    backgroundColor: '#0f766e',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  loginPrompt: {
    color: '#4b5563',
    fontSize: 14,
  },
  loginLink: {
    color: '#16a34a',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  grid: {
    marginTop: 10,
    rowGap: 16,
  },
  box: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderTopWidth: 4,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  boxDesc: {
    color: '#4b5563',
    fontSize: 14,
  },
});

export default IndexScreen;
