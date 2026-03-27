import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  serverTimestamp,
  FieldValue,
  Timestamp,
} from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { db, rtdb } from './firebase';
import * as turf from '@turf/turf';

// Types
export interface Incident {
  id?: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  address: string;
  status: 'active' | 'assigned' | 'resolved';
  agency: string;
  source: 'manual' | 'gdacs' | 'usgs' | 'firms' | 'noaa';
  externalId?: string;
  description: string;
  assignedTo: string[];
  reportedBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Rescuer {
  id?: string;
  userId: string;
  name: string;
  role: 'admin' | 'dispatcher' | 'rescuer' | 'viewer';
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  agency: string;
  fuelPct: number;
  crewCount: number;
  equipment: string[];
  lastPing?: Timestamp;
}

export interface SOSBeacon {
  id?: string;
  senderId: string;
  lat: number;
  lng: number;
  message: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  escalationCount: number;
  createdAt?: Timestamp;
  acknowledgedAt?: Timestamp;
}

export interface DangerZone {
  id?: string;
  name: string;
  severity: string;
  type: 'flood' | 'fire' | 'collapse' | 'chemical' | 'biological';
  source: 'manual' | 'nasa' | 'noaa' | 'gdacs';
  coordinates: Array<{ lat: number; lng: number }>;
  active: boolean;
  createdAt?: Timestamp;
}

export interface Survivor {
  id?: string;
  qrCode: string;
  name: string;
  age: number;
  status: 'missing' | 'found' | 'injured' | 'rescued' | 'hospitalized';
  lat: number;
  lng: number;
  foundBy?: string;
  notes: string;
  updatedAt?: Timestamp;
}

export interface LiveEvent {
  id?: string;
  source: 'gdacs' | 'usgs' | 'firms' | 'reliefweb' | 'noaa' | 'who';
  eventType: string;
  title: string;
  severity: string;
  lat: number;
  lng: number;
  description: string;
  externalUrl: string;
  externalId: string;
  fetchedAt?: Timestamp;
}

// INCIDENTS
export const createIncident = async (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'incidents'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateIncident = async (id: string, data: Partial<Incident>): Promise<void> => {
  await updateDoc(doc(db, 'incidents', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const resolveIncident = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'incidents', id), {
    status: 'resolved',
    updatedAt: serverTimestamp(),
  });
};

export const getActiveIncidents = async (): Promise<Incident[]> => {
  const q = query(
    collection(db, 'incidents'),
    where('status', '!=', 'resolved'),
    orderBy('status'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Incident));
};

export const getNearestRescuers = async (
  lat: number,
  lng: number,
  radiusKm: number = 5
): Promise<Rescuer[]> => {
  const rescuers = await getDocs(collection(db, 'rescuers'));
  const nearbyRescuers = rescuers.docs
    .map((d) => ({ id: d.id, ...d.data() } as Rescuer))
    .filter((r) => {
      const distance = turf.distance([lng, lat], [r.lng, r.lat], { units: 'kilometers' });
      return distance <= radiusKm && r.status === 'available';
    })
    .sort((a, b) => {
      const distA = turf.distance([lng, lat], [a.lng, a.lat], { units: 'kilometers' });
      const distB = turf.distance([lng, lat], [b.lng, b.lat], { units: 'kilometers' });
      return distA - distB;
    });
  return nearbyRescuers;
};

// SOS BEACONS
export const triggerSOS = async (data: Omit<SOSBeacon, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'sos_beacons'), {
    ...data,
    escalationCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const acknowledgeSOS = async (id: string, rescuerId: string): Promise<void> => {
  await updateDoc(doc(db, 'sos_beacons', id), {
    status: 'acknowledged',
    assignedTo: rescuerId,
    acknowledgedAt: serverTimestamp(),
  });
};

export const escalateSOS = async (id: string): Promise<void> => {
  const sosRef = doc(db, 'sos_beacons', id);
  const sosSnap = await getDoc(sosRef);
  const current = (sosSnap.data()?.escalationCount || 0) as number;
  await updateDoc(sosRef, {
    escalationCount: current + 1,
  });
};

// SURVIVORS
export const upsertSurvivor = async (qrCode: string, data: Partial<Survivor>): Promise<string> => {
  const q = query(collection(db, 'survivors'), where('qrCode', '==', qrCode));
  const snap = await getDocs(q);

  if (snap.empty) {
    const docRef = await addDoc(collection(db, 'survivors'), {
      qrCode,
      ...data,
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } else {
    const existingId = snap.docs[0].id;
    await updateDoc(doc(db, 'survivors', existingId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return existingId;
  }
};

// DANGER ZONES
export const createDangerZone = async (data: Omit<DangerZone, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'danger_zones'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const checkPointInZones = async (lat: number, lng: number): Promise<DangerZone[]> => {
  const q = query(collection(db, 'danger_zones'), where('active', '==', true));
  const snap = await getDocs(q);
  const zones = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DangerZone));

  const point = turf.point([lng, lat]);
  return zones.filter((zone) => {
    try {
      const polygon = turf.polygon([zone.coordinates.map((c) => [c.lng, c.lat])]);
      return turf.booleanPointInPolygon(point, polygon);
    } catch {
      return false;
    }
  });
};

// LIVE EVENTS (dedup by externalId + source)
export const upsertLiveEvent = async (event: Omit<LiveEvent, 'id' | 'fetchedAt'>): Promise<string> => {
  const q = query(
    collection(db, 'live_events'),
    where('externalId', '==', event.externalId),
    where('source', '==', event.source)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    const docRef = await addDoc(collection(db, 'live_events'), {
      ...event,
      fetchedAt: serverTimestamp(),
    });
    return docRef.id;
  } else {
    const existingId = snap.docs[0].id;
    await updateDoc(doc(db, 'live_events', existingId), {
      ...event,
      fetchedAt: serverTimestamp(),
    });
    return existingId;
  }
};

export const getRecentLiveEvents = async (limit_count: number = 100): Promise<LiveEvent[]> => {
  const q = query(collection(db, 'live_events'), orderBy('fetchedAt', 'desc'), limit(limit_count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LiveEvent));
};

// CHAT MESSAGES
export const sendChatMessage = async (
  incidentId: string,
  userId: string,
  userName: string,
  message: string
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'incident_chat', incidentId, 'messages'), {
    userId,
    userName,
    message,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// RESOURCES
export const createResource = async (
  data: Omit<any, 'id' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'resources'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateResource = async (id: string, data: Partial<any>): Promise<void> => {
  await updateDoc(doc(db, 'resources', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// RESCUERS
export const updateRescuerProfile = async (rescuerId: string, data: Partial<Rescuer>): Promise<void> => {
  await updateDoc(doc(db, 'rescuers', rescuerId), {
    ...data,
    lastPing: serverTimestamp(),
  });
};

export const getRescuerProfile = async (rescuerId: string): Promise<Rescuer | null> => {
  const snap = await getDoc(doc(db, 'rescuers', rescuerId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Rescuer) : null;
};
