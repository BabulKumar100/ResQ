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
