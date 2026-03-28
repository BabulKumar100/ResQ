import { create } from 'zustand';

interface MapOverlays {
  thermal: boolean;
  structural: boolean;
  population: boolean;
  hazard: boolean;
}

interface MapStore {
  center: [number, number];
  zoom: number;
  overlays: MapOverlays;
  flyToTarget: [number, number] | null;
  mouseLatLng: { lat: number; lng: number } | null;
  setCenter: (c: [number, number]) => void;
  setZoom: (z: number) => void;
  toggleOverlay: (key: keyof MapOverlays) => void;
  setFlyToTarget: (t: [number, number] | null) => void;
  setMouseLatLng: (pos: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: [34.0522, -118.2437],
  zoom: 13,
  overlays: { thermal: false, structural: false, population: false, hazard: true },
  flyToTarget: null,
  mouseLatLng: null,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  toggleOverlay: (key) => set(state => ({ overlays: { ...state.overlays, [key]: !state.overlays[key] } })),
  setFlyToTarget: (flyToTarget) => set({ flyToTarget }),
  setMouseLatLng: (mouseLatLng) => set({ mouseLatLng }),
}));
