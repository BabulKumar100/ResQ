'use client';

import { useEffect, useRef, useState } from 'react';

interface Marker {
  position: [number, number];
  title: string;
  type: 'emergency' | 'resource' | 'default' | 'drone';
  description?: string;
  severity?: string;
  id?: string;
}

interface TacticalMapProps {
  center: [number, number];
  zoom?: number;
  markers?: Marker[];
  activeOverlays?: { thermal: boolean; structural: boolean; population: boolean; hazard: boolean };
  onMouseMove?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: Marker) => void;
  flyTo?: [number, number] | null;
}

export default function TacticalMap({ center, zoom = 13, markers = [], activeOverlays, onMouseMove, onMarkerClick, flyTo }: TacticalMapProps) {
  const mapRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const hazardLayersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    import('leaflet').then(L => {
      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: '/leaflet/marker-icon.png',
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      const container = document.getElementById('tactical-map-container');
      if (!container || (container as any)._leaflet_id) return;

      const map = L.map('tactical-map-container', {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark tiles — no API key needed
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Zoom control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Mouse move for lat/lng readout
      map.on('mousemove', (e: any) => {
        if (onMouseMove) onMouseMove(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add markers when data arrives
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const L = require('leaflet');

    // Clear existing non-tile layers (markers)
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        mapRef.current.removeLayer(layer);
      }
    });

    markers.forEach((marker) => {
      const isCritical = marker.severity === 'critical';
      const isHigh = marker.severity === 'high';

      let iconHtml = '';
      if (marker.type === 'emergency') {
        iconHtml = `
          <div style="position:relative;width:28px;height:28px;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:${isCritical ? '#ef4444' : isHigh ? '#f97316' : '#eab308'};
              opacity:0.3;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
            "></div>
            <div style="
              position:absolute;inset:4px;border-radius:50%;
              background:${isCritical ? '#ef4444' : isHigh ? '#f97316' : '#eab308'};
              box-shadow:0 0 10px ${isCritical ? '#ef4444' : '#f97316'};
            "></div>
          </div>`;
      } else if (marker.type === 'resource' || marker.type === 'drone') {
        iconHtml = `<div style="width:16px;height:16px;border-radius:50%;background:#41ddc2;box-shadow:0 0 8px #41ddc2;border:2px solid rgba(65,221,194,0.4);"></div>`;
      } else {
        iconHtml = `<div style="width:14px;height:14px;border-radius:50%;background:#6366f1;box-shadow:0 0 6px #6366f1;"></div>`;
      }

      const icon = L.divIcon({
        html: `<style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>${iconHtml}`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const m = L.marker(marker.position, { icon }).addTo(mapRef.current);

      // Popup
      const popupHtml = `
        <div style="background:#111318;border:1px solid #41ddc2/30;border-radius:8px;padding:12px;min-width:180px;font-family:monospace;">
          <div style="color:${isCritical ? '#ef4444' : '#41ddc2'};font-size:10px;font-weight:bold;letter-spacing:0.1em;margin-bottom:6px;">
            ${marker.type.toUpperCase()} · ${marker.severity?.toUpperCase() || 'INFO'}
          </div>
          <div style="color:#ffffff;font-size:13px;font-weight:bold;margin-bottom:4px;">${marker.title}</div>
          <div style="color:#9ca3af;font-size:11px;">${marker.description || ''}</div>
        </div>`;
      m.bindPopup(popupHtml, { className: 'tactical-popup' });

      m.on('click', () => { if (onMarkerClick) onMarkerClick(marker); });
    });
  }, [markers, mapReady]);

  // Fly to target
  useEffect(() => {
    if (!mapReady || !mapRef.current || !flyTo) return;
    mapRef.current.flyTo(flyTo, 16, { animate: true, duration: 1.5 });
  }, [flyTo, mapReady]);

  // Overlays
  useEffect(() => {
    if (!mapReady || !mapRef.current || !activeOverlays) return;
    const L = require('leaflet');

    // Remove existing hazard circles
    hazardLayersRef.current.forEach(l => mapRef.current.removeLayer(l));
    hazardLayersRef.current = [];

    if (activeOverlays.hazard) {
      markers.filter(m => m.type === 'emergency').forEach(m => {
        const circle = L.circle(m.position, {
          radius: 500,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.08,
          weight: 1,
        }).addTo(mapRef.current);
        hazardLayersRef.current.push(circle);
      });
    }

    if (activeOverlays.structural) {
      const structCircle = L.circle([center[0] + 0.005, center[1] - 0.005], {
        radius: 300,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '6 4',
      }).addTo(mapRef.current);
      hazardLayersRef.current.push(structCircle);
    }
  }, [activeOverlays, mapReady, markers]);

  return (
    <>
      <style>{`
        .tactical-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border: none !important;
        }
        .tactical-popup .leaflet-popup-tip-container { display: none; }
        .leaflet-container { background: #070d1a !important; }
      `}</style>
      <div id="tactical-map-container" className="w-full h-full" />
    </>
  );
}
