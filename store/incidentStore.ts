import { create } from 'zustand';

export interface Incident {
  id: string;
  title?: string;
  type: string;
  severity: string;
  status: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  source?: string;
  incidentCode?: string;
  threatLevel?: string;
  unitsAssigned?: number;
  evacuationOrdered?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface IncidentStore {
  incidents: Incident[];
  activeIncidentId: string | null;
  filterSeverity: string;
  sortOrder: 'newest' | 'oldest' | 'severity';
  setIncidents: (incidents: Incident[]) => void;
  setActiveIncidentId: (id: string | null) => void;
  setFilterSeverity: (sev: string) => void;
  setSortOrder: (order: 'newest' | 'oldest' | 'severity') => void;
  getFiltered: () => Incident[];
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  activeIncidentId: null,
  filterSeverity: 'all',
  sortOrder: 'newest',
  setIncidents: (incidents) => set({ incidents }),
  setActiveIncidentId: (id) => {
    set({ activeIncidentId: id });
    if (id) {
      const incident = get().incidents.find(i => i.id === id);
      if (incident) {
        import('./mapStore').then(m => m.useMapStore.getState().setFlyToTarget([incident.lat, incident.lng]));
      }
    }
  },
  setFilterSeverity: (sev) => set({ filterSeverity: sev }),
  setSortOrder: (order) => set({ sortOrder: order }),
  getFiltered: () => {
    const { incidents, filterSeverity, sortOrder } = get();
    let filtered = filterSeverity === 'all' ? incidents : incidents.filter(i => i.severity?.toLowerCase() === filterSeverity.toLowerCase());
    
    if (sortOrder === 'severity') {
      const sev: any = { critical: 0, high: 1, medium: 2, low: 3 };
      filtered = [...filtered].sort((a, b) => (sev[a.severity?.toLowerCase() as keyof typeof sev] ?? 9) - (sev[b.severity?.toLowerCase() as keyof typeof sev] ?? 9));
    } else if (sortOrder === 'oldest') {
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    
    return filtered;
  }
}));
