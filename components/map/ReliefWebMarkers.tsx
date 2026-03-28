'use client'

import { useEffect, useState } from 'react'
import { LayerGroup, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { fetchReliefWebIndia, DisasterEvent } from '@/lib/indiaDisasterData'

export function ReliefWebMarkers() {
  const [reliefEvents, setReliefEvents] = useState<DisasterEvent[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchReliefWebIndia()
      setReliefEvents(data)
    }
    load()
    const interval = setInterval(load, 600000) // 10 min sync
    return () => clearInterval(interval)
  }, [])

  const reliefIcon = (event: DisasterEvent) => {
    return L.divIcon({
      html: `<div class="relative flex items-center justify-center">
               <div class="absolute w-10 h-10 bg-orange-500/10 rounded-full animate-pulse"></div>
               <div class="w-6 h-6 rounded-lg bg-orange-600 border border-white flex items-center justify-center shadow-lg hover:scale-120 transition">
                 <i class="material-icons text-white text-[10px]">campaign</i>
               </div>
             </div>`,
      className: 'reliefweb-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  return (
    <LayerGroup>
      {reliefEvents.map((ev) => (
        <Marker key={ev.id} position={[ev.latitude, ev.longitude]} icon={reliefIcon(ev)}>
          <Popup className="disaster-popup custom-leaflet-popup">
            <div className="p-3 bg-gray-950 text-white rounded-lg border border-gray-800 backdrop-blur shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-orange-600 rounded text-[9px] font-bold tracking-widest uppercase">Ongoing Crisis</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">ReliefWeb • GLOBAL FEED</span>
              </div>
              <h4 className="text-sm font-bold mb-1 leading-tight">{ev.title}</h4>
              <p className="text-[10px] text-gray-400 mb-3 line-clamp-2 leading-relaxed">{ev.description}</p>
              
              <div className="flex flex-col gap-1 border-t border-gray-800 pt-2 text-[9px] font-bold mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Alert Status:</span>
                  <span className="text-orange-500 uppercase">{ev.severity.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Synced:</span>
                  <span>{new Date(ev.timestamp).toLocaleTimeString()} IST</span>
                </div>
              </div>

              <button className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded text-[9px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                View Full Relief Report
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  )
}
