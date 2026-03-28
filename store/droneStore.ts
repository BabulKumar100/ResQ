import { create } from 'zustand';

export interface Drone {
  id: string;
  name: string;
  type?: 'AIR' | 'GROUND' | 'MEDICAL';
  status: string;
  batteryPct?: number;
  fuelPct?: number;
  lat: number;
  lng: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  headingLabel?: string;
  isRecording?: boolean;
  assignedIncident?: string | null;
  eta?: string;
  agency?: string;
  equipment?: string[];
}

interface DroneStore {
  drones: Drone[];
  activeDroneId: string | null;
  setDrones: (drones: Drone[]) => void;
  setActiveDroneId: (id: string | null) => void;
  getActiveDrone: () => Drone | null;
  updatePosition: (id: string, pos: { lat: number; lng: number; altitude?: number; speed?: number }) => void;
  assignDrone: (droneId: string, incidentId: string) => void;
}

export const useDroneStore = create<DroneStore>((set, get) => ({
  drones: [],
  activeDroneId: null,
  setDrones: (drones) => set({ drones }),
  setActiveDroneId: (id) => set({ activeDroneId: id }),
  getActiveDrone: () => {
    const { drones, activeDroneId } = get();
    return drones.find(d => d.id === activeDroneId) || drones[0] || null;
  },
  updatePosition: (id, pos) => set(state => ({
    drones: state.drones.map(d => d.id === id ? { ...d, ...pos } : d)
  })),
  assignDrone: (droneId, incidentId) => {
    set(state => ({
      drones: state.drones.map(d => d.id === droneId ? { ...d, assignedIncident: incidentId, status: 'EN_ROUTE' } : d)
    }));
    // Optional: add map route layer trigger logic here
  }
}));
