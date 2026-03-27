'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useRealtimeIncidents, useRealtimeRescuers } from '@/lib/useRealtime';
import { formatDistanceToNow } from 'date-fns';

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-dim flex items-center justify-center"><Loader2 className="animate-spin text-primary-tactical" /></div>,
});

export default function EmergencyMapPage() {
  const [activeLayer, setActiveLayer] = useState<'thermal' | 'structural' | 'population' | 'hazard' | 'clear'>('hazard');
  const { incidents } = useRealtimeIncidents();
  const { rescuers } = useRealtimeRescuers();

  const mapMarkers = [
    { position: [34.0522, -118.2437] as [number, number], title: 'Command Node', type: 'default', description: 'Main HQ' },
    ...incidents.map(i => ({
      position: [i.lat || 34.0522, i.lng || -118.2437] as [number, number],
      title: i.type.toUpperCase(),
      type: 'emergency' as const,
      description: i.description || i.address
    })),
    ...rescuers.map(r => ({
      position: [r.lat || 34.0522, r.lng || -118.2437] as [number, number],
      title: r.name,
      type: 'resource' as const,
      description: `Role: ${r.role}, Status: ${r.status}`
    }))
  ];
  
  const criticalIncidents = incidents.filter(i => i.severity === 'critical');
  const activeIncident = criticalIncidents[0] || incidents[0] || null;

  return (
    <TacticalLayout>
      <div className="absolute inset-0 bg-surface-container-lowest z-0">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="w-full h-full relative">
          <ResQMap 
            center={[34.0522, -118.2437]} 
            zoom={14} 
            markers={mapMarkers} 
          />
        </div>
      </div>

      {/* Top Data Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex gap-4">
          <div className="glass-panel p-3 rounded-lg border border-primary-container/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary-container">person_play</span>
            <div>
              <div className="text-xl font-bold font-mono text-tertiary-container">{rescuers.length}</div>
              <div className="text-[10px] text-outline tracking-wider">ACTIVE RESPONDERS</div>
            </div>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-error-container/50 flex items-center gap-3 animate-pulse-red">
            <span className="material-symbols-outlined text-error-tactical">warning</span>
            <div>
              <div className="text-xl font-bold font-mono text-error-tactical">{criticalIncidents.length}</div>
              <div className="text-[10px] text-outline tracking-wider">CRITICAL ALERTS</div>
            </div>
          </div>
        </div>

        <div className="glass-panel px-4 py-2 rounded-full border border-primary-tactical/30 flex items-center gap-4 hidden sm:flex pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-tactical animate-pulse"></span>
            <span className="text-xs font-mono text-primary-tactical">SAT-LINK ACTIVE</span>
          </div>
          <div className="w-px h-4 bg-outline/30"></div>
          <span className="text-xs font-mono text-outline-variant">UPTIME: 99.9%</span>
        </div>
      </div>

      {/* Floating Control Panel (Left) */}
      <div className="absolute left-6 top-32 w-72 glass-panel rounded-xl border border-on-tertiary/40 overflow-hidden z-10 pointer-events-auto">
        <div className="p-4 border-b border-on-tertiary/30 bg-surface-container/50">
          <h2 className="font-headline font-semibold text-primary-tactical text-sm tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">layers</span>
            TACTICAL OVERLAYS
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {[
            { id: 'thermal', label: 'THERMAL IMAGING', icon: 'thermostat', color: 'text-error-tactical', desc: 'Active heat signatures detector' },
            { id: 'structural', label: 'STRUCTURAL DAMAGE', icon: 'domain_disabled', color: 'text-resq-high', desc: 'Building integrity assessment' },
            { id: 'population', label: 'POPULATION DENSITY', icon: 'groups', color: 'text-primary-tactical', desc: 'Cellular heatmap aggregation' },
            { id: 'hazard', label: 'BIOLOGICAL HAZARDS', icon: 'coronavirus', color: 'text-resq-low', desc: 'Toxin & radiation spread' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`w-full group flex items-start gap-3 p-3 rounded-lg transition-all border ${activeLayer === layer.id ? 'bg-primary-container/10 border-primary-container/50' : 'bg-surface-container-high/30 border-transparent hover:bg-surface-container-low hover:border-on-tertiary/50'}`}
            >
              <span className={`material-symbols-outlined ${activeLayer === layer.id ? layer.color : 'text-outline-variant group-hover:text-primary-tactical'}`}>{layer.icon}</span>
              <div className="text-left">
                <div className={`text-xs font-mono font-bold ${activeLayer === layer.id ? layer.color : 'text-on-surface'}`}>{layer.label}</div>
                <div className="text-[10px] text-outline mt-1">{layer.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Tactical Detail Panel */}
      {activeIncident && (
        <div className="absolute right-6 top-24 w-80 glass-panel rounded-xl border border-error-container/40 overflow-hidden z-10 animate-slide-in-right pointer-events-auto hidden md:block">
          <div className={`p-4 ${activeIncident.severity === 'critical' ? 'bg-error-container/20 border-error-tactical/20' : 'bg-surface-container/50 border-outline/20'} border-b flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${activeIncident.severity === 'critical' ? 'text-error-tactical animate-pulse' : 'text-primary-tactical'}`}>adjust</span>
              <span className={`text-xs font-mono font-bold ${activeIncident.severity === 'critical' ? 'text-error-tactical' : 'text-primary-tactical'}`}>INCIDENT {activeIncident.id?.substring(0,6).toUpperCase()}</span>
            </div>
            <span className="text-[10px] font-mono text-outline">
               {activeIncident.createdAt ? formatDistanceToNow((activeIncident.createdAt as any).toDate ? (activeIncident.createdAt as any).toDate() : new Date(activeIncident.createdAt as any), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-lg font-headline font-bold text-on-surface">{activeIncident.type.toUpperCase()}</div>
              <div className="text-sm text-outline mt-1">{activeIncident.description || activeIncident.address}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded border border-on-tertiary/20">
                <div className="text-[10px] text-outline font-mono mb-1">THREAT LEVEL</div>
                <div className={`${activeIncident.severity === 'critical' ? 'text-error-tactical' : 'text-resq-high'} font-bold text-sm uppercase`}>{activeIncident.severity} ZONE</div>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded border border-on-tertiary/20">
                <div className="text-[10px] text-outline font-mono mb-1">UNITS</div>
                <div className="text-primary-tactical font-bold text-sm">{activeIncident.assignedTo?.length || 0} ASSIGNED</div>
              </div>
            </div>
            
            <div className="w-full h-32 bg-surface-dim rounded border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
              {/* Live drone feed placeholder */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1615631221590-7d7211110091?q=80&w=600')] bg-cover bg-center mix-blend-luminosity"></div>
              <div className={`absolute inset-0 ${activeIncident.severity === 'critical' ? 'bg-error-tactical/10' : 'bg-primary-tactical/5'}`}></div>
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full animate-pulse ${activeIncident.severity === 'critical' ? 'bg-error-tactical' : 'bg-primary-tactical'}`}></span>
                <span className={`text-[8px] font-mono font-bold ${activeIncident.severity === 'critical' ? 'text-error-tactical' : 'text-primary-tactical'}`}>LIVE OVERWATCH</span>
              </div>
              <span className="material-symbols-outlined text-4xl text-white/50">visibility</span>
            </div>
          </div>
          <div className="p-2 border-t border-on-tertiary/30 grid grid-cols-3 gap-1">
            <button className="py-2 text-[10px] font-bold text-surface-dim bg-primary-tactical rounded hover:bg-primary-container transition">DISPATCH</button>
            <button className="py-2 text-[10px] font-bold text-surface-dim bg-error-tactical rounded hover:bg-error-container transition">EVACUATE</button>
            <button className="py-2 text-[10px] font-bold text-outline hover:text-on-surface rounded hover:bg-surface-container-high transition border border-outline-variant">MORE</button>
          </div>
        </div>
      )}
    </TacticalLayout>
  );
}
