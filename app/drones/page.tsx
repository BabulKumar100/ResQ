'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeRescuers } from '@/lib/useRealtime';
import { formatDistanceToNow } from 'date-fns';

export default function DronesPage() {
  const [activeCam, setActiveCam] = useState('cam-1');
  const { rescuers, loading } = useRealtimeRescuers();
  
  // Filter rescuers to simulate "drones" or just use all active field units
  const fleet = rescuers.filter(r => r.status !== 'offline');

  return (
    <TacticalLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1600px] mx-auto">
          
          {/* Main Video Feed / Tactical Map */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-2 rounded-2xl border border-on-tertiary-container/30 relative overflow-hidden h-[500px] flex flex-col">
              
              {/* Camera Header Overlay */}
              <div className="flex justify-between items-center p-3 border-b border-on-tertiary/20 absolute top-0 w-full z-10 bg-gradient-to-b from-surface-dim/80 to-transparent">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-tactical animate-pulse">videocam</span>
                  <h2 className="font-headline font-bold text-lg text-primary-tactical tracking-wide">DRONE-7 ALPHA FEED</h2>
                </div>
                <div className="flex gap-2">
                  <div className="bg-error-tactical/20 border border-error-tactical text-error-tactical px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error-tactical animate-pulse"></span>
                    REC
                  </div>
                  <div className="bg-surface-container/50 border border-outline/30 text-outline px-2 py-0.5 rounded text-[10px] font-mono tracking-wider">
                    4K / 60FPS
                  </div>
                </div>
              </div>

              {/* Fake Video Feed Layer */}
              <div className="absolute inset-0 z-0 bg-surface-dim flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-10000"></div>
                
                {/* HUD Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary-tactical/30 rounded-full flex items-center justify-center">
                    <div className="w-1 h-4 bg-primary-tactical/50 absolute top-0"></div>
                    <div className="w-1 h-4 bg-primary-tactical/50 absolute bottom-0"></div>
                    <div className="w-4 h-1 bg-primary-tactical/50 absolute left-0"></div>
                    <div className="w-4 h-1 bg-primary-tactical/50 absolute right-0"></div>
                    <div className="w-1 h-1 bg-error-tactical rounded-full"></div>
                  </div>
                  
                  {/* Target Lock UI */}
                  <div className="absolute top-1/3 left-1/3 w-24 h-24 border-2 border-dashed border-error-tactical/60 animate-[spin_10s_linear_infinite] rounded"></div>
                  <div className="absolute top-1/3 left-1/3 w-24 h-24 -translate-y-6">
                    <div className="text-[10px] text-error-tactical font-mono font-bold bg-surface-dim/50 px-1 inline-block">TARGET_LOCK: VEHICLE</div>
                  </div>
                  
                  {/* Telemetry Data (Bottom Left) */}
                  <div className="absolute bottom-4 left-4 text-primary-tactical font-mono text-[10px] space-y-1 bg-surface-dim/40 p-2 rounded backdrop-blur">
                    <div>ALT: 450m</div>
                    <div>SPD: 65km/h</div>
                    <div>HDG: 104° ESE</div>
                    <div>BAT: 84% (42m ETA)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Other Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="glass-panel p-4 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-primary-container/10 border border-transparent hover:border-primary-tactical/50 transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary-tactical text-3xl transition-colors">settings_remote</span>
                <span className="text-xs font-bold font-mono text-on-surface">TAKE CONTROL</span>
              </button>
              <button className="glass-panel p-4 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-primary-container/10 border border-transparent hover:border-primary-tactical/50 transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary-tactical text-3xl transition-colors">my_location</span>
                <span className="text-xs font-bold font-mono text-on-surface">RETURN TO BASE</span>
              </button>
              
              {/* Secondary Feeds */}
              {[1, 2].map((feed) => (
                <div key={feed} className="relative h-24 rounded-xl border border-outline/20 overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508614589041-895b68904e3c?q=80&w=400')] bg-cover bg-center opacity-30 group-hover:opacity-60 transition-opacity mix-blend-luminosity"></div>
                  <div className="absolute bottom-2 left-2 text-[8px] bg-surface-dim/80 text-outline px-1 rounded font-mono">CAM-0{feed + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Active Fleet Status */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-5 rounded-2xl border border-on-tertiary-container/30 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline font-bold text-on-surface text-lg">FLEET STATUS</h3>
                <span className="text-xs font-mono bg-primary-container/20 text-primary-tactical px-2 py-1 rounded">{fleet.length} ACTIVE</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
                {fleet.length === 0 && !loading && (
                   <div className="text-center text-outline text-xs font-mono py-10 opacity-50">NO ACTIVE UNITS DETECTED IN SECTOR</div>
                )}
                
                {/* Fleet Item */}
                {fleet.map((unit, index) => {
                  const isWarning = (unit.fuelPct ?? 100) < 20;
                  const icon = unit.name.toLowerCase().includes('drone') || unit.name.toLowerCase().includes('air') ? 'flight' : 'local_shipping';
                  return (
                  <div key={unit.id || index} className={`p-4 rounded-xl border ${isWarning ? 'border-error-tactical/50 bg-error-container/10' : 'border-outline/10 bg-surface-container-lowest'} hover:border-primary-tactical/30 transition-colors cursor-pointer group`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isWarning ? 'bg-error-container/20' : 'bg-primary-container/20'}`}>
                          <span className={`material-symbols-outlined ${isWarning ? 'text-error-tactical' : 'text-primary-tactical'}`}>{icon}</span>
                        </div>
                        <div>
                          <div className="font-bold font-mono text-sm text-on-surface group-hover:text-primary-tactical transition-colors">{unit.name.toUpperCase()}</div>
                          <div className="text-[10px] text-outline font-mono tracking-wider">{unit.agency?.toUpperCase() || 'RESQ'} • {unit.status.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold font-mono ${isWarning ? 'text-error-tactical animate-pulse' : 'text-on-surface'}`}>{unit.fuelPct ?? 100}%</div>
                        <div className="text-[9px] text-outline mt-0.5">ENERGY</div>
                      </div>
                    </div>
                    
                    {/* Battery progress bar */}
                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${isWarning ? 'bg-error-tactical' : 'bg-primary-tactical'}`} style={{ width: `${unit.fuelPct ?? 100}%` }}></div>
                    </div>
                  </div>
                )})}
              </div>

              <div className="mt-6 pt-6 border-t border-outline/10">
                <button className="w-full py-3 bg-surface-container-high hover:bg-primary-container/20 border border-outline/20 hover:border-primary-tactical/50 rounded-xl text-sm font-bold font-mono text-on-surface hover:text-primary-tactical transition flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  DEPLOY NEW UNIT
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </TacticalLayout>
  );
}
