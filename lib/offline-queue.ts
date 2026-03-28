import { openDB, IDBPDatabase } from 'idb';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DB_NAME = 'resqmap_offline_db';
const STORE_NAME = 'event_queue';

export interface OfflineEvent {
  id: string;
  type: 'incident' | 'survivor' | 'sos' | 'report';
  data: any;
  timestamp: string;
}

let dbInstance: IDBPDatabase | null = null;

async function getDB() {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbInstance;
}

export async function queueEvent(type: OfflineEvent['type'], data: any) {
  const dbStore = await getDB();
  const event: OfflineEvent = {
    id: `event-${Date.now()}`,
    type,
    data,
    timestamp: new Date().toISOString(),
  };

  await dbStore.add(STORE_NAME, event);
  console.log(`Queued ${type} event offline:`, event);
  
  if (navigator.onLine) {
    await syncQueue();
  }
}

export async function syncQueue() {
  const dbStore = await getDB();
  const events: OfflineEvent[] = await dbStore.getAll(STORE_NAME);

  if (events.length === 0) return;

  console.log(`Syncing ${events.length} queued events...`);

  for (const event of events) {
    try {
      let collectionName = '';
      switch (event.type) {
        case 'incident': collectionName = 'incidents'; break;
        case 'survivor': collectionName = 'survivors'; break;
        case 'sos': collectionName = 'sos_beacons'; break;
        case 'report': collectionName = 'reports'; break;
      }

      const res = await addDoc(collection(db, collectionName), {
        ...event.data,
        syncedAt: serverTimestamp(),
        offlineTimestamp: event.timestamp,
      });

      if (res.id) {
        await dbStore.delete(STORE_NAME, event.id);
        console.log(`Successfully synced ${event.type} event:`, event.id);
      }
    } catch (e) {
      console.error(`Failed to sync event ${event.id}:`, e);
      // Wait for next sync attempt
    }
  }
}

export async function clearQueue() {
  const dbStore = await getDB();
  await dbStore.clear(STORE_NAME);
}
