/**
 * ResqMap Zustand Store
 * Centralized state management for dashboard data and UI
 */

import { create } from 'zustand'

export interface Incident {
  id: string
  title: string
  location: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'ACTIVE' | 'RESOLVED'
  type: string
  agency: string
  timestamp: string
  lat: number
  lng: number
  assignedUnits?: string[]
  details?: string
}

export interface SOSAlert {
  id: string
  location: string
  coords: [number, number]
  escalationCount: number
  timestamp: string
  status: 'ACTIVE' | 'ACKNOWLEDGED'
}

export interface Rescuer {
  id: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'BUSY'
  location: [number, number]
  team: string
  availability: boolean
}

export interface DisasterEvent {
  id: string
  title: string
  type: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  timestamp: string
  affectedArea: string
}

interface ResqMapStore {
  // Data
  incidents: Incident[]
  sosAlerts: SOSAlert[]
  rescuers: Rescuer[]
  disasterEvents: DisasterEvent[]
  
  // UI State
  selectedIncident: Incident | null
  selectedSOSAlert: SOSAlert | null
  activeTab: 'incidents' | 'sos' | 'feed' | 'survivors' | 'resources'
  filterSeverity: 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  leftSidebarCollapsed: boolean
  rightPanelExpanded: boolean
  mapHeatmapEnabled: boolean
  
  // Connection
  isOnline: boolean
  lastUpdate: number
  
  // Actions
  setIncidents: (incidents: Incident[]) => void
  addIncident: (incident: Incident) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  
  setSOSAlerts: (alerts: SOSAlert[]) => void
  addSOSAlert: (alert: SOSAlert) => void
  updateSOSAlert: (id: string, updates: Partial<SOSAlert>) => void
  
  setRescuers: (rescuers: Rescuer[]) => void
  updateRescuer: (id: string, updates: Partial<Rescuer>) => void
  
  setDisasterEvents: (events: DisasterEvent[]) => void
  
  setSelectedIncident: (incident: Incident | null) => void
  setSelectedSOSAlert: (alert: SOSAlert | null) => void
  setActiveTab: (tab: 'incidents' | 'sos' | 'feed' | 'survivors' | 'resources') => void
  setFilterSeverity: (severity: 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') => void
  toggleLeftSidebar: () => void
  toggleRightPanel: () => void
  toggleHeatmap: () => void
  
  setIsOnline: (online: boolean) => void
  setLastUpdate: (timestamp: number) => void
  
  // Computed
  getFilteredIncidents: () => Incident[]
  getActiveIncidentsCount: () => number
  getActiveSosCount: () => number
  getOnlineRescuersCount: () => number
}

export const useResqMapStore = create<ResqMapStore>((set, get) => ({
  // Initial state
  incidents: [],
  sosAlerts: [],
  rescuers: [],
  disasterEvents: [],
  
  selectedIncident: null,
  selectedSOSAlert: null,
  activeTab: 'incidents',
  filterSeverity: 'all',
  leftSidebarCollapsed: false,
  rightPanelExpanded: false,
  mapHeatmapEnabled: false,
  
  isOnline: true,
  lastUpdate: Date.now(),
  
  // Actions
  setIncidents: (incidents) => set({ incidents, lastUpdate: Date.now() }),
  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
      lastUpdate: Date.now(),
    })),
  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updates } : inc
      ),
      lastUpdate: Date.now(),
    })),
  
  setSOSAlerts: (alerts) => set({ sosAlerts: alerts, lastUpdate: Date.now() }),
  addSOSAlert: (alert) =>
    set((state) => ({
      sosAlerts: [alert, ...state.sosAlerts],
      lastUpdate: Date.now(),
    })),
  updateSOSAlert: (id, updates) =>
    set((state) => ({
      sosAlerts: state.sosAlerts.map((alert) =>
        alert.id === id ? { ...alert, ...updates } : alert
      ),
      lastUpdate: Date.now(),
    })),
  
  setRescuers: (rescuers) => set({ rescuers, lastUpdate: Date.now() }),
  updateRescuer: (id, updates) =>
    set((state) => ({
      rescuers: state.rescuers.map((rescuer) =>
        rescuer.id === id ? { ...rescuer, ...updates } : rescuer
      ),
      lastUpdate: Date.now(),
    })),
  
  setDisasterEvents: (events) => set({ disasterEvents: events, lastUpdate: Date.now() }),
  
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  setSelectedSOSAlert: (alert) => set({ selectedSOSAlert: alert }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelExpanded: !state.rightPanelExpanded })),
  toggleHeatmap: () =>
    set((state) => ({ mapHeatmapEnabled: !state.mapHeatmapEnabled })),
  
  setIsOnline: (online) => set({ isOnline: online }),
  setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
  
  // Computed selectors
  getFilteredIncidents: () => {
    const state = get()
    return state.filterSeverity === 'all'
      ? state.incidents
      : state.incidents.filter((inc) => inc.severity === state.filterSeverity)
  },
  
  getActiveIncidentsCount: () => {
    const state = get()
    return state.incidents.filter((inc) => inc.status === 'ACTIVE').length
  },
  
  getActiveSosCount: () => {
    const state = get()
    return state.sosAlerts.filter((alert) => alert.status === 'ACTIVE').length
  },
  
  getOnlineRescuersCount: () => {
    const state = get()
    return state.rescuers.filter((rescuer) => rescuer.status !== 'INACTIVE').length
  },
}))
