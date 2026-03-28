'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/store/mapStore';
import { IndiaAdministrativeLayers } from './IndiaAdministrativeLayers';
import { NDMADisasterMarkers } from './NDMADisasterMarkers';
import { EvacuationRoutesLayer } from './EvacuationRoutesLayer';
import { setupTileCaching } from '@/lib/tile-cache';
import { calculateSafeRoute } from '@/lib/routing-utils';

// Helper component to handle map events and store updates
function MapEventsHandler() {
  const { setMouseLatLng, setFlyToTarget, flyToTarget, center, zoom, routeOrigin, routeDestination, setActiveRoutes, dangerZones } = useMapStore();
  const map = useMap();

  useMapEvents({
    mousemove(e) {
      setMouseLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    contextmenu(e) {
      // Right-click menu implementation
       L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div class="p-2 bg-gray-950 text-white rounded border border-gray-800 text-[10px] font-bold">
            <button class="w-full text-left py-1.5 hover:text-blue-400 border-b border-gray-900" id="set-origin">SET AS ORIGIN</button>
            <button class="w-full text-left py-1.5 hover:text-green-400" id="set-dest">SET AS DESTINATION</button>
          </div>
        `)
        .openOn(map);
      
      setTimeout(() => {
        document.getElementById('set-origin')?.addEventListener('click', () => {
          useMapStore.getState().setRoutePoints([e.latlng.lat, e.latlng.lng], routeDestination);
          map.closePopup();
        });
        document.getElementById('set-dest')?.addEventListener('click', () => {
          useMapStore.getState().setRoutePoints(routeOrigin, [e.latlng.lat, e.latlng.lng]);
          map.closePopup();
        });
      }, 100);
    }
  });

  useEffect(() => {
    if (flyToTarget) {
      map.flyTo(flyToTarget, 12, { animate: true, duration: 1.5 });
      setFlyToTarget(null);
    }
  }, [flyToTarget, map, setFlyToTarget]);

  // Handle Route Calculation when points change
  useEffect(() => {
    if (routeOrigin && routeDestination) {
      calculateSafeRoute(routeOrigin, routeDestination, dangerZones).then(routes => {
        setActiveRoutes(routes);
      });
    }
  }, [routeOrigin, routeDestination, dangerZones, setActiveRoutes]);

  return null;
}

// Tile Layer with Caching Support
function OfflineTileLayer() {
  const map = useMap();
  useEffect(() => {
    setupTileCaching(map);
  }, [map]);
  return null;
}

export default function TacticalMap() {
  const { center, zoom, activeRoutes } = useMapStore();

  return (
    <div className="w-full h-full relative bg-[#070d1a]">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <OfflineTileLayer />
        <ZoomControl position="bottomright" />
        
        <IndiaAdministrativeLayers />
        <NDMADisasterMarkers />
        <EvacuationRoutesLayer />
        
        {/* Render Active Routes */}
        {activeRoutes.map((route, idx) => (
          <RoutePolyline key={idx} route={route} />
        ))}

        <MapEventsHandler />
      </MapContainer>

      {/* Map UI Overlays */}
      <div className="absolute bottom-12 left-6 z-[1000] pointer-events-none">
         <div className="p-3 bg-gray-950/90 border border-gray-800 rounded-xl backdrop-blur shadow-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 font-mono text-[9px] font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Strategic India Overlay Active
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-white">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> FLOOD ZONE
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-spin" /> CYCLONE TRACK
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600" /> EARTHQUAKE
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> EVAC ROUTE
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .leaflet-container { background: #070d1a !important; cursor: crosshair !important; }
        .disaster-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding:0; border:none; }
        .disaster-popup .leaflet-popup-tip-container { display: none; }
        .ndma-marker { border:none !important; background:none !important; }
      `}</style>
    </div>
  );
}

import { Polyline } from 'react-leaflet';
function RoutePolyline({ route }: { route: any }) {
  const color = route.type === 'safe' ? '#10b981' : route.type === 'caution' ? '#f59e0b' : '#ef4444';
  const dash = route.type === 'safe' ? '' : route.type === 'caution' ? '10, 10' : '5, 10';
  
  return (
    <Polyline
      positions={route.coordinates}
      pathOptions={{
        color,
        weight: 5,
        opacity: 0.8,
        dashArray: dash,
        lineCap: 'round',
        lineJoin: 'round'
      }}
    />
  );
}
