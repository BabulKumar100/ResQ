import { create } from 'zustand';

export interface Survivor {
  id: string;
  idRef?: string;
  qrCode?: string;
  name: string;
  age: number;
  triage: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';
  lat: number;
  lng: number;
  status: string;
  incidentId?: string;
  rescuerId?: string | null;
  notes?: string;
  updatedAt?: any;
}

interface SurvivorStore {
  survivors: Survivor[];
  searchQuery: string;
  setSurvivors: (survivors: Survivor[]) => void;
  setSearchQuery: (q: string) => void;
  getFiltered: () => Survivor[];
}

export const useSurvivorStore = create<SurvivorStore>((set, get) => ({
  survivors: [],
  searchQuery: '',
  setSurvivors: (survivors) => set({ survivors }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  getFiltered: () => {
    const { survivors, searchQuery } = get();
    if (!searchQuery) return survivors;
    const q = searchQuery.toLowerCase();
    return survivors.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.idRef?.toLowerCase().includes(q) ||
      s.qrCode?.toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
  }
}));
