'use client'

import React, { useEffect, useState } from 'react'
import { Polyline, Popup, Marker, LayerGroup } from 'react-leaflet'
import { db, collection, onSnapshot, query } from '@/lib/firebase'
import { useMapStore } from '@/store/mapStore'
import L from 'leaflet'

export function EvacuationRoutesLayer() {
  const { overlays } = useMapStore()
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(() => {
    // 5. Build Order - Pre-defined evacuation routes from NDMA/FireStore
    if (!db || !collection) return;
    
    try {
      const q = query(collection(db, 'evacuation_routes'))
      return onSnapshot(q, (snapshot: any) => {
        setRoutes(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })))
      })
    } catch (e) {
      console.warn("EvacuationRoutesLayer: Firebase query failed", e);
    }
  }, [])

  if (!overlays.evacuationRoutes) return null

  return (
    <LayerGroup>
      {routes.map((route: any) => (
        <React.Fragment key={route.id}>
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: '#fbbf24', // Amber for evacuation
              weight: 5,
              opacity: 0.7,
              dashArray: '10, 15',
              lineCap: 'round',
              lineJoin: 'round'
            }}
          >
            <Popup className="evac-popup">
              <div className="p-2 bg-gray-900 text-white rounded">
                <h4 className="font-bold text-amber-500 mb-1 leading-tight">{route.name} — Evacuation Route</h4>
                <div className="text-[10px] text-gray-400 mb-2">From: {route.fromDistrict} To: {route.toDistrict}</div>
                <div className={`p-1 text-center rounded text-[10px] font-bold ${route.isSafe ? 'bg-green-600 text-white' : 'bg-red-600'}`}>
                  {route.isSafe ? 'OPEN / SAFE' : 'BLOCKED / DANGER'}
                </div>
              </div>
            </Popup>
          </Polyline>

          {/* Directional Arrows (Simple representation) */}
          {route.coordinates.length >= 2 && (
             <Marker
                position={route.coordinates[Math.floor(route.coordinates.length/2)]}
                icon={L.divIcon({
                  html: '<div class="text-amber-500 transform rotate-45"><i class="material-icons">arrow_upward</i></div>',
                  className: 'evac-arrow-icon'
                })}
             />
          )}
        </React.Fragment>
      ))}
    </LayerGroup>
  )
}
