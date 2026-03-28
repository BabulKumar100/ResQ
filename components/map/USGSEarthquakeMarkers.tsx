'use client'

import { useEffect, useState } from 'react'
import { LayerGroup, Circle, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { fetchUSGSEarthquakes, DisasterEvent } from '@/lib/indiaDisasterData'

export function USGSEarthquakeMarkers() {
  const [earthquakes, setEarthquakes] = useState<DisasterEvent[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchUSGSEarthquakes()
      setEarthquakes(data)
    }
    load()
    const interval = setInterval(load, 300000) // 5 min sync
    return () => clearInterval(interval)
  }, [])

  const getSeismoIcon = (mag: number) => {
    const color = mag > 6 ? '#ef4444' : mag > 5 ? '#f97316' : '#eab308'
    return L.divIcon({
      html: `<div class="relative flex items-center justify-center">
               <div class="absolute w-12 h-12 bg-red-500/10 rounded-full animate-ping"></div>
               <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-xl" style="background: ${color}">
                 <i class="material-icons text-white text-sm">waves</i>
               </div>
             </div>`,
      className: 'earthquake-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }

  return (
    <LayerGroup>
      {earthquakes.map((eq) => (
        <React.Fragment key={eq.id}>
          <Marker position={[eq.latitude, eq.longitude]} icon={getSeismoIcon(eq.metadata?.magnitude || 0)}>
            <Popup className="disaster-popup">
              <div className="p-3 bg-gray-950 text-white rounded-lg border border-gray-800 backdrop-blur shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    eq.metadata?.magnitude > 6 ? 'bg-red-600' : 'bg-orange-600'
                  }`}>
                    M{eq.metadata?.magnitude.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">USGS • INDIA REGION</span>
                </div>
                <h4 className="text-sm font-bold mb-1 leading-tight">{eq.title}</h4>
                <div className="text-[10px] text-gray-400 mb-3 font-medium">Depth: {eq.metadata?.depth}km • {new Date(eq.timestamp).toLocaleString()}</div>
                <button className="w-full py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded text-[10px] font-bold transition-all">
                  View Source Archive
                </button>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={[eq.latitude, eq.longitude]}
            radius={(eq.metadata?.magnitude || 0) * 8000}
            pathOptions={{
              color: eq.metadata?.magnitude > 6 ? '#ef4444' : '#f97316',
              fillOpacity: 0.1,
              weight: 1,
              dashArray: '5, 8'
            }}
          />
        </React.Fragment>
      ))}
    </LayerGroup>
  )
}
import React from 'react'
