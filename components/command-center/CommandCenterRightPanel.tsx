'use client'

import React, { useState } from 'react'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_COLORS, RESQMAP_LAYOUT } from '@/lib/resqmap-design-tokens'
import { ChevronRight, ShieldAlert, CheckCircle } from 'lucide-react'
import { IncidentChat } from './IncidentChat'

export function CommandCenterRightPanel() {
  const { selectedIncident, rightPanelExpanded, toggleRightPanel, updateIncident } = useResqMapStore()
  const width = rightPanelExpanded ? RESQMAP_LAYOUT.rightPanelExpanded : RESQMAP_LAYOUT.rightPanelCollapsed

  // Local state for role simulation
  const [currentRole, setCurrentRole] = useState('Commander')

  const handleResolve = () => {
    if (selectedIncident) {
      updateIncident(selectedIncident.id, { status: 'RESOLVED' })
    }
  }

  const handleEscalate = () => {
    if (selectedIncident) {
      updateIncident(selectedIncident.id, { severity: 'CRITICAL' })
    }
  }

  return (
    <div
      className="animate-slide-in-right"
      style={{
        width,
        backgroundColor: RESQMAP_COLORS.surface,
        borderLeft: `1px solid ${RESQMAP_COLORS.border}`,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div className="p-3 flex justify-between items-center border-b" style={{ borderColor: RESQMAP_COLORS.border }}>
        <h3 className="text-sm font-semibold m-0" style={{ color: RESQMAP_COLORS.text }}>
          {selectedIncident ? 'Command Operations' : 'Command Board'}
        </h3>
        
        {rightPanelExpanded && (
          <select 
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="ml-2 text-xs bg-transparent outline-none border rounded p-1"
            style={{ color: RESQMAP_COLORS.text, borderColor: RESQMAP_COLORS.border }}
          >
            <option value="Commander">Commander (All)</option>
            <option value="Fire Chief">Fire Dept</option>
            <option value="Police Chief">Police Dept</option>
            <option value="Medical Chief">Medical Dept</option>
          </select>
        )}

        <button
          onClick={toggleRightPanel}
          className="p-1 hover:bg-gray-700 rounded transition ml-2"
          style={{ color: RESQMAP_COLORS.textSecondary, background: 'none' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        {selectedIncident ? (
          <>
            <div className="p-4 flex-shrink-0">
              <div className="mb-3">
                <h4 className="text-sm font-bold m-0 mb-1" style={{ color: RESQMAP_COLORS.text }}>
                  {selectedIncident.title}
                </h4>
                <p className="text-xs m-0" style={{ color: RESQMAP_COLORS.textSecondary }}>
                  {selectedIncident.location}
                </p>
              </div>

              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: selectedIncident.severity === 'CRITICAL' ? RESQMAP_COLORS.critical : RESQMAP_COLORS.high, color: RESQMAP_COLORS.background }}>
                  {selectedIncident.severity}
                </span>
                <span className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: selectedIncident.status === 'RESOLVED' ? RESQMAP_COLORS.low : RESQMAP_COLORS.accentBlue, color: RESQMAP_COLORS.background }}>
                  {selectedIncident.status}
                </span>
              </div>

              <div className="pt-3 border-t grid grid-cols-2 gap-2 text-xs" style={{ borderColor: RESQMAP_COLORS.border, color: RESQMAP_COLORS.textSecondary }}>
                <p className="m-0"><strong>Agency:</strong><br/>{selectedIncident.agency}</p>
                <p className="m-0"><strong>Type:</strong><br/>{selectedIncident.type}</p>
                <p className="m-0"><strong>Units:</strong><br/>{selectedIncident.assignedUnits?.length || 0}</p>
                <p className="m-0"><strong>ID:</strong><br/>{selectedIncident.id}</p>
              </div>

              {selectedIncident.details && (
                <div className="mt-3 text-xs" style={{ color: RESQMAP_COLORS.textSecondary }}>
                  <p className="m-0">{selectedIncident.details}</p>
                </div>
              )}

              {/* Action Buttons for Commander */}
              {rightPanelExpanded && selectedIncident.status !== 'RESOLVED' && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleEscalate}
                    className="flex-1 py-2 px-3 rounded text-xs font-bold hover:opacity-80 transition flex items-center justify-center gap-1"
                    style={{ backgroundColor: RESQMAP_COLORS.critical, color: RESQMAP_COLORS.background }}
                  >
                    <ShieldAlert size={14} /> Escalate
                  </button>
                  <button
                    onClick={handleResolve}
                    className="flex-1 py-2 px-3 rounded text-xs font-bold hover:opacity-80 transition flex items-center justify-center gap-1"
                    style={{ backgroundColor: RESQMAP_COLORS.low, color: RESQMAP_COLORS.background }}
                  >
                    <CheckCircle size={14} /> Resolve
                  </button>
                </div>
              )}
            </div>

            {/* Chat Section */}
            {rightPanelExpanded && (
              <div className="flex-1 min-h-[300px]">
                <IncidentChat incidentId={selectedIncident.id} currentRole={currentRole} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center pt-8">
            <p className="text-xs m-0" style={{ color: RESQMAP_COLORS.textSecondary }}>
              Select an incident from the map<br/>to open Command Operations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
