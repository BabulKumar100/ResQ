'use client'

import React from 'react'
import { Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { DisasterEvent } from '@/lib/indiaDisasterData'
import { formatDistanceToNow } from 'date-fns'

const getDisasterIcon = (type: string, severity: string) => {
  const iconHtml = (color: string, iconClass: string) => `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-${color}-500/20 rounded-full animate-ping"></div>
      <div class="w-8 h-8 bg-${color}-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg transform transition hover:scale-125">
        <i class="material-icons text-white text-base">${iconClass === 'cyclone' ? 'cyclone' : 
                                                        iconClass === 'fire' ? 'local_fire_department' : 
                                                        iconClass === 'flood' ? 'flood' : 
                                                        iconClass === 'earthquake' ? 'waves' : 'warning'}</i>
      </div>
    </div>
  `
  let color = 'red'
  if (severity === 'high') color = 'orange'
  if (severity === 'medium') color = 'yellow'
  if (severity === 'low') color = 'blue'

  const iconMapping: any = {
    flood: 'flood',
    cyclone: 'cyclone',
    earthquake: 'waves',
    fire: 'local_fire_department',
    landslide: 'terrain',
    drought: 'water_off'
  }

  return L.divIcon({
    className: 'custom-disaster-icon',
    html: iconHtml(color, iconMapping[type] || 'warning'),
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

export function DisasterMarker({ event }: { event: DisasterEvent }) {
  const icon = getDisasterIcon(event.type, event.severity)
  
  return (
    <>
      <Marker position={[event.latitude, event.longitude]} icon={icon}>
        <Popup className="disaster-popup custom-leaflet-popup">
          <div className="p-2 min-w-[200px] bg-gray-900 text-white rounded-lg">
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2 ${
              event.severity === 'critical' ? 'text-red-500' : 
              event.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
            }`}>
              <span className={`w-2 h-2 rounded-full bg-current animate-pulse`} />
              {event.source} | {event.type}
            </div>
            <h3 className="text-sm font-bold mb-1 leading-tight">{event.title}</h3>
            <p className="text-[10px] text-gray-400 mb-3 line-clamp-3">{event.description}</p>
            
            <div className="flex flex-col gap-1 border-t border-gray-800 pt-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Alert Level:</span>
                <span className="font-bold">{event.severity.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reported:</span>
                <span>{formatDistanceToNow(new Date(event.timestamp))} ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Center:</span>
                <span>{event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</span>
              </div>
            </div>

            <button className="w-full mt-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-[10px] font-bold transition flex items-center justify-center gap-1">
              Active Protocol — View Advisory
            </button>
          </div>
        </Popup>
      </Marker>
      
      {/* Affected Area Visualization */}
      {event.radius && (
        <Circle
          center={[event.latitude, event.longitude]}
          radius={event.radius * 1000}
          pathOptions={{
            color: event.type === 'flood' ? '#3b82f6' : 
                   event.type === 'cyclone' ? '#ef4444' : 
                   event.type === 'fire' ? '#f97316' : '#64748b',
            fillColor: event.type === 'flood' ? '#3b82f6' : '#ef4444',
            fillOpacity: 0.1,
            dashArray: '5, 10'
          }}
        />
      )}
    </>
  )
}
