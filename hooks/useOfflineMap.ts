'use client'

import { useState, useEffect, useCallback } from 'react'
import { RESQMAP_CONFIG } from '@/lib/resqmap-config'

interface CachedTile {
  z: number
  x: number
  y: number
  data: Blob
  timestamp: number
}

interface OfflineMapState {
  isCached: boolean
  lastSync: number | null
  cachedRegions: number
  isOnline: boolean
  syncQueue: any[]
}

/**
 * Hook for managing offline map tiles and local data sync
 */
export function useOfflineMap() {
  const [state, setState] = useState<OfflineMapState>({
    isCached: false,
    lastSync: null,
    cachedRegions: 0,
    isOnline: navigator.onLine,
    syncQueue: [],
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cache tiles for a region
  const cacheRegion = useCallback(async (bounds: L.LatLngBounds) => {
    try {
      const db = await openIndexedDB()
      const tx = db.transaction(['tiles'], 'readwrite')
      const store = tx.objectStore('tiles')

      // Simplified: just mark region as cached
      const region = {
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        },
        timestamp: Date.now(),
      }

      const request = store.add({ region, type: 'region-cache' })
      await new Promise((resolve, reject) => {
        request.onsuccess = resolve
        request.onerror = () => reject(request.error)
      })
      setState((prev) => ({
        ...prev,
        cachedRegions: prev.cachedRegions + 1,
      }))
    } catch (err) {
      console.error('[v0] Cache region error:', err)
    }
  }, [])

  // Sync queued data when connection restored
  const syncData = useCallback(async () => {
    if (!state.isOnline || state.syncQueue.length === 0) return

    try {
      const db = await openIndexedDB()
      const tx = db.transaction(['syncQueue'], 'readwrite')
      const store = tx.objectStore('syncQueue')
      const getAllReq = store.getAll()
      const items = await new Promise<any[]>((resolve, reject) => {
        getAllReq.onsuccess = () => resolve(getAllReq.result)
        getAllReq.onerror = () => reject(getAllReq.error)
      })

      for (const item of items) {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
        const deleteReq = store.delete(item.id)
        await new Promise((resolve, reject) => {
          deleteReq.onsuccess = resolve
          deleteReq.onerror = () => reject(deleteReq.error)
        })
      }

      setState((prev) => ({
        ...prev,
        lastSync: Date.now(),
        syncQueue: [],
      }))
    } catch (err) {
      console.error('[v0] Sync error:', err)
    }
  }, [state.isOnline, state.syncQueue])

  // Retry sync when reconnected
  useEffect(() => {
    if (state.isOnline) {
      syncData()
    }
  }, [state.isOnline, syncData])

  return {
    ...state,
    cacheRegion,
    syncData,
  }
}

async function openIndexedDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open('resqmap-offline', 1)
    
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('tiles')) {
        db.createObjectStore('tiles', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}
