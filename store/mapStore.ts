import { create } from 'zustand';

interface MapOverlays {
  thermal: boolean;
  structural: boolean;
  population: boolean;
  hazard: boolean;
  bhuvanFlood: boolean;
  bhuvanLandslide: boolean;
  bhuvanDrought: boolean;
  evacuationRoutes: boolean;
}

interface MapStore {
  center: [number, number];
  zoom: number;
  overlays: MapOverlays;
  flyToTarget: [number, number] | null;
  mouseLatLng: { lat: number; lng: number } | null;
  dangerZones: any[]; // Firestore synced zones
  sosBeacons: any[];
  evacuationRoutes: any[];
  routeOrigin: [number, number] | null;
  routeDestination: [number, number] | null;
  activeRoutes: any[];
  setCenter: (c: [number, number]) => void;
  setZoom: (z: number) => void;
  toggleOverlay: (key: keyof MapOverlays) => void;
  setFlyToTarget: (t: [number, number] | null) => void;
  setMouseLatLng: (pos: { lat: number; lng: number } | null) => void;
  setDangerZones: (zones: any[]) => void;
  setSOSBeacons: (beacons: any[]) => void;
  setEvacuationRoutes: (routes: any[]) => void;
  setRoutePoints: (origin: [number, number] | null, dest: [number, number] | null) => void;
  setActiveRoutes: (routes: any[]) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: [20.5937, 78.9629], // Center of India
  zoom: 5,
  overlays: { 
    thermal: false, 
    structural: false, 
    population: false, 
    hazard: true,
    bhuvanFlood: false,
    bhuvanLandslide: false,
    bhuvanDrought: false,
    evacuationRoutes: false
  },
  flyToTarget: null,
  mouseLatLng: null,
  dangerZones: [],
  sosBeacons: [],
  evacuationRoutes: [],
  routeOrigin: null,
  routeDestination: null,
  activeRoutes: [],
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  toggleOverlay: (key) => set(state => ({ overlays: { ...state.overlays, [key]: !state.overlays[key] } })),
  setFlyToTarget: (flyToTarget) => set({ flyToTarget }),
  setMouseLatLng: (mouseLatLng) => set({ mouseLatLng }),
  setDangerZones: (dangerZones) => set({ dangerZones }),
  setSOSBeacons: (sosBeacons) => set({ sosBeacons }),
  setEvacuationRoutes: (evacuationRoutes) => set({ evacuationRoutes }),
  setRoutePoints: (routeOrigin, routeDestination) => set({ routeOrigin, routeDestination }),
  setActiveRoutes: (activeRoutes) => set({ activeRoutes }),
}));

