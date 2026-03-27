'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useResqMapStore, Incident } from '@/lib/resqmap-store'
import { RESQMAP_COLORS } from '@/lib/resqmap-design-tokens'

export function ResqMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const { incidents, sosAlerts, selectedIncident, setSelectedIncident } = useResqMapStore()

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([28.7041, 77.1025], 10) // Default to India center

    // Add CartoDB Dark tile layer
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; CartoDB',
        maxZoom: 20,
      }
    ).addTo(map)

    mapInstanceRef.current = map

    // Add incident markers
    incidents.forEach((incident) => {
      const color =
        incident.severity === 'CRITICAL'
          ? RESQMAP_COLORS.critical
          : incident.severity === 'HIGH'
            ? RESQMAP_COLORS.high
            : incident.severity === 'MEDIUM'
              ? RESQMAP_COLORS.medium
              : RESQMAP_COLORS.low

      const marker = L.circleMarker([incident.lat, incident.lng], {
        radius: 8,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.7,
      })
        .bindPopup(`<strong>${incident.title}</strong><br/>${incident.location}`)
        .addTo(map)

      marker.on('click', () => {
        setSelectedIncident(incident)
      })
    })

    // Add SOS markers
    sosAlerts.forEach((alert) => {
      L.circleMarker([alert.coords[0], alert.coords[1]], {
        radius: 10,
        fillColor: RESQMAP_COLORS.critical,
        color: RESQMAP_COLORS.critical,
        weight: 3,
        opacity: 1,
        fillOpacity: 0.5,
        dashArray: '5, 5',
      })
        .bindPopup(`<strong>SOS Alert</strong><br/>Escalations: ${alert.escalationCount}`)
        .addTo(map)
    })

    return () => {
      // Cleanup is handled by map instance
    }
  }, [incidents, sosAlerts])

  // Pan to selected incident
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedIncident.lat, selectedIncident.lng],
        13,
        { animate: true }
      )

      // Highlight marker
      const layers = mapInstanceRef.current.getLayers()
      layers.forEach((layer: any) => {
        if (layer.setStyle) {
          layer.setStyle({
            weight: layer.getLatLng?.()?.lat === selectedIncident.lat ? 4 : 2,
          })
        }
      })
    }
  }, [selectedIncident])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: RESQMAP_COLORS.background,
      }}
      className="z-10"
    />
  )
}
