'use client';

import React from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeDangerZones, useRealtimeIncidents } from '@/lib/useRealtime';
import { formatDistanceToNow } from 'date-fns';

export default function PredictionsPage() {
  const { zones, loading: dzLoading } = useRealtimeDangerZones();
  const { incidents, loading: incLoading } = useRealtimeIncidents();
  
  const activeDanger = zones?.[0] || null;
  return (
    <TacticalLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Top Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-primary-tactical/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="font-headline font-bold text-2xl text-primary-tactical flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl animate-pulse text-error-tactical">neurology</span>
                RESQ-AI PREDICTIVE ENGINE
              </h2>
              <p className="text-sm text-outline mt-2 max-w-2xl">Analyzing real-time sensor data, meteorological patterns, and historical density models to forecast near-future incident progression.</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline/20">
              <div className="text-right">
                <div className="text-[10px] text-outline font-mono tracking-wider">CONFIDENCE SCORE</div>
                <div className="text-xl font-bold font-mono text-primary-fixed-dim">94.2%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-[3px] border-primary-tactical border-t-transparent animate-[spin_3s_linear_infinite] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-primary-tactical animate-none">check</span>
              </div>
            </div>
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* AI Alert: Extreme Heat / Fire Spread */}
            <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-error-tactical/50 flex flex-col shadow-[0_0_20px_rgba(255,180,171,0.05)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-error-container/30 flex items-center justify-center text-error-tactical">
                    <span className="material-symbols-outlined animate-pulse">{activeDanger ? 'warning' : 'security'}</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg">{activeDanger ? activeDanger.type?.toUpperCase() || 'HAZARD ZONE' : 'SYSTEM NOMINAL'}</h3>
                    <div className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded inline-block mt-1 ${activeDanger ? 'text-error-tactical bg-error-tactical/10' : 'text-primary-tactical bg-primary-tactical/10'}`}>
                      {activeDanger ? `RISK LEVEL: ${activeDanger.riskLevel}` : 'NO THREATS DETECTED'}
                    </div>
                  </div>
                </div>
                <button className="text-xs font-mono font-bold text-outline hover:text-on-surface transition bg-surface-container-lowest px-3 py-1.5 rounded">VIEW MAP</button>
              </div>
              
              <div className="flex-1 min-h-[150px] bg-surface-dim rounded-lg border border-error-container/40 p-4 relative overflow-hidden">
                {activeDanger && <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601007205934-1188288ce588?q=80&w=600')] bg-cover mix-blend-color-burn grayscale"></div>}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <p className="text-sm text-on-surface/80 leading-relaxed font-mono">
                    {activeDanger ? (
                      <>
                        <span className="text-error-tactical font-bold">&gt; RADIUS:</span> {activeDanger.radius}m<br/>
                        <span className="text-error-tactical font-bold">&gt; STATUS:</span> {activeDanger.status}<br/>
                        <span className="text-primary-tactical font-bold">&gt; PREDICTION:</span> {activeDanger.description || 'Hazard expansion likely.'}
                      </>
                    ) : (
                      <>
                        <span className="text-primary-tactical font-bold">&gt; SCANNING:</span> Active Sectors... OK<br/>
                        <span className="text-primary-tactical font-bold">&gt; PREDICTION:</span> No immediate anomalies detected in sensor grid.
                      </>
                    )}
                  </p>
                  <div className="mt-4 pt-4 border-t border-error-tactical/20 flex justify-between items-center text-xs font-mono">
                    <span className="text-outline">IMPACT RADIUS: <span className="text-error-tactical font-bold">{activeDanger ? `${activeDanger.radius}m` : '0m'}</span></span>
                    {activeDanger && <button className="text-error-tactical hover:text-white transition underline decoration-error-tactical border-error-tactical px-2 py-1 bg-error-tactical/10 rounded">ISSUE PRE-EVAC</button>}
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Depletion Risk */}
            <div className="glass-panel p-6 rounded-2xl border border-resq-high/40 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded bg-resq-high/20 flex items-center justify-center text-resq-high">
                    <span className="material-symbols-outlined">vaccines</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">Medical Deficit</h3>
                    <div className="text-[10px] text-resq-high font-mono tracking-widest mt-1">WARNING</div>
                  </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative w-full h-32 flex items-end justify-between gap-2 px-2">
                   {/* Fake bar chart */}
                   <div className="w-full bg-primary-tactical/30 rounded-t border-t border-primary-tactical/50" style={{ height: '80%' }}></div>
                   <div className="w-full bg-primary-tactical/30 rounded-t border-t border-primary-tactical/50" style={{ height: '65%' }}></div>
                   <div className="w-full bg-resq-medium/40 rounded-t border-t border-resq-medium/60" style={{ height: '45%' }}></div>
                   <div className="w-full bg-resq-high/40 rounded-t border-t border-resq-high/60 animate-pulse" style={{ height: '25%' }}></div>
                   <div className="w-full bg-error-tactical/40 rounded-t border-t border-error-tactical/60 animate-pulse" style={{ height: '10%' }}></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-outline mt-2 px-2">
                  <span>T-0</span>
                  <span>T+2H</span>
                  <span>T+4H</span>
                  <span>T+6H</span>
                  <span>T+8H</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline/20">
                <p className="text-[11px] text-outline font-mono">Trauma kits at Field Hospital Alpha projecting to reach critical limits in ~6 hours based on current casualty intake velocity.</p>
              </div>
            </div>

            {/* Infrastructure Stress */}
            <div className="glass-panel p-6 rounded-2xl border border-resq-medium/40 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded bg-resq-medium/20 flex items-center justify-center text-resq-medium">
                    <span className="material-symbols-outlined">power</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">Grid Instability</h3>
                    <div className="text-[10px] text-resq-medium font-mono tracking-widest mt-1">MONITORING</div>
                  </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border-4 border-surface-container-highest flex items-center justify-center">
                    <div className="text-center">
                       <span className="text-xl font-bold font-mono text-resq-medium">68%</span>
                       <div className="text-[8px] text-outline">CAPACITY</div>
                    </div>
                  </div>
                  <svg className="absolute w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-resq-medium drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" strokeDasharray="276" strokeDashoffset="88"></circle>
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline/20">
                <p className="text-[11px] text-outline font-mono">Sector 3 substations showing abnormal load variations. Rolling blackouts recommended to prevent total failure.</p>
              </div>
            </div>

            {/* AI Routing Optimization */}
            <div className="xl:col-span-2 glass-panel p-0 rounded-2xl border border-primary-container/30 flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#0c0e13] z-0">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>

              <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary-tactical animate-pulse">route</span>
                    <h3 className="font-headline font-bold text-on-surface text-lg">Route Optimization</h3>
                  </div>
                  <p className="text-xs text-on-surface/70 w-2/3">AI has recalculated evacuation channels bypassing structural hazards on Highway 4.</p>
                </div>

                <div className="mt-8 flex gap-4">
                  <div className="p-3 bg-surface-dim/80 backdrop-blur border border-primary-tactical/30 rounded flex-1">
                     <div className="text-[9px] text-primary-tactical font-mono">PRIMARY EVAC</div>
                     <div className="font-bold text-sm tracking-wide mt-1">CORRIDOR BETA</div>
                     <div className="text-xs text-outline mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> -12 mins saved</div>
                  </div>
                  <div className="p-3 bg-surface-dim/80 backdrop-blur border border-outline/30 rounded flex-1 opacity-50 block md:hidden xl:block">
                     <div className="text-[9px] text-outline font-mono">SECONDARY (BLOCKED)</div>
                     <div className="font-bold text-sm tracking-wide mt-1 text-on-surface/50 line-through">HIGHWAY 4</div>
                     <div className="text-xs text-error-tactical mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">block</span> Structural Risk</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentient Logs */}
            <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-surface-container-high flex flex-col h-[300px]">
               <h3 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-outline">terminal</span>
                 SYSTEM LOGS
               </h3>
               <div className="bg-surface-dim rounded border border-outline/10 p-4 h-full font-mono text-[11px] space-y-2 overflow-y-auto no-scrollbar shadow-inner text-outline">
                 <div className="flex gap-3"><span className="text-primary-tactical">[{new Date().toLocaleTimeString()}]</span> <span className="text-on-surface">&gt; Initializing predictive models... OK</span></div>
                 {incidents.slice(0, 10).map((inc, i) => {
                   let timeStr = new Date().toLocaleTimeString();
                   if (inc.createdAt) {
                      const d = (inc.createdAt as any).toDate ? (inc.createdAt as any).toDate() : new Date(inc.createdAt as any);
                      timeStr = d.toLocaleTimeString();
                   }
                   const colorClass = inc.severity === 'critical' ? 'text-error-tactical font-bold' : inc.severity === 'high' ? 'text-resq-high' : 'text-on-surface/80';
                   return (
                      <div key={inc.id || i} className="flex gap-3">
                         <span className={inc.severity === 'critical' ? 'text-error-tactical animate-pulse' : 'text-primary-tactical'}>[{timeStr}]</span> 
                         <span className={colorClass}>&gt; {inc.severity === 'critical' ? 'WARNING:' : 'LOG:'} {inc.type.toUpperCase()} recorded. Severity: {inc.severity}.</span>
                      </div>
                   )
                 })}
                 <div className="flex gap-3 text-on-surface/30"><span className="text-primary-tactical/30">[{new Date().toLocaleTimeString()}]</span> <span>&gt; Standby for incoming telemetry...</span></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
