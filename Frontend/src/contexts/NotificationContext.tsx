import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Notification } from '@/types';
import { api } from '@/services/api';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  muteNotification: (notificationId: string) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'muted'>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const GUEST_HOOK: Notification = {
  id: 'guest-hook',
  userId: 'guest',
  title: 'Skitech Rewards',
  description: 'Create an account to unlock verified houses and marketplace features.',
  type: 'system',
  createdAt: new Date().toISOString(),
  read: false,
  muted: false,
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('skitech_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications([GUEST_HOOK]);
      }
    } else {
      // First time initialization with Guest Hook
      setNotifications([GUEST_HOOK]);
    }
  }, []);

  // Update unread count and persist
  useEffect(() => {
    const count = notifications.filter(n => !n.read && !n.muted).length;
    setUnreadCount(count);
    localStorage.setItem('skitech_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const fetchNotifications = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      // For mock purposes, we merge API data with local storage
      const data = await api.getNotifications(userId);
      setNotifications(prev => {
        const ids = new Set(prev.map(n => n.id));
        const filtered = data.filter(n => !ids.has(n.id));
        return [...prev, ...filtered];
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt' | 'read' | 'muted'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      muted: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAsUnread = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: false } : n))
    );
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const muteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, muted: !n.muted } : n))
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAsUnread,
        deleteNotification,
        muteNotification,
        fetchNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
