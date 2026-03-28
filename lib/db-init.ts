import { db, rtdb, collection, query, onSnapshot } from './firebase'
// @ts-ignore
import { orderBy, limit, where } from 'firebase/firestore'
import { ref, onValue } from 'firebase/database'

// Stores
import { useIncidentStore } from '@/store/incidentStore'
import { useDroneStore } from '@/store/droneStore'
import { useSurvivorStore } from '@/store/survivorStore'
import { useMapStore } from '@/store/mapStore'
import { useSystemStore } from '@/store/systemStore'
import { useResourceStore } from '@/store/resourceStore'

export const initializeGlobalListeners = () => {
  // 1. Incidents
  const incidentsQuery = query(
    collection(db, 'incidents'),
    orderBy('createdAt', 'desc'),
    limit(50)
  )

  onSnapshot(incidentsQuery, (snapshot: any) => {
    const incidents = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    useIncidentStore.getState().setIncidents(incidents as any)
  })

  // 2. Survivors
  onSnapshot(collection(db, 'survivors'), (snapshot: any) => {
    const survivors = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    useSurvivorStore.getState().setSurvivors(survivors as any)
  })

  // 3. Drone Realtime Positions (RTDB)
  if (rtdb && (rtdb as any).ref) {
    const dronePositionsRef = ref(rtdb, 'drone_positions')
    onValue(dronePositionsRef, (snapshot: any) => {
      const positions = snapshot.val?.() || {}
      Object.entries(positions).forEach(([id, pos]: any) => {
        useDroneStore.getState().updatePosition(id, pos)
      })
    })
  }

  // 4. Resources
  onSnapshot(collection(db, 'local_resources'), (snapshot: any) => {
    const resources = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    useResourceStore.getState().setResources(resources as any)
  })

  // 5. Danger Zones (Tactical Map India)
  onSnapshot(collection(db, 'danger_zones'), (snapshot: any) => {
    const zones = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    useMapStore.getState().setDangerZones(zones as any)
  })

  // 6. SOS Beacons
  onSnapshot(collection(db, 'sos_beacons'), (snapshot: any) => {
    snapshot.docChanges?.().forEach((change: any) => {
      const data = change.doc.data();
      if (change.type === 'added' && data.status === 'pending') {
        useSystemStore.getState().addNotification?.({
          id: change.doc.id,
          type: 'SOS',
          urgency: 'critical',
          title: 'NEW SOS BEACON',
          message: `Distress signal from ${data.userName || 'Unknown Resident'}`,
          timestamp: Date.now()
        });
      }
    });

    const beacons = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    useMapStore.getState().setSOSBeacons?.(beacons as any);
  });

  // 7. Evacuation Routes
  onSnapshot(collection(db, 'evacuation_routes'), (snapshot: any) => {
    const routes = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    useMapStore.getState().setEvacuationRoutes?.(routes as any);
  });
}
