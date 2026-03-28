import { create } from 'zustand';

export interface Resource {
  id: string;
  name?: string;
  type?: string;
  quantity?: number;
  unit?: string;
  status: string;
  location?: string;
  distance?: string;
  createdAt?: any;
}

export interface Hub {
  id: string;
  name: string;
  sector?: string;
  location?: string;
  type: string;
  status: string;
  lat?: number;
  lng?: number;
  distance?: string | number;
  resources?: Record<string, number>;
}

interface ResourceStore {
  resources: Resource[];
  hubs: Hub[];
  hubSearch: string;
  setResources: (r: Resource[]) => void;
  setHubs: (h: Hub[]) => void;
  setHubSearch: (q: string) => void;
  getFilteredHubs: () => Hub[];
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: [],
  hubs: [],
  hubSearch: '',
  setResources: (resources) => set({ resources }),
  setHubs: (hubs) => set({ hubs }),
  setHubSearch: (q) => set({ hubSearch: q }),
  getFilteredHubs: () => {
    const { hubs, hubSearch } = get();
    if (!hubSearch) return hubs;
    const q = hubSearch.toLowerCase();
    return hubs.filter(h => h.name?.toLowerCase().includes(q) || h.sector?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q));
  }
}));
