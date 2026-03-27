'use client'

import React from 'react'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_COLORS, RESQMAP_LAYOUT } from '@/lib/resqmap-design-tokens'
import { IncidentCard } from './IncidentCard'
import { ChevronLeft } from 'lucide-react'

export function LeftSidebar() {
  const {
    incidents,
    sosAlerts,
    activeTab,
    filterSeverity,
    selectedIncident,
    leftSidebarCollapsed,
    setSelectedIncident,
    setActiveTab,
    setFilterSeverity,
    toggleLeftSidebar,
    getFilteredIncidents,
  } = useResqMapStore()

  const filteredIncidents = getFilteredIncidents()

  if (leftSidebarCollapsed) {
    return (
      <div
        style={{
          width: RESQMAP_LAYOUT.iconRailWidth,
          backgroundColor: RESQMAP_COLORS.surface,
          borderRight: `1px solid ${RESQMAP_COLORS.border}`,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
        }}
      >
        <button
          onClick={toggleLeftSidebar}
          className="p-2 hover:bg-gray-700 rounded transition"
          style={{ color: RESQMAP_COLORS.textSecondary }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: RESQMAP_LAYOUT.leftSidebarWidth,
        backgroundColor: RESQMAP_COLORS.surface,
        borderRight: `1px solid ${RESQMAP_COLORS.border}`,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ color: RESQMAP_COLORS.text }} className="text-sm font-bold">
          Dashboard
        </h2>
        <button
          onClick={toggleLeftSidebar}
          className="p-1 hover:bg-gray-700 rounded transition"
          style={{ color: RESQMAP_COLORS.textSecondary }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
        }}
      >
        {['incidents', 'sos', 'feed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              flex: 1,
              padding: '10px 8px',
              backgroundColor:
                activeTab === tab
                  ? RESQMAP_COLORS.surfaceLight
                  : RESQMAP_COLORS.surface,
              color:
                activeTab === tab
                  ? RESQMAP_COLORS.text
                  : RESQMAP_COLORS.textSecondary,
              borderBottom:
                activeTab === tab
                  ? `2px solid ${RESQMAP_COLORS.accentBlue}`
                  : 'none',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
            className="hover:bg-gray-700 transition"
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Filter Pills */}
      {activeTab === 'incidents' && (
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
          }}
        >
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterSeverity(filter as any)}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor:
                  filterSeverity === filter
                    ? RESQMAP_COLORS.accentBlue
                    : RESQMAP_COLORS.surfaceLight,
                color: RESQMAP_COLORS.text,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              className="hover:opacity-80 transition"
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'incidents' && (
          <div>
            {filteredIncidents.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{ color: RESQMAP_COLORS.textSecondary }}
                  className="text-xs"
                >
                  No incidents found
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  isSelected={selectedIncident?.id === incident.id}
                  onClick={() => setSelectedIncident(incident)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'sos' && (
          <div>
            {sosAlerts.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{ color: RESQMAP_COLORS.textSecondary }}
                  className="text-xs"
                >
                  No SOS alerts
                </p>
              </div>
            ) : (
              sosAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
                    borderLeft: `3px solid ${RESQMAP_COLORS.critical}`,
                  }}
                  className="animate-pulse-red cursor-pointer hover:bg-gray-800 transition"
                >
                  <div
                    style={{ color: RESQMAP_COLORS.text }}
                    className="text-sm font-semibold"
                  >
                    SOS Alert
                  </div>
                  <div
                    style={{ color: RESQMAP_COLORS.textSecondary }}
                    className="text-xs mt-1"
                  >
                    {alert.location}
                  </div>
                  <div
                    style={{ color: RESQMAP_COLORS.critical }}
                    className="text-xs mt-1 font-mono"
                  >
                    Escalations: {alert.escalationCount}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
            }}
          >
            <p
              style={{ color: RESQMAP_COLORS.textSecondary }}
              className="text-xs"
            >
              Live feed will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
