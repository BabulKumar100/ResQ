import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb } from '@/lib/firebase';
import {
  Incident,
  SOSBeacon,
  DangerZone,
  Survivor,
  LiveEvent,
  Rescuer,
} from '@/lib/firestoreService';

export const useRealtimeIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setIncidents([
        { id: 'm1', type: 'Chemical Spill', severity: 'critical', lat: 34.048, lng: -118.25, address: 'Sector 4', description: 'Toxic plume detected.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date() } as any,
        { id: 'm2', type: 'Subway Derailment', severity: 'critical', lat: 34.053, lng: -118.245, address: 'Blue Line Downtown', description: 'Train derailed, structure damaged.', source: 'manual', status: 'new', reportedBy: 'user', createdAt: new Date() } as any,
        { id: 'm3', type: 'Bridge Stress', severity: 'high', lat: 34.06, lng: -118.23, address: '4th St Bridge', description: 'Abnormal vibrations detected.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date() } as any,
      ]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'incidents'),
        where('status', '!=', 'resolved'),
        orderBy('status'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Incident[];
        setIncidents(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching incidents:', error);
      setLoading(false);
    }
  }, []);

  return { incidents, loading };
};

export const useRealtimeSOS = () => {
  const [sosAlerts, setSosAlerts] = useState<SOSBeacon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'sos_beacons'),
        where('status', '!=', 'resolved'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as SOSBeacon[];
        setSosAlerts(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching SOS alerts:', error);
      setLoading(false);
    }
  }, []);

  return { sosAlerts, loading };
};

export const useRealtimeDangerZones = () => {
  const [zones, setZones] = useState<DangerZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setZones([
        { id: 'dz1', type: 'Fire Spread Vector', status: 'MONITORING', radius: 1200, riskLevel: 'HIGH', description: 'Fire moving NNE at 45km/h due to wind shear.', active: true, createdAt: new Date() } as any
      ]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'danger_zones'), where('active', '==', true));

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as DangerZone[];
        setZones(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching danger zones:', error);
      setLoading(false);
    }
  }, []);

  return { zones, loading };
};

export const useRealtimeRescuers = () => {
  const [rescuers, setRescuers] = useState<Rescuer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setRescuers([
        { id: 'd1', userId: 'drone1', name: 'DRONE-7 ALPHA', role: 'rescuer', lat: 34.05, lng: -118.24, status: 'busy', agency: 'Air Unit', fuelPct: 84, crewCount: 0, equipment: ['drone'] },
        { id: 'd2', userId: 'drone2', name: 'ROVER GRID-X', role: 'rescuer', lat: 34.055, lng: -118.25, status: 'busy', agency: 'Ground Unit', fuelPct: 18, crewCount: 0, equipment: ['rover'] },
        { id: 'r1', userId: 'resc1', name: 'MEDVAC B', role: 'rescuer', lat: 34.051, lng: -118.23, status: 'available', agency: 'Medical', fuelPct: 100, crewCount: 4, equipment: ['trauma kit'] },
      ]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'rescuers'), where('status', '!=', 'offline'));

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Rescuer[];
        setRescuers(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching rescuers:', error);
      setLoading(false);
    }
  }, []);

  return { rescuers, loading };
};

export const useRealtimeRescuerPositions = () => {
  const [positions, setPositions] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!rtdb) {
      return;
    }

    try {
      const posRef = ref(rtdb, 'rescuer_positions');

      const unsubscribe = onValue(posRef, (snap) => {
        const data = snap.val() || {};
        setPositions(data);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching rescuer positions:', error);
    }
  }, []);

  return positions;
};

export const useRealtimeLiveEvents = (limit_count: number = 100) => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'live_events'), orderBy('fetchedAt', 'desc'), limit(limit_count));

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as LiveEvent[];
        setEvents(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching live events:', error);
      setLoading(false);
    }
  }, [limit_count]);

  return { events, loading };
};

export const useRealtimeSurvivors = () => {
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setSurvivors([
        { id: 's1', qrCode: 'SV-A1B2', name: 'John Doe', age: 34, status: 'injured', lat: 34.045, lng: -118.255, notes: 'Triage: RED. Chemical burns.', updatedAt: new Date() } as any,
        { id: 's2', qrCode: 'SV-C3D4', name: 'Jane Smith', age: 28, status: 'rescued', lat: 34.041, lng: -118.251, notes: 'Triage: YELLOW. Minor abrasions.', updatedAt: new Date() } as any,
      ]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'survivors'), orderBy('updatedAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Survivor[];
        setSurvivors(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching survivors:', error);
      setLoading(false);
    }
  }, []);

  return { survivors, loading };
};

export const useRealtimeChat = (incidentId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !incidentId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'incident_chat', incidentId, 'messages'),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setMessages(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching chat messages:', error);
      setLoading(false);
    }
  }, [incidentId]);

  return { messages, loading };
};

export const useRealtimeResources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setResources([
        { id: 'res1', name: 'DEPOT OMEGA', location: 'SECTOR 4', distance: '1.2km', type: 'MEDICAL', status: 'CRITICAL', createdAt: new Date() },
        { id: 'res2', name: 'HUB ALPHA', location: 'SECTOR 1', distance: '3.4km', type: 'MULTI', status: 'OPERATIONAL', createdAt: new Date() },
      ]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setResources(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Error fetching resources:', error);
      setLoading(false);
    }
  }, []);

  return { resources, loading };
};
