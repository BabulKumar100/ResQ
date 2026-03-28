'use client'

import { useEffect, useState } from 'react'
import { LayerGroup, Marker, Popup, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import { fetchIMDAlerts, DisasterEvent } from '@/lib/indiaDisasterData'

export function IMDCycloneMarkers() {
  const [cyclones, setCyclones] = useState<DisasterEvent[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchIMDAlerts()
      setCyclones(data.filter(d => d.type === 'cyclone'))
    }
    load()
    const interval = setInterval(load, 300000) // 5 min sync
    return () => clearInterval(interval)
  }, [])

  const cycloneIcon = L.divIcon({
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-20 h-20 bg-red-500/5 rounded-full animate-ping"></div>
             <div class="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg bg-red-600 animate-spin" style="animation-duration: 3s">
               <i class="material-icons text-white text-lg">cyclone</i>
             </div>
           </div>`,
    className: 'cyclone-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })

  return (
    <LayerGroup>
      {cyclones.map((cy) => (
        <React.Fragment key={cy.id}>
          <Marker position={[cy.latitude, cy.longitude]} icon={cycloneIcon}>
            <Popup className="disaster-popup">
              <div className="p-3 bg-gray-950 text-white rounded-lg border border-red-500/30 backdrop-blur shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-red-600 rounded text-[9px] font-bold tracking-widest uppercase animate-pulse">CYCLONE WARNING</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">IMD • INDIA</span>
                </div>
                <h4 className="text-sm font-bold mb-1 leading-tight">{cy.title}</h4>
                <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-relaxed">{cy.description}</p>
                
                <div className="flex flex-col gap-1 border-t border-gray-800 pt-2 text-[9px] font-bold mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest">Alert Level:</span>
                    <span className="text-red-500 uppercase">RED ALERT (CRITICAL)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                   <div className="bg-gray-900 rounded p-1.5 text-center flex flex-col items-center">
                       <span className="text-[8px] text-gray-500 font-bold tracking-widest">WIND SPEED</span>
                       <span className="text-xs font-bold text-white">125 KMPH</span>
                   </div>
                   <div className="bg-gray-900 rounded p-1.5 text-center flex flex-col items-center">
                       <span className="text-[8px] text-gray-500 font-bold tracking-widest">CATEGORY</span>
                       <span className="text-xs font-bold text-white">VERY SEVERE</span>
                   </div>
                </div>

                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white border border-red-500/30 rounded text-[9px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest">
                   IMD Coastal Advisory Bulletin
                </button>
              </div>
            </Popup>
          </Marker>

          {/* Wind Radius Visualization */}
          <Circle
            center={[cy.latitude, cy.longitude]}
            radius={150000} // Dynamic radius for wind field
            pathOptions={{
              color: '#ef4444',
              fillOpacity: 0.05,
              weight: 1,
              dashArray: '10, 20'
            }}
          />
        </React.Fragment>
      ))}
    </LayerGroup>
  )
}
import React from 'react'
