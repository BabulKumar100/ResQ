'use client'

import React, { useEffect, useState } from 'react'
import { useResqMapStore } from '@/lib/resqmap-store'
import { RESQMAP_COLORS, RESQMAP_LAYOUT } from '@/lib/resqmap-design-tokens'
import { Radio, Settings, Bell, LogOut } from 'lucide-react'

export function TopBar() {
  const {
    getActiveIncidentsCount,
    getActiveSosCount,
    getOnlineRescuersCount,
    isOnline,
  } = useResqMapStore()

  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const activeIncidents = getActiveIncidentsCount()
  const activeSOS = getActiveSosCount()
  const onlineRescuers = getOnlineRescuersCount()

  return (
    <div
      style={{
        height: RESQMAP_LAYOUT.topBarHeight,
        backgroundColor: RESQMAP_COLORS.background,
        borderBottom: `1px solid ${RESQMAP_COLORS.border}`,
        zIndex: 50,
      }}
      className="flex items-center justify-between px-6"
    >
      {/* Left: Logo + Live Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RESQMAPKO-eZTYR9rGICNQYmYDMiprTziSIHPNWv.jpeg"
            alt="ResQMap"
            className="h-8 w-auto"
          />
          <span
            style={{ color: RESQMAP_COLORS.textMuted }}
            className="text-xs font-mono"
          >
            v1.0
          </span>
        </div>

        {/* Live Indicator */}
        <div className="ml-4 flex items-center gap-1.5">
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isOnline
                ? RESQMAP_COLORS.low
                : RESQMAP_COLORS.critical,
              animation: isOnline ? 'pulse 2s infinite' : 'none',
            }}
          />
          <span style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs font-medium">
            {isOnline ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Center: Stat Pills */}
      <div className="flex items-center gap-3">
        {/* Active Incidents */}
        <div
          style={{
            backgroundColor: RESQMAP_COLORS.surface,
            border: `1px solid ${RESQMAP_COLORS.critical}`,
            padding: '6px 12px',
            borderRadius: '4px',
          }}
          className="flex items-center gap-2"
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: RESQMAP_COLORS.critical,
            }}
          />
          <span style={{ color: RESQMAP_COLORS.text }} className="text-xs font-semibold">
            {activeIncidents}
          </span>
          <span style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
            Active
          </span>
        </div>

        {/* SOS Count */}
        <div
          style={{
            backgroundColor: RESQMAP_COLORS.surface,
            border: `1px solid ${RESQMAP_COLORS.high}`,
            padding: '6px 12px',
            borderRadius: '4px',
          }}
          className="flex items-center gap-2"
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: RESQMAP_COLORS.high,
            }}
          />
          <span style={{ color: RESQMAP_COLORS.text }} className="text-xs font-semibold">
            {activeSOS}
          </span>
          <span style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
            SOS
          </span>
        </div>

        {/* Units Online */}
        <div
          style={{
            backgroundColor: RESQMAP_COLORS.surface,
            border: `1px solid ${RESQMAP_COLORS.low}`,
            padding: '6px 12px',
            borderRadius: '4px',
          }}
          className="flex items-center gap-2"
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: RESQMAP_COLORS.low,
            }}
          />
          <span style={{ color: RESQMAP_COLORS.text }} className="text-xs font-semibold">
            {onlineRescuers}
          </span>
          <span style={{ color: RESQMAP_COLORS.textSecondary }} className="text-xs">
            Units
          </span>
        </div>
      </div>

      {/* Right: Clock + Status + User */}
      <div className="flex items-center gap-4">
        {/* Clock */}
        <div style={{ color: RESQMAP_COLORS.text }} className="font-mono text-sm">
          {currentTime}
        </div>

        {/* Notification Bell */}
        <button
          className="p-2 hover:bg-gray-800 rounded transition"
          style={{
            backgroundColor: 'transparent',
            color: RESQMAP_COLORS.textSecondary,
          }}
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          className="p-2 hover:bg-gray-800 rounded transition"
          style={{
            backgroundColor: 'transparent',
            color: RESQMAP_COLORS.textSecondary,
          }}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: RESQMAP_COLORS.accentBlue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: RESQMAP_COLORS.background,
          }}
        >
          ED
        </div>
      </div>
    </div>
  )
}
