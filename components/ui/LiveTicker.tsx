'use client'

import React, { useEffect, useState } from 'react'
import { RESQMAP_COLORS, RESQMAP_LAYOUT } from '@/lib/resqmap-design-tokens'

interface TickerEvent {
  id: string
  title: string
  color: string
  timestamp: string
}

export function LiveTicker() {
  const [events, setEvents] = useState<TickerEvent[]>([
    {
      id: '1',
      title: 'Building Collapse reported at Sector 5 - Rescue teams dispatched',
      color: RESQMAP_COLORS.critical,
      timestamp: '14:32',
    },
    {
      id: '2',
      title: 'SOS Alert escalated - 3 confirmations received',
      color: RESQMAP_COLORS.critical,
      timestamp: '14:28',
    },
    {
      id: '3',
      title: 'Medical unit responding to Ring Road accident',
      color: RESQMAP_COLORS.high,
      timestamp: '14:15',
    },
  ])

  const [displayIndex, setDisplayIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % events.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [events.length])

  return (
    <div
      style={{
        height: RESQMAP_LAYOUT.liveTickerHeight,
        backgroundColor: RESQMAP_COLORS.background,
        borderTop: `1px solid ${RESQMAP_COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '16px',
        overflow: 'hidden',
        zIndex: 30,
      }}
    >
      <div
        key={displayIndex}
        className="animate-slide-in-left flex items-center gap-2 text-xs"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: events[displayIndex]?.color || RESQMAP_COLORS.textSecondary,
            flexShrink: 0,
          }}
        />
        <span style={{ color: RESQMAP_COLORS.text, fontWeight: 500 }}>
          {events[displayIndex]?.timestamp}
        </span>
        <span style={{ color: RESQMAP_COLORS.textSecondary }}>
          {events[displayIndex]?.title}
        </span>
      </div>
    </div>
  )
}
