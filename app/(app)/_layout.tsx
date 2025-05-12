import { Slot } from 'expo-router';

import AppLayout from '@/components/layout/AppLayout';

export default function AppGroupLayout() {
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  );
}
