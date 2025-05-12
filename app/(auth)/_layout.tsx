import { Slot } from 'expo-router';

// app/(auth)/_layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function AuthLayout() {
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  );
}
