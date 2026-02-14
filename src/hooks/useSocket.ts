'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = getSocket();

    if (user) {
      socketRef.current.emit('user:join', user._id);
    }

    socketRef.current.on('notification', (notification) => {
      addNotification(notification);
    });

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user, addNotification]);

  return socketRef.current;
}
