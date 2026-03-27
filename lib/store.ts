import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface User {
  id: string;
  name: string;
  location: [number, number];
  type: 'rescuer' | 'survivor';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved';
  affectedAreas: { name: string; radius: number }[];
  createdAt: Date;
}

export interface SOSAlert {
  id: string;
  userId: string;
  location: [number, number];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  timestamp: Date;
  status: 'active' | 'responded' | 'resolved';
}

interface DisasterStore {
  socket: Socket | null;
  isConnected: boolean;
  activeUsers: User[];
  incidents: Incident[];
  sosAlerts: SOSAlert[];
  dangerZones: any[];
  
  // Connection methods
  connect: (userId: string, userName: string, userType: 'rescuer' | 'survivor', location: [number, number]) => void;
  disconnect: () => void;
  
  // Incident methods
  reportIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  updateIncident: (incidentId: string, updates: Partial<Incident>) => void;
  
  // SOS methods
  sendSOS: (location: [number, number], urgency: string, details: string) => void;
  requestHelp: (location: [number, number], urgency: string, details: string) => void;
  
  // Location tracking
  updateLocation: (location: [number, number]) => void;
  
  // Danger zones
  createDangerZone: (zone: any) => void;
  
  // Setters
  setUsers: (users: User[]) => void;
  addIncident: (incident: Incident) => void;
  addSOSAlert: (alert: SOSAlert) => void;
}

export const useDisasterStore = create<DisasterStore>((set, get) => ({
  socket: null,
  isConnected: false,
  activeUsers: [],
  incidents: [],
  sosAlerts: [],
  dangerZones: [],

  connect: (userId, userName, userType, location) => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socket.on('connect', () => {
      console.log('[Socket] Connected');
      socket.emit('user:register', {
        userId,
        name: userName,
        userType,
        location,
      });
      set({ isConnected: true, socket });
    });

    socket.on('users:updated', (users) => {
      set({ activeUsers: users });
    });

    socket.on('incident:created', (incident) => {
      set((state) => ({
        incidents: [...state.incidents, incident],
      }));
    });

    socket.on('incident:updated', (incident) => {
      set((state) => ({
        incidents: state.incidents.map((i) => (i.id === incident.id ? incident : i)),
      }));
    });

    socket.on('sos:received', (alert) => {
      set((state) => ({
        sosAlerts: [...state.sosAlerts, alert],
      }));
    });

    socket.on('danger:zone:created', (zone) => {
      set((state) => ({
        dangerZones: [...state.dangerZones, zone],
      }));
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      set({ isConnected: false });
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  reportIncident: (incident) => {
    const { socket } = get();
    if (socket) {
      socket.emit('incident:create', incident);
    }
  },

  updateIncident: (incidentId, updates) => {
    const { socket } = get();
    if (socket) {
      socket.emit('incident:update', { incidentId, ...updates });
    }
  },

  sendSOS: (location, urgency, details) => {
    const { socket } = get();
    if (socket) {
      socket.emit('sos:alert', { location, urgency, details });
    }
  },

  requestHelp: (location, urgency, details) => {
    const { socket } = get();
    if (socket) {
      socket.emit('help:request', { location, urgency, details });
    }
  },

  updateLocation: (location) => {
    const { socket, activeUsers } = get();
    const currentUser = activeUsers[0];
    if (socket && currentUser) {
      if (currentUser.type === 'rescuer') {
        socket.emit('rescuer:location', { location });
      } else {
        socket.emit('survivor:location', { location });
      }
    }
  },

  createDangerZone: (zone) => {
    const { socket } = get();
    if (socket) {
      socket.emit('danger:zone:create', zone);
    }
  },

  setUsers: (users) => set({ activeUsers: users }),
  addIncident: (incident) => set((state) => ({ incidents: [...state.incidents, incident] })),
  addSOSAlert: (alert) => set((state) => ({ sosAlerts: [...state.sosAlerts, alert] })),
}));
