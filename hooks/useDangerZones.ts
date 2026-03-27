'use client'

import { useState, useEffect, useCallback } from 'react'
import { RESQMAP_CONFIG } from '@/lib/resqmap-config'

export interface DangerZone {
  id: string
  name: string
  severity: keyof typeof RESQMAP_CONFIG.COLORS
  area: [number, number][] // polygon coordinates
  type: 'flood' | 'fire' | 'collapse' | 'hazmat' | 'blocked-road'
  createdAt: number
  updatedAt: number
  affectedCount: number
}

interface DangerZoneState {
  zones: DangerZone[]
  isLoading: boolean
  error: string | null
  lastRefresh: number | null
}

/**
 * Hook for managing danger zones heatmap
 */
export function useDangerZones() {
  const [state, setState] = useState<DangerZoneState>({
    zones: [],
    isLoading: false,
    error: null,
    lastRefresh: null,
  })

  // Fetch danger zones
  const fetchZones = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const res = await fetch('/api/danger-zones')
      if (!res.ok) throw new Error('Failed to fetch danger zones')
      
      const zones: DangerZone[] = await res.json()
      setState((prev) => ({
        ...prev,
        zones,
        lastRefresh: Date.now(),
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      }))
    }
  }, [])

  // Create/update danger zone
  const upsertZone = useCallback(async (zone: DangerZone) => {
    try {
      const res = await fetch('/api/danger-zones', {
        method: zone.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone),
      })

      if (!res.ok) throw new Error('Failed to save zone')
      
      const saved = await res.json()
      setState((prev) => ({
        ...prev,
        zones: zone.id
          ? prev.zones.map((z) => (z.id === zone.id ? saved : z))
          : [...prev.zones, saved],
      }))

      return saved
    } catch (err) {
      console.error('[v0] Upsert zone error:', err)
      throw err
    }
  }, [])

  // Delete danger zone
  const deleteZone = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/danger-zones/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete zone')

      setState((prev) => ({
        ...prev,
        zones: prev.zones.filter((z) => z.id !== id),
      }))
    } catch (err) {
      console.error('[v0] Delete zone error:', err)
      throw err
    }
  }, [])

  // Check if route intersects danger zone
  const checkRouteIntersection = useCallback(
    (routeCoords: [number, number][]): DangerZone[] => {
      return state.zones.filter((zone) => {
        // Simplified: check if any route point is in zone
        return routeCoords.some((coord) =>
          pointInPolygon(coord, zone.area)
        )
      })
    },
    [state.zones]
  )

  // Auto-refresh zones
  useEffect(() => {
    fetchZones() // Initial fetch
    const interval = setInterval(
      fetchZones,
      RESQMAP_CONFIG.CRON_INTERVALS.DANGER_ZONE_REFRESH
    )
    return () => clearInterval(interval)
  }, [fetchZones])

  return {
    ...state,
    fetchZones,
    upsertZone,
    deleteZone,
    checkRouteIntersection,
  }
}

/**
 * Check if point is inside polygon using ray casting
 */
function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }

  return inside
}
