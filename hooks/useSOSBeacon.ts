'use client'

import { useState, useCallback, useEffect } from 'react'
import { RESQMAP_CONFIG } from '@/lib/resqmap-config'

interface SOSBeacon {
  id: string
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  severity: 'critical' | 'high' | 'medium'
  description: string
  responders: string[]
  status: 'active' | 'escalated' | 'resolved'
}

/**
 * Hook for managing SOS beacon broadcasts
 * Handles one-tap SOS with auto-escalation
 */
export function useSOSBeacon() {
  const [beacon, setBeacon] = useState<SOSBeacon | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [escalatedAt, setEscalatedAt] = useState<number | null>(null)

  // Activate SOS beacon
  const activateBeacon = useCallback(async (description?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        )
      })

      const newBeacon: SOSBeacon = {
        id: `sos-${Date.now()}`,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        timestamp: Date.now(),
        severity: 'critical',
        description: description || 'Emergency SOS activated',
        responders: [],
        status: 'active',
      }

      setBeacon(newBeacon)
      setEscalatedAt(null)

      // Auto-escalation check after timeout
      setTimeout(() => {
        if (beacon?.status === 'active' && beacon.responders.length === 0) {
          setBeacon((prev) =>
            prev ? { ...prev, status: 'escalated' } : null
          )
          setEscalatedAt(Date.now())
        }
      }, RESQMAP_CONFIG.SOS.ESCALATION_TIMEOUT)

      // Broadcast via WebSocket/API
      await fetch('/api/sos-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBeacon),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate SOS')
    } finally {
      setIsLoading(false)
    }
  }, [beacon])

  // Deactivate beacon
  const deactivateBeacon = useCallback(() => {
    if (beacon) {
      setBeacon({ ...beacon, status: 'resolved' })
      
      // Notify backend
      fetch(`/api/sos-alerts/${beacon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      }).catch(console.error)
    }
  }, [beacon])

  return {
    beacon,
    isLoading,
    error,
    isEscalated: beacon?.status === 'escalated',
    escalatedAt,
    activateBeacon,
    deactivateBeacon,
  }
}
