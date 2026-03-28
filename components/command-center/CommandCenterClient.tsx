'use client'

import React, { useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { LeftSidebar } from '@/components/dashboard/LeftSidebar'
import { CommandCenterRightPanel } from '@/components/command-center/CommandCenterRightPanel'
import { ResqMap } from '@/components/map/ResqMap'
import { LiveTicker } from '@/components/ui/LiveTicker'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_COLORS } from '@/lib/resqmap-design-tokens'

export default function CommandCenterClient() {
  const { setIncidents, setSOSAlerts, setRescuers, setIsOnline } = useResqMapStore()

  // Load mock data
  useEffect(() => {
    const mockIncidents = [
      {
        id: '1',
        title: 'Building Collapse',
        location: 'Delhi - Sector 5',
        severity: 'CRITICAL' as const,
        status: 'ACTIVE' as const,
        type: 'Structural',
        agency: 'Delhi Fire',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        lat: 28.5355,
        lng: 77.391,
        assignedUnits: ['Unit-001', 'Unit-002'],
        details: 'Multi-story building partially collapsed due to structural failure.',
      },
      {
        id: '2',
        title: 'Traffic Accident',
        location: 'Delhi - Ring Road',
        severity: 'HIGH' as const,
        status: 'ACTIVE' as const,
        type: 'Road Accident',
        agency: 'Traffic Police',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        lat: 28.6139,
        lng: 77.209,
        assignedUnits: ['Unit-003'],
        details: 'Multi-vehicle collision with casualties.',
      },
      {
        id: '3',
        title: 'Medical Emergency',
        location: 'Delhi - Hospital Zone',
        severity: 'MEDIUM' as const,
        status: 'ACTIVE' as const,
        type: 'Medical',
        agency: 'Ambulance Service',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        lat: 28.5721,
        lng: 77.2207,
        assignedUnits: [],
        details: 'Patient requiring emergency transport.',
      },
    ]

    const mockSOS = [
      {
        id: 'sos-1',
        location: 'South Delhi',
        coords: [28.5244, 77.1855] as [number, number],
        escalationCount: 3,
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        status: 'ACTIVE' as const,
      },
    ]

    const mockRescuers = [
      {
        id: 'r1',
        name: 'Alpha Team',
        status: 'ACTIVE' as const,
        location: [28.6139, 77.209] as [number, number],
        team: 'Fire Department',
        availability: true,
      },
      {
        id: 'r2',
        name: 'Medic Unit 2',
        status: 'BUSY' as const,
        location: [28.5355, 77.391] as [number, number],
        team: 'Medical Response',
        availability: false,
      },
      {
        id: 'r3',
        name: 'Patrol 5',
        status: 'ACTIVE' as const,
        location: [28.5721, 77.2207] as [number, number],
        team: 'Police Department',
        availability: true,
      },
      {
        id: 'r4',
        name: 'Search & Rescue 1',
        status: 'ACTIVE' as const,
        location: [28.6250, 77.1000] as [number, number],
        team: 'Rescue Squad',
        availability: true,
      }
    ]

    setIncidents(mockIncidents)
    setSOSAlerts(mockSOS)
    setRescuers(mockRescuers)
    setIsOnline(true)
  }, [setIncidents, setSOSAlerts, setRescuers, setIsOnline])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: RESQMAP_COLORS.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar can be overridden or supplemented later if needed, but standard TopBar works fine */}
      <TopBar />

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Map (Center) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            {/* The multi-agency command map overlay could go here, but for now ResqMap has the markers */}
            <ResqMap />
            
            <div className="absolute top-4 left-4 z-[9999] bg-black bg-opacity-70 p-2 rounded text-xs text-white border" style={{ borderColor: RESQMAP_COLORS.border }}>
              <strong>Multi-Agency Unit Legend</strong><br/>
              <span style={{ color: '#ef4444' }}>●</span> Fire<br/>
              <span style={{ color: '#10b981' }}>●</span> Medical<br/>
              <span style={{ color: '#3b82f6' }}>●</span> Police<br/>
              <span style={{ color: '#f59e0b' }}>●</span> Rescue<br/>
            </div>
          </div>
          <LiveTicker />
        </div>

        {/* Right Panel for Command Center */}
        <CommandCenterRightPanel />
      </div>
    </div>
  )
}
