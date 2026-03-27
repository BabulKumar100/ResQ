'use client'

import React from 'react'
import { Incident } from '@/lib/resqmap-store'
import { RESQMAP_COLORS, RESQMAP_SEVERITY } from '@/lib/resqmap-design-tokens'
import { Clock, MapPin, Building2 } from 'lucide-react'

interface IncidentCardProps {
  incident: Incident
  isSelected?: boolean
  onClick?: () => void
}

export function IncidentCard({
  incident,
  isSelected = false,
  onClick,
}: IncidentCardProps) {
  const severityInfo = RESQMAP_SEVERITY[incident.severity]
  const timeAgo = getTimeAgo(incident.timestamp)

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-colors duration-200 animate-slide-in-left"
      style={{
        padding: '12px',
        borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
        backgroundColor: isSelected ? RESQMAP_COLORS.surfaceLight : 'transparent',
        borderLeft: `3px solid ${severityInfo.color}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header: Title + Severity Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{ color: RESQMAP_COLORS.text, fontSize: '14px', fontWeight: 600, margin: 0 }}>
            {incident.title}
          </h3>
          <span
            style={{
              backgroundColor: severityInfo.color,
              color: RESQMAP_COLORS.background,
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            }}
          >
            {severityInfo.label}
          </span>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin
              className="w-3.5 h-3.5"
              size={14}
              style={{ color: RESQMAP_COLORS.textSecondary, flexShrink: 0 }}
            />
            <span style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px' }}>
              {incident.location}
            </span>
          </div>

          {/* Agency + Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2
              className="w-3.5 h-3.5"
              size={14}
              style={{ color: RESQMAP_COLORS.textSecondary, flexShrink: 0 }}
            />
            <span style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px' }}>
              {incident.agency} • {incident.type}
            </span>
          </div>

          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock
              className="w-3.5 h-3.5"
              size={14}
              style={{ color: RESQMAP_COLORS.textSecondary, flexShrink: 0 }}
            />
            <span style={{ color: RESQMAP_COLORS.textMuted, fontSize: '12px' }}>
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Assigned Units Count */}
        {incident.assignedUnits && incident.assignedUnits.length > 0 && (
          <div
            style={{
              backgroundColor: RESQMAP_COLORS.surface,
              padding: '6px 8px',
              borderRadius: '3px',
              marginTop: '4px',
            }}
          >
            <span style={{ color: RESQMAP_COLORS.textSecondary, fontSize: '12px' }}>
              {incident.assignedUnits.length} unit{incident.assignedUnits.length !== 1 ? 's' : ''} assigned
            </span>
          </div>
        )}
      </div>
    </button>
  )
}

function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return past.toLocaleDateString()
}
}

function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return past.toLocaleDateString()
}
