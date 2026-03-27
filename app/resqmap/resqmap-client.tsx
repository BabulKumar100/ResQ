'use client'

import React, { useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { LeftSidebar } from '@/components/dashboard/LeftSidebar'
import { RightPanel } from '@/components/dashboard/RightPanel'
import { ResqMap } from '@/components/map/ResqMap'
import { LiveTicker } from '@/components/ui/LiveTicker'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_LAYOUT, RESQMAP_COLORS } from '@/lib/resqmap-design-tokens'

export default function ResqMapPage() {
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
        coords: [28.5244, 77.1855],
        escalationCount: 3,
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        status: 'ACTIVE' as const,
      },
    ]

    const mockRescuers = [
      {
        id: 'r1',
        name: 'Rescue Team Alpha',
        status: 'ACTIVE' as const,
        location: [28.6139, 77.209],
        team: 'Fire Department',
        availability: true,
      },
      {
        id: 'r2',
        name: 'Ambulance Unit 2',
        status: 'BUSY' as const,
        location: [28.5355, 77.391],
        team: 'Medical',
        availability: false,
      },
      {
        id: 'r3',
        name: 'Police Unit 5',
        status: 'INACTIVE' as const,
        location: [28.5721, 77.2207],
        team: 'Law Enforcement',
        availability: false,
      },
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
      {/* Top Bar */}
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
          <div style={{ flex: 1 }}>
            <ResqMap />
          </div>
          <LiveTicker />
        </div>

        {/* Right Panel */}
        <RightPanel />
      </div>
    </div>
  )
}
