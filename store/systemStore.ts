import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'incident' | 'sos' | 'drone' | 'resupply' | 'system' | 'SOS';
  title?: string;
  message: string;
  timestamp: number | Date;
  read: boolean;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemStore {
  connectionStatus: 'online' | 'degraded' | 'offline';
  uptime: string;
  notifications: Notification[];
  unreadCount: number;
  setConnectionStatus: (s: 'online' | 'degraded' | 'offline') => void;
  setUptime: (u: string) => void;
  addNotification: (n: Partial<Notification>) => void;
  markAllRead: () => void;
}

const startTime = Date.now();

export const useSystemStore = create<SystemStore>((set, get) => ({
  connectionStatus: 'online',
  uptime: '0h 0m',
  notifications: [
    { id: 'n1', type: 'incident', message: 'Chemical Spill detected at Sector 4', timestamp: new Date(Date.now() - 600000), read: false },
    { id: 'n2', type: 'drone', message: 'ROVER GRID-X battery critical — 18%', timestamp: new Date(Date.now() - 300000), read: false },
    { id: 'n3', type: 'resupply', message: 'DEPOT OMEGA medical supplies CRITICAL', timestamp: new Date(Date.now() - 120000), read: true },
  ],
  unreadCount: 2,
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setUptime: (uptime) => set({ uptime }),
  addNotification: (n) => {
    const notif: Notification = { 
      id: Math.random().toString(36).substring(2), 
      timestamp: Date.now(), 
      read: false,
      type: 'system',
      message: '',
      ...n 
    } as Notification;
    set(state => ({
      notifications: [notif, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1
    }));
  },
  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  }))
}));

// Update uptime every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    const elapsed = Date.now() - startTime;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    useSystemStore.getState().setUptime(`${h}h ${m}m`);
  }, 60000);
}
