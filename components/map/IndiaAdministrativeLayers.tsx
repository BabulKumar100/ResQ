'use client'

import { useEffect, useState } from 'react'
import { useMap, GeoJSON, WMSTileLayer, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMapStore } from '@/store/mapStore'

const INDIA_STATES_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson'
const INDIA_DISTRICTS_URL = 'https://raw.githubusercontent.com/datameet/maps/master/Districts/india-districts.geojson'

export function IndiaAdministrativeLayers() {
  const map = useMap()
  const { overlays } = useMapStore()
  const [statesData, setStatesData] = useState<any>(null)
  const [districtsData, setDistrictsData] = useState<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)

  useEffect(() => {
    fetch(INDIA_STATES_URL).then(res => res.json()).then(setStatesData)
    fetch(INDIA_DISTRICTS_URL).then(res => res.json()).then(setDistrictsData)
  }, [])

  const stateStyle = (feature: any) => ({
    fillColor: '#3b82f6',
    weight: 1.5,
    opacity: 0.8,
    color: '#ffffff',
    fillOpacity: 0.05
  })

  // Mock alert levels for districts for visual demonstration
  const getAlertColor = (district: string) => {
    const sum = district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    if (sum % 20 === 0) return '#ef4444' // Red - Active Disaster
    if (sum % 15 === 0) return '#f97316' // Orange - Warning
    if (sum % 10 === 0) return '#eab308' // Yellow - Watch
    return 'transparent'
  }

  const districtStyle = (feature: any) => {
    const alertColor = getAlertColor(feature.properties.NAME || feature.properties.district || '')
    return {
      fillColor: alertColor,
      weight: 0.5,
      opacity: 0.5,
      color: '#64748b',
      fillOpacity: alertColor === 'transparent' ? 0 : 0.25
    }
  }

  const onDistrictClick = (e: any, feature: any) => {
    const props = feature.properties
    setSelectedDistrict({
      name: props.NAME || props.district,
      state: props.STATE || props.state,
      latlng: e.latlng,
      alert: getAlertColor(props.NAME || props.district)
    })
    map.flyTo(e.latlng, 8)
  }

  return (
    <>
      {statesData && (
        <GeoJSON 
          data={statesData} 
          style={stateStyle}
          eventHandlers={{
            mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.15, weight: 2 }) },
            mouseout: (e) => { e.target.setStyle({ fillOpacity: 0.05, weight: 1.5 }) },
            click: (e) => map.fitBounds(e.target.getBounds())
          }}
        />
      )}

      {districtsData && map.getZoom() > 6 && (
        <GeoJSON 
          data={districtsData} 
          style={districtStyle}
          eventHandlers={{
            click: (e) => onDistrictClick(e, e.target.feature)
          }}
        />
      )}

      {selectedDistrict && (
        <Popup position={selectedDistrict.latlng} eventHandlers={{ remove: () => setSelectedDistrict(null) }}>
          <div className="p-3 bg-gray-950 text-white rounded-lg border border-gray-800 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                selectedDistrict.alert === '#ef4444' ? 'bg-red-600' :
                selectedDistrict.alert === '#f97316' ? 'bg-orange-600' :
                selectedDistrict.alert === '#eab308' ? 'bg-yellow-600' : 'bg-gray-600'
              }`}>
                {selectedDistrict.alert === '#ef4444' ? 'Critical Alert' :
                 selectedDistrict.alert === '#f97316' ? 'Warning Issued' :
                 selectedDistrict.alert === '#eab308' ? 'Under Watch' : 'Normal State'}
              </span>
            </div>
            <h4 className="text-sm font-bold">{selectedDistrict.name}</h4>
            <p className="text-[10px] text-gray-400 mb-2">{selectedDistrict.state}, India</p>
            
            <div className="space-y-1.5 border-t border-gray-800 pt-2 mb-3">
               <div className="flex justify-between text-[9px]">
                  <span className="text-gray-500">Active Incidents:</span>
                  <span className="font-bold">2 Reports</span>
               </div>
               <div className="flex justify-between text-[9px]">
                  <span className="text-gray-500">Nearest Rescue:</span>
                  <span className="font-bold">4.2 km</span>
               </div>
            </div>

            <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-bold transition">
               View Full NDMA Report
            </button>
          </div>
        </Popup>
      )}

      {/* ISRO Bhuvan WMS Overlays */}
      {overlays.bhuvanFlood && (
        <WMSTileLayer
          url="https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms"
          layers="INDIA_FLOOD_INUNDATION"
          params={{
            layers: 'INDIA_FLOOD_INUNDATION',
            format: 'image/png',
            transparent: true,
            version: '1.1.1'
          }}
          opacity={0.6}
          attribution="ISRO Bhuvan"
        />
      )}

      {overlays.bhuvanLandslide && (
        <WMSTileLayer
          url="https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms"
          layers="LANDSLIDE_ZONES"
          params={{
            layers: 'LANDSLIDE_ZONES',
            format: 'image/png',
            transparent: true,
            version: '1.1.1'
          }}
          opacity={0.6}
          attribution="ISRO Bhuvan"
        />
      )}

      {overlays.bhuvanDrought && (
        <WMSTileLayer
          url="https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms"
          layers="DROUGHT_ZONES"
          params={{
            layers: 'DROUGHT_ZONES',
            format: 'image/png',
            transparent: true,
            version: '1.1.1'
          }}
          opacity={0.6}
          attribution="ISRO Bhuvan"
        />
      )}
    </>
  )
}
