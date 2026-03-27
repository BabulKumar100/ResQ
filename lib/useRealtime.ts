import { useEffect, useState } from 'react';

// Common polling hook factory to simplify logic
function createRealtimeHook<T>(collectionName: string) {
  return () => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let active = true;

      const fetchData = async () => {
        try {
          const res = await fetch(`/api/db/${collectionName}?t=${Date.now()}`);
          if (res.ok && active) {
            const body = await res.json();
            setData(body);
            setLoading(false);
          }
        } catch (err) {
          console.warn(`Error fetching ${collectionName}:`, err);
          if (active) setLoading(false);
        }
      };

      fetchData(); // initial fetch
      const int = setInterval(fetchData, 3000); // Poll every 3 seconds

      return () => {
        active = false;
        clearInterval(int);
      };
    }, []);

    // To remain compatible with the previous destructive hook outputs:
    return { 
      [collectionName === 'danger_zones' ? 'zones' : collectionName === 'sos_beacons' ? 'sosAlerts' : collectionName]: data, 
      loading 
    } as any;
  };
}

export const useRealtimeIncidents = createRealtimeHook<any>('incidents');
export const useRealtimeSOS = createRealtimeHook<any>('sos_beacons');
export const useRealtimeDangerZones = createRealtimeHook<any>('danger_zones');
export const useRealtimeRescuers = createRealtimeHook<any>('rescuers');
export const useRealtimeSurvivors = createRealtimeHook<any>('survivors');
export const useRealtimeResources = createRealtimeHook<any>('resources');

const baseUseLiveEvents = createRealtimeHook<any>('live_events');

export const useRealtimeLiveEvents = () => {
  const { live_events, loading } = baseUseLiveEvents();
  return { events: live_events || [], loading };
};

export const useRealtimeRescuerPositions = () => {
  const { rescuers } = useRealtimeRescuers();
  const [positions, setPositions] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Generate map derived from rescuers array
    if (rescuers && rescuers.length > 0) {
      const posMap: any = {};
      rescuers.forEach((r: any) => posMap[r.id] = { lat: r.lat, lng: r.lng, heading: 0, lastUpdate: Date.now() });
      setPositions(posMap);
    }
  }, [rescuers]);
  
  return positions;
};

export const useRealtimeChat = (incidentId: string) => {
  // Mock chat since it's nested in firestore
  const [messages, setMessages] = useState<any[]>([]);
  return { messages, loading: false };
};
