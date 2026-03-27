'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeResources } from '@/lib/useRealtime';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const { resources, loading } = useRealtimeResources();
  const [search, setSearch] = useState('');

  const filteredResources = resources.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()) || r.type?.toLowerCase().includes(search.toLowerCase()));
  return (
    <TacticalLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Dashboard Header */}
          <div className="flex justify-between items-center bg-surface-container-highest/20 p-4 rounded-xl border border-outline/10">
            <h2 className="font-headline font-bold text-2xl text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-tactical animate-pulse">inventory_2</span>
              RESOURCE DEPOT NETWORK
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-outline/30 hover:bg-primary-tactical hover:text-surface-dim hover:border-transparent rounded font-bold transition text-xs font-mono text-outline">REQUEST SUPPLY DROP</button>
            </div>
          </div>

          {/* Top Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: '1', title: 'MEDICAL KITS', val: '4,281', limit: 'CRITICAL', icon: 'medical_services', color: 'text-error-tactical', line: 'bg-error-tactical', width: '20%' },
              { id: '2', title: 'FOOD RATIONS', val: '12,940', limit: 'STABLE', icon: 'restaurant', color: 'text-primary-tactical', line: 'bg-primary-tactical', width: '70%' },
              { id: '3', title: 'POTABLE WATER', val: '8,400L', limit: 'STABLE', icon: 'water_drop', color: 'text-resq-medium', line: 'bg-resq-medium', width: '45%' },
              { id: '4', title: 'POWER CORES', val: '412', limit: 'LOW', icon: 'battery_charging_20', color: 'text-resq-high', line: 'bg-resq-high', width: '35%' },
            ].map((stat) => (
              <div key={stat.id} className="glass-panel p-4 rounded-xl border border-on-tertiary-container/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-outline font-mono tracking-wider">{stat.title}</span>
                    <div className="text-2xl font-bold font-mono text-on-surface mt-1">{stat.val}</div>
                  </div>
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
                <div className="w-full h-1 bg-surface-dim rounded overflow-hidden">
                  <div className={`h-full ${stat.line}`} style={{ width: stat.width }}></div>
                </div>
                <div className={`text-[9px] font-mono mt-2 flex items-center justify-between`}>
                  <span className="text-outline">NETWORK AGGREGATE</span>
                  <span className={stat.color}>{stat.limit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[600px]">
            {/* Left Col: Supply Chain Grid */}
            <div className="xl:col-span-1 glass-panel p-5 rounded-2xl border border-outline/20 flex flex-col h-[600px] overflow-hidden">
              <h3 className="font-headline font-bold text-lg text-on-surface tracking-wide mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">account_tree</span>
                DISTRIBUTION HUBS
              </h3>

              {/* Hub searching */}
              <div className="mb-4 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Designation, Sector..." className="w-full bg-surface-container-low border border-outline/20 focus:border-primary-tactical/50 outline-none rounded pl-9 pr-4 py-2 text-xs text-on-surface font-mono" />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar relative min-h-[100px]">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-dim/50 z-20">
                    <Loader2 className="animate-spin text-primary-tactical" />
                  </div>
                )}
                {!loading && filteredResources.length === 0 && (
                  <div className="text-center text-outline text-xs font-mono py-10 opacity-50">NO RESOURCES LOGGED</div>
                )}
                
                {filteredResources.map((depot, idx) => {
                  let color = 'text-outline';
                  let bg = 'bg-surface-dim border-outline/20';
                  let border = 'border-outline';
                  let icon = 'warehouse';
                  
                  if (depot.status === 'CRITICAL' || depot.status === 'DEPLETED') {
                     color = 'text-error-tactical'; bg = 'bg-error-container/20 border-error-tactical/50'; border = 'border-error-tactical';
                  } else if (depot.status === 'OPERATIONAL') {
                     color = 'text-primary-tactical'; bg = 'bg-primary-container/10 border-outline/20'; border = 'border-primary-tactical';
                  } else if (depot.status === 'WARNING') {
                     color = 'text-resq-high'; bg = 'bg-resq-high/10 border-outline/20'; border = 'border-resq-high';
                  }
                  
                  if (depot.type === 'MEDICAL') icon = 'medical_services';
                  if (depot.type === 'RATIONS') icon = 'restaurant';
                  if (depot.type === 'WATER') icon = 'water_drop';

                  return (
                  <div key={depot.id || idx} className={`p-4 rounded-xl border-l-[3px] border-r border-t border-b hover:bg-surface-container-high transition cursor-pointer ${bg} ${border}`}>
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
                          <span className="font-bold text-sm text-on-surface tracking-wide">{depot.name?.toUpperCase() || 'UNKNOWN_DEPOT'}</span>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border border-current ${color}`}>{depot.status?.toUpperCase() || 'UNKNOWN'}</span>
                     </div>
                     <div className="flex items-center gap-4 text-[10px] text-outline font-mono mt-3">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">my_location</span> {depot.location?.toUpperCase() || 'SECTOR UNK'}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warehouse</span> {depot.type?.toUpperCase() || 'MULTI'}</span>
                        <span className="text-primary-tactical ml-auto flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">moving</span> {depot.distance || '?? km'}</span>
                     </div>
                  </div>
                )})}
              </div>
            </div>

            {/* Right Col: Tactical Tracking & Analytics */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* Map Layout */}
              <div className="flex-1 glass-panel rounded-2xl border border-primary-container/30 relative overflow-hidden bg-[#0c0e13]">
                {/* Tactical grid background overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute inset-0 z-0 opacity-10" style={{
                  backgroundImage: `linear-gradient(to right, #41ddc2 1px, transparent 1px), linear-gradient(to bottom, #41ddc2 1px, transparent 1px)`,
                  backgroundSize: '100px 100px'
                }}></div>

                {/* Simulated routes / lines */}
                <svg className="absolute inset-0 z-0 w-full h-full opacity-30">
                  <path d="M 100,200 L 300,100 L 500,250 L 800,150" fill="transparent" stroke="#5cf2d6" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                  <path d="M 200,400 L 400,250 L 600,450" fill="transparent" stroke="#f97316" strokeWidth="2" strokeDasharray="4,4" />
                </svg>

                {/* Floating Map Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                   <button className="bg-surface-dim/80 backdrop-blur border border-primary-tactical/50 p-2 rounded text-primary-tactical hover:bg-primary-container/20 transition"><span className="material-symbols-outlined text-[20px]">my_location</span></button>
                   <button className="bg-surface-dim/80 backdrop-blur border border-outline/30 p-2 rounded text-outline hover:text-on-surface transition"><span className="material-symbols-outlined text-[20px]">layers</span></button>
                   <button className="bg-surface-dim/80 backdrop-blur border border-outline/30 p-2 rounded text-outline hover:text-on-surface transition"><span className="material-symbols-outlined text-[20px]">zoom_in</span></button>
                </div>

                {/* Node details panel overlay */}
                <div className="absolute bottom-6 left-6 z-10 w-96 glass-panel border border-primary-tactical/40 rounded-xl p-5 shadow-[0_0_20px_rgba(92,242,214,0.1)]">
                   <div className="flex justify-between items-start mb-3">
                     <h3 className="font-headline font-bold text-on-surface flex items-center gap-2 text-lg">
                       <span className="material-symbols-outlined text-primary-tactical">warehouse</span>
                       DEPOT OMEGA
                     </h3>
                     <span className="text-xs bg-error-tactical/20 text-error-tactical px-2 py-0.5 rounded font-mono font-bold animate-pulse">CRITICAL</span>
                   </div>
                   
                   <p className="text-xs text-outline mb-4 pb-4 border-b border-primary-tactical/20">Primary medical distribution hub serving Sector 4 casualties.</p>
                   
                   <div className="space-y-3 font-mono">
                     <div className="flex justify-between text-[11px]">
                       <span className="text-outline">TRAUMA KITS</span>
                       <span className="text-error-tactical font-bold">12 / 500 (2% CAP)</span>
                     </div>
                     <div className="flex justify-between text-[11px]">
                       <span className="text-outline">IV FLUIDS</span>
                       <span className="text-resq-high font-bold">40 / 1000 (4% CAP)</span>
                     </div>
                     <div className="flex justify-between text-[11px]">
                       <span className="text-outline">PORTABLE O2</span>
                       <span className="text-primary-tactical font-bold">115 / 200 (57% CAP)</span>
                     </div>
                   </div>

                   <button className="w-full mt-5 py-2 border border-error-tactical text-error-tactical font-bold text-xs bg-error-tactical/10 hover:bg-error-tactical hover:text-surface-dim rounded transition">REROUTE FLIGHT DRONE-2</button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </TacticalLayout>
  );
}
