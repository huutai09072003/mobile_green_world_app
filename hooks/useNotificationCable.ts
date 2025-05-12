// hooks/useNotificationCable.ts
import {
  useEffect,
  useRef,
} from 'react';

import { API_URL } from '@/utils/api';

interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

interface CableMessage {
  type?: string;
  message?: Notification;
}

export default function useNotificationCable(
  userId: number | undefined,
  onNewNotification: (n: Notification) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`ws://${API_URL}/cable`);

    const subscribeMsg = {
      command: 'subscribe',
      identifier: JSON.stringify({ channel: 'NotificationChannel', user_id: userId }),
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribeMsg));
      console.log('🟢 Connected to NotificationChannel');
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const response: CableMessage = JSON.parse(event.data);
        if (response.type === 'ping' || response.type === 'confirm_subscription') return;

        const message = response.message;
        if (message && message.title && message.body) {
          onNewNotification(message);
        }
      } catch (err) {
        console.warn('❌ Error parsing WS message:', err);
      }
    };

    ws.onclose = () => console.warn('🔌 Disconnected from NotificationChannel');
    ws.onerror = (err) => console.error('🚨 WebSocket error', err);

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [userId]);
}
