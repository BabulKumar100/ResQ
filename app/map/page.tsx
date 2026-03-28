'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useRealtimeIncidents, useRealtimeRescuers } from '@/lib/useRealtime';
import { useMapStore } from '@/store/mapStore';
import { formatDistanceToNow } from 'date-fns';

const TacticalMap = dynamic(() => import('@/components/map/TacticalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#070d1a] flex flex-col items-center justify-center gap-3 text-[#41ddc2]/50">
      <Loader2 className="animate-spin w-8 h-8" />
      <span className="text-xs font-mono tracking-widest animate-pulse">INITIALIZING TACTICAL MAP...</span>
    </div>
  ),
});

export default function EmergencyMapPage() {
  const { incidents } = useRealtimeIncidents();
  const { rescuers } = useRealtimeRescuers();
  const { overlays, toggleOverlay, flyToTarget, setFlyToTarget, setMouseLatLng, mouseLatLng } = useMapStore();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [dispatchLoading, setDispatchLoading] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const criticalIncidents = incidents.filter(i => i.severity === 'critical');
  const activeIncident = selectedIncident || criticalIncidents[0] || incidents[0] || null;

  const markers = [
    ...incidents.map(i => ({
      position: [i.lat || 34.0522, i.lng || -118.2437] as [number, number],
      title: (i.title || i.type || 'Unknown').toUpperCase(),
      type: 'emergency' as const,
      description: i.description || i.address || '',
      severity: i.severity,
      id: i.id,
    })),
    ...rescuers.map(r => ({
      position: [r.lat || 34.0, r.lng || -118.2] as [number, number],
      title: r.name,
      type: 'resource' as const,
      description: `${r.agency} · ${r.status?.toUpperCase()} · 🔋${r.fuelPct}%`,
      severity: undefined,
      id: r.id,
    })),
  ];

  const handleDispatch = async () => {
    if (!activeIncident) return;
    setDispatchLoading(true);
    await fetch('/api/db/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...activeIncident, status: 'dispatched' })
    });
    await fetch('/api/db/live_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DISPATCH', message: `Units dispatched to ${activeIncident.type} @ ${activeIncident.address}`, severity: 'info', locationName: activeIncident.address })
    });
    showToast(`🚁 Units dispatched to ${activeIncident.type?.toUpperCase()}`);
    setDispatchLoading(false);
  };

  const handleEvacuate = async () => {
    if (!activeIncident) return;
    await fetch('/api/db/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...activeIncident, evacuationOrdered: true })
    });
    showToast(`🚨 EVACUATION ORDER issued for ${activeIncident.address}`);
  };

  const overlayConfig = [
    { key: 'thermal' as const, label: 'THERMAL IMAGING', icon: 'thermostat', color: 'text-red-400', desc: 'Active heat signatures detector' },
    { key: 'structural' as const, label: 'STRUCTURAL DAMAGE', icon: 'domain_disabled', color: 'text-orange-400', desc: 'Building integrity zones' },
    { key: 'population' as const, label: 'POPULATION DENSITY', icon: 'groups', color: 'text-[#41ddc2]', desc: 'Cellular heatmap aggregation' },
    { key: 'hazard' as const, label: 'BIOLOGICAL HAZARDS', icon: 'coronavirus', color: 'text-green-400', desc: 'Toxin & radiation spread zones' },
  ];

  return (
    <TacticalLayout>
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl">{toast}</div>
      )}

      <div className="absolute inset-0">
        <TacticalMap
          center={[34.0522, -118.2437]}
          zoom={13}
          markers={markers}
          activeOverlays={overlays}
          onMouseMove={(lat, lng) => setMouseLatLng({ lat, lng })}
          onMarkerClick={(m) => {
            const inc = incidents.find(i => i.type?.toUpperCase() === m.title || i.id === m.id);
            if (inc) setSelectedIncident(inc);
          }}
          flyTo={flyToTarget}
        />
      </div>

      {/* Top Stats */}
      <div className="absolute top-4 left-4 flex gap-3 z-10 pointer-events-none">
        <div className="bg-[#111318]/90 backdrop-blur px-4 py-3 rounded-xl border border-[#41ddc2]/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#41ddc2]">person_play</span>
          <div>
            <div className="text-xl font-bold font-mono text-[#41ddc2]">{rescuers.length}</div>
            <div className="text-[10px] text-gray-500 tracking-wider">ACTIVE RESPONDERS</div>
          </div>
        </div>
        <div className={`bg-[#111318]/90 backdrop-blur px-4 py-3 rounded-xl border flex items-center gap-3 ${criticalIncidents.length > 0 ? 'border-red-500/40 animate-pulse' : 'border-white/10'}`}>
          <span className="material-symbols-outlined text-red-400">warning</span>
          <div>
            <div className="text-xl font-bold font-mono text-red-400">{criticalIncidents.length}</div>
            <div className="text-[10px] text-gray-500 tracking-wider">CRITICAL ALERTS</div>
          </div>
        </div>
      </div>

      {/* SAT-LINK Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-[#111318]/90 backdrop-blur px-4 py-2 rounded-full border border-[#41ddc2]/20 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#41ddc2] animate-pulse" />
            <span className="text-xs font-mono text-[#41ddc2]">SAT-LINK ACTIVE</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-xs font-mono text-gray-500">UPTIME: 99.9%</span>
        </div>
      </div>

      {/* Tactical Overlays Panel */}
      <div className="absolute left-4 top-32 w-64 bg-[#111318]/95 backdrop-blur rounded-xl border border-white/10 overflow-hidden z-10 pointer-events-auto">
        <div className="p-3 border-b border-white/5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#41ddc2] text-lg">layers</span>
          <h2 className="font-bold text-[#41ddc2] text-sm tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TACTICAL OVERLAYS</h2>
        </div>
        <div className="p-3 space-y-2">
          {overlayConfig.map(layer => (
            <button
              key={layer.key}
              onClick={() => toggleOverlay(layer.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${overlays[layer.key] ? 'bg-[#41ddc2]/10 border-[#41ddc2]/30' : 'border-white/5 hover:border-white/10 hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined ${overlays[layer.key] ? layer.color : 'text-gray-600'}`}>{layer.icon}</span>
              <div className="text-left flex-1">
                <div className={`text-xs font-mono font-bold ${overlays[layer.key] ? layer.color : 'text-gray-400'}`}>{layer.label}</div>
                <div className="text-[9px] text-gray-600 mt-0.5">{layer.desc}</div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors ${overlays[layer.key] ? 'bg-[#41ddc2]' : 'bg-gray-700'}`}>
                <div className={`w-3 h-3 m-0.5 bg-white rounded-full transition-transform ${overlays[layer.key] ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          ))}
        </div>
        {/* Incidents quick list */}
        <div className="border-t border-white/5 p-3">
          <div className="text-[10px] font-mono text-gray-500 mb-2">LIVE INCIDENTS ({incidents.length})</div>
          <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
            {incidents.map(inc => (
              <button key={inc.id} onClick={() => { setSelectedIncident(inc); setFlyToTarget([inc.lat || 34.0522, inc.lng || -118.2437]); }}
                className="w-full flex items-center gap-2 p-2 rounded text-left hover:bg-white/5 transition">
                <span className={`w-2 h-2 rounded-full shrink-0 ${inc.severity === 'critical' ? 'bg-red-500 animate-pulse' : inc.severity === 'high' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
                <span className="text-xs text-gray-300 truncate">{(inc.title || inc.type || 'Unknown').toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Incident Detail Panel */}
      {activeIncident && (
        <div className="absolute right-4 top-20 w-76 max-w-xs bg-[#111318]/95 backdrop-blur rounded-xl border border-red-500/30 overflow-hidden z-10 pointer-events-auto">
          <div className={`p-4 border-b flex justify-between items-center ${activeIncident.severity === 'critical' ? 'border-red-500/20 bg-red-900/10' : 'border-white/10'}`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${activeIncident.severity === 'critical' ? 'text-red-400 animate-pulse' : 'text-[#41ddc2]'}`}>adjust</span>
              <span className={`text-xs font-mono font-bold ${activeIncident.severity === 'critical' ? 'text-red-400' : 'text-[#41ddc2]'}`}>
                INCIDENT {activeIncident.incidentCode || activeIncident.id?.substring(0, 4).toUpperCase()}
              </span>
            </div>
            <button onClick={() => setSelectedIncident(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{(activeIncident.title || activeIncident.type || '').toUpperCase()}</div>
              <div className="text-xs text-gray-400 mt-1">{activeIncident.description || activeIncident.address}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0c0e13] p-3 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 font-mono mb-1">THREAT LEVEL</div>
                <div className={`font-bold text-sm ${activeIncident.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{activeIncident.severity?.toUpperCase()} ZONE</div>
              </div>
              <div className="bg-[#0c0e13] p-3 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 font-mono mb-1">SOURCE</div>
                <div className="text-[#41ddc2] font-bold text-sm">{activeIncident.source || 'MANUAL'}</div>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              📍 {activeIncident.address || `${activeIncident.lat?.toFixed(4)}, ${activeIncident.lng?.toFixed(4)}`}
            </div>
            {/* Live feed preview */}
            <div className="w-full h-28 bg-[#0c0e13] rounded border border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1615631221590-7d7211110091?q=80&w=400')] bg-cover mix-blend-luminosity" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-red-500" />
                <span className="text-[8px] font-mono text-red-400 font-bold">LIVE OVERWATCH</span>
              </div>
              <span className="material-symbols-outlined text-3xl text-white/30">visibility</span>
            </div>
          </div>
          <div className="p-3 border-t border-white/5 grid grid-cols-3 gap-2">
            <button onClick={handleDispatch} disabled={dispatchLoading} className="py-2 text-[10px] font-bold text-[#080a0e] bg-[#41ddc2] rounded hover:bg-white transition disabled:opacity-50">
              {dispatchLoading ? '...' : 'DISPATCH'}
            </button>
            <button onClick={handleEvacuate} className="py-2 text-[10px] font-bold text-white bg-red-500 rounded hover:bg-red-400 transition">EVACUATE</button>
            <button onClick={() => setFlyToTarget([activeIncident.lat, activeIncident.lng])} className="py-2 text-[10px] font-bold text-gray-400 rounded hover:bg-white/5 border border-white/10 transition">FLY TO</button>
          </div>
        </div>
      )}
    </TacticalLayout>
  );
}
