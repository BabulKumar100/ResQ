'use client'

import { useEffect, useState } from 'react'
import { LayerGroup, Marker, Popup, Circle, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { getAllIndiaDisasters, DisasterEvent } from '@/lib/indiaDisasterData'
import React from 'react'

export function NDMADisasterMarkers() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getAllIndiaDisasters()
      setDisasters(data)
    }
    load()
    const interval = setInterval(load, 300000)
    return () => clearInterval(interval)
  }, [])

  const getMarkerIcon = (type: string, severity: string) => {
    let iconName = 'warning'
    let color = '#ef4444' // red
    let animation = 'animate-ping'

    switch (type) {
      case 'flood': iconName = 'flood'; color = '#3b82f6'; break;
      case 'cyclone': iconName = 'cyclone'; color = '#6366f1'; animation = 'animate-spin-slow'; break;
      case 'earthquake': iconName = 'vibration'; color = '#f97316'; break;
      case 'landslide': iconName = 'landscape'; color = '#92400e'; break;
      case 'drought': iconName = 'water_off'; color = '#d97706'; break;
      case 'fire': iconName = 'local_fire_department'; color = '#ef4444'; break;
    }

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full ${animation}" style="background: ${color}20"></div>
          <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg" style="background: ${color}">
            <i class="material-icons text-white text-base">${iconName}</i>
          </div>
        </div>
        <style>
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        </style>
      `,
      className: 'ndma-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }

  return (
    <LayerGroup>
      {disasters.map((ev) => (
        <React.Fragment key={ev.id}>
           {/* Primary Marker */}
          <Marker position={[ev.latitude, ev.longitude]} icon={getMarkerIcon(ev.type, ev.severity)}>
            <Popup className="disaster-popup">
              <div className="p-3 bg-gray-950 text-white rounded-lg border border-gray-800 backdrop-blur shadow-2xl min-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase animate-pulse ${
                    ev.severity === 'critical' ? 'bg-red-600' : 'bg-orange-600'
                  }`}>
                    {ev.severity === 'critical' ? 'URGENT' : 'MONITORING'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{ev.source} OFFICIAL</span>
                </div>
                
                <h4 className="text-sm font-bold mb-1 leading-tight">{ev.title}</h4>
                <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">{ev.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                   <div className="bg-gray-900 rounded p-1.5 text-center flex flex-col items-center">
                       <span className="text-[8px] text-gray-500 font-bold tracking-widest">TYPE</span>
                       <span className="text-[10px] font-bold text-blue-400 capitalize">{ev.type}</span>
                   </div>
                   <div className="bg-gray-900 rounded p-1.5 text-center flex flex-col items-center">
                       <span className="text-[8px] text-gray-500 font-bold tracking-widest">PUBLISHED</span>
                       <span className="text-[9px] font-bold text-white uppercase">{new Date(ev.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                   </div>
                </div>

                <div className="space-y-1.5 border-t border-gray-800 pt-2 mb-3">
                   {ev.metadata?.magnitude && (
                     <div className="flex justify-between text-[9px]">
                        <span className="text-gray-500 uppercase tracking-widest">Magnitude:</span>
                        <span className="font-bold text-red-500">{ev.metadata.magnitude} SR</span>
                     </div>
                   )}
                   {ev.metadata?.category && (
                     <div className="flex justify-between text-[9px]">
                        <span className="text-gray-500 uppercase tracking-widest">Category:</span>
                        <span className="font-bold text-indigo-400">{ev.metadata.category}</span>
                     </div>
                   )}
                </div>

                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 rounded text-[9px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest">
                   Access NDRF Resources
                </button>
              </div>
            </Popup>
          </Marker>

          {/* Affected Area / Impact Circles */}
          <Circle
            center={[ev.latitude, ev.longitude]}
            radius={ev.type === 'cyclone' ? 150000 : ev.type === 'earthquake' ? 80000 : 10000}
            pathOptions={{
              color: ev.type === 'flood' ? '#3b82f6' : ev.type === 'cyclone' ? '#6366f1' : '#ef4444',
              fillOpacity: 0.08,
              weight: 1,
              dashArray: ev.type === 'cyclone' ? '10, 5' : '5, 8'
            }}
          />

          {/* Earthquake Inner P-Wave */}
          {ev.type === 'earthquake' && (
            <Circle
              center={[ev.latitude, ev.longitude]}
              radius={20000}
              pathOptions={{
                color: '#ef4444',
                fillOpacity: 0.15,
                weight: 2
              }}
            />
          )}

          {/* Cyclone Warning Concentric Rings */}
          {ev.type === 'cyclone' && (
            <>
              <Circle center={[ev.latitude, ev.longitude]} radius={50000} pathOptions={{ color:'#ef4444', fillOpacity:0.1, weight:2 }} />
              <Circle center={[ev.latitude, ev.longitude]} radius={100000} pathOptions={{ color:'#f97316', fillOpacity:0.05, weight:1.5, dashArray:'5,5' }} />
            </>
          )}
        </React.Fragment>
      ))}
    </LayerGroup>
  )
}
