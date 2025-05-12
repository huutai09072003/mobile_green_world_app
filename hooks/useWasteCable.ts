import {
  useEffect,
  useRef,
} from 'react';

import { API_URL } from '@/utils/api';

interface Waste {
  id: number;
  waste_type: string;
  status: string;
  image_url?: string;
  created_at?: string;
}

export default function useWasteCable(userId: number, onNewWaste: (w: Waste) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${API_URL}/cable`)

    const subscribeMsg = {
      command: "subscribe",
      identifier: JSON.stringify({ channel: "WasteChannel", user_id: userId }),
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribeMsg));
      console.log("🟢 Connected to ActionCable");
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "ping" || response.type === "confirm_subscription") return;

      const message = response.message;
      console.log("📬 Received message", message);
      if (message?.waste_type) {
        onNewWaste(message);
      }
    };

    ws.onclose = () => console.warn("🔌 Disconnected from cable");
    ws.onerror = (err) => console.error("🚨 WebSocket error", err);

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [userId]);
}
