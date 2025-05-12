import React from 'react';

import {
    Text,
    View,
} from 'react-native';

import UserForm from '@/components/forms/UserForm';
import { useUser } from '@/context/UserContext';

export default function EditUserScreen() {
  const { user } = useUser()

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>
        Edit Account
      </Text>
      <UserForm initialUser={user ?? undefined} endpoint="/user" method="put" isEdit />
    </View>
  )
}
