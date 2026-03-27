'use client'

import React from 'react'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_COLORS, RESQMAP_LAYOUT } from '@/lib/resqmap-design-tokens'
import { ChevronRight, X } from 'lucide-react'

export function RightPanel() {
  const { selectedIncident, rightPanelExpanded, toggleRightPanel } = useResqMapStore()

  const width = rightPanelExpanded ? RESQMAP_LAYOUT.rightPanelExpanded : RESQMAP_LAYOUT.rightPanelCollapsed

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
        overflowY: 'auto',
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
        <h3 style={{ color: RESQMAP_COLORS.text, fontSize: '14px', fontWeight: 600, margin: 0 }}>
          {selectedIncident ? 'Incident' : 'Dashboard'}
        </h3>
        <button
          onClick={toggleRightPanel}
          className="p-1 hover:bg-gray-700 rounded transition"
          style={{ color: RESQMAP_COLORS.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {rightPanelExpanded ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedIncident ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Incident Title */}
            <div>
              <h4 style={{ color: RESQMAP_COLORS.text, fontSize: '14px', fontWeight: 700, margin: 0, marginBottom: '4px' }}>
                {selectedIncident.title}
              </h4>
              <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: 0 }}>
                {selectedIncident.location}
              </p>
            </div>

            {/* Status Badges */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span
                style={{
                  backgroundColor:
                    selectedIncident.severity === 'CRITICAL'
                      ? RESQMAP_COLORS.critical
                      : RESQMAP_COLORS.high,
                  color: RESQMAP_COLORS.background,
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
              >
                {selectedIncident.severity}
              </span>
              <span
                style={{
                  backgroundColor: RESQMAP_COLORS.accentBlue,
                  color: RESQMAP_COLORS.background,
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
              >
                {selectedIncident.status}
              </span>
            </div>

            {/* Details */}
            <div style={{ borderTop: `1px solid ${RESQMAP_COLORS.border}`, paddingTop: '12px' }}>
              <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                <strong>Agency:</strong> {selectedIncident.agency}
              </p>
              <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                <strong>Type:</strong> {selectedIncident.type}
              </p>
              <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: 0 }}>
                <strong>Assigned Units:</strong> {selectedIncident.assignedUnits?.length || 0}
              </p>
            </div>

            {/* Description */}
            {selectedIncident.details && (
              <div>
                <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: 0 }}>
                  {selectedIncident.details}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {rightPanelExpanded && (
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px' }}>
                <button
                  style={{
                    backgroundColor: RESQMAP_COLORS.accentBlue,
                    color: RESQMAP_COLORS.background,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                  className="hover:opacity-80 transition"
                >
                  Assign Unit
                </button>
                <button
                  style={{
                    backgroundColor: RESQMAP_COLORS.surface,
                    color: RESQMAP_COLORS.text,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${RESQMAP_COLORS.border}`,
                    cursor: 'pointer',
                    flex: 1,
                  }}
                  className="hover:bg-gray-700 transition"
                >
                  View on Map
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '24px' }}>
            <p style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px', margin: 0 }}>
              Select an incident to view details
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
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
        <h3 style={{ color: RESQMAP_COLORS.text }} className="text-sm font-semibold">
          {selectedIncident ? 'Incident' : 'Dashboard'}
        </h3>
        <button
          onClick={toggleRightPanel}
          className="p-1 hover:bg-gray-700 rounded transition"
          style={{ color: RESQMAP_COLORS.textSecondary }}
        >
          {rightPanelExpanded ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {selectedIncident ? (
          <div className="space-y-3">
            {/* Incident Title */}
            <div>
              <h4 style={{ color: RESQMAP_COLORS.text }} className="text-sm font-bold">
                {selectedIncident.title}
              </h4>
              <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs mt-1">
                {selectedIncident.location}
              </p>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
              <span
                style={{
                  backgroundColor:
                    selectedIncident.severity === 'CRITICAL'
                      ? RESQMAP_COLORS.critical
                      : RESQMAP_COLORS.high,
                  color: RESQMAP_COLORS.background,
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
              >
                {selectedIncident.severity}
              </span>
              <span
                style={{
                  backgroundColor: RESQMAP_COLORS.accentBlue,
                  color: RESQMAP_COLORS.background,
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
              >
                {selectedIncident.status}
              </span>
            </div>

            {/* Details */}
            <div style={{ borderTop: `1px solid ${RESQMAP_COLORS.border}`, paddingTop: '12px' }}>
              <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs mb-2">
                <strong>Agency:</strong> {selectedIncident.agency}
              </p>
              <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs mb-2">
                <strong>Type:</strong> {selectedIncident.type}
              </p>
              <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
                <strong>Assigned Units:</strong> {selectedIncident.assignedUnits?.length || 0}
              </p>
            </div>

            {/* Description */}
            {selectedIncident.details && (
              <div>
                <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
                  {selectedIncident.details}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {rightPanelExpanded && (
              <div className="flex gap-2 pt-4">
                <button
                  style={{
                    backgroundColor: RESQMAP_COLORS.accentBlue,
                    color: RESQMAP_COLORS.background,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="hover:opacity-80 transition flex-1"
                >
                  Assign Unit
                </button>
                <button
                  style={{
                    backgroundColor: RESQMAP_COLORS.surface,
                    color: RESQMAP_COLORS.text,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${RESQMAP_COLORS.border}`,
                    cursor: 'pointer',
                  }}
                  className="hover:bg-gray-700 transition flex-1"
                >
                  View on Map
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '24px' }}>
            <p style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
              Select an incident to view details
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
