'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeIncidents, useRealtimeRescuers } from '@/lib/useRealtime';
import { createIncident, upsertSurvivor } from '@/lib/firestoreService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CommandCenterPage() {
  const { incidents, loading } = useRealtimeIncidents();
  const { rescuers } = useRealtimeRescuers();
  const [seeding, setSeeding] = useState(false);

  const seedDatabase = async () => {
    setSeeding(true);
    if (!db) {
      alert('Firebase is not configured. Please add your credentials to .env.local to enable the Real-time Database.');
      setSeeding(false);
      return;
    }
    
    try {
      // 1. Seed Incidents
      await createIncident({ type: 'Chemical Spill', severity: 'critical', lat: 34.048, lng: -118.25, address: 'Industrial Sector 4', description: 'Toxic plume detected. Evac required.', source: 'sensor', status: 'new', reportedBy: 'system' });
      await createIncident({ type: 'Subway Derailment', severity: 'critical', lat: 34.053, lng: -118.245, address: 'Blue Line Downtown', description: 'Train derailed, structure damaged.', source: 'manual', status: 'new', reportedBy: 'user' });
      await createIncident({ type: 'Bridge Stress', severity: 'high', lat: 34.06, lng: -118.23, address: '4th St Bridge', description: 'Abnormal vibrations detected.', source: 'sensor', status: 'new', reportedBy: 'system' });
      
      // 2. Seed Rescuers / Drones
      await addDoc(collection(db, 'rescuers'), { userId: 'drone1', name: 'DRONE-7 ALPHA', role: 'rescuer', lat: 34.05, lng: -118.24, status: 'busy', agency: 'Air Unit', fuelPct: 84, crewCount: 0, equipment: ['drone'], lastPing: serverTimestamp() });
      await addDoc(collection(db, 'rescuers'), { userId: 'drone2', name: 'ROVER GRID-X', role: 'rescuer', lat: 34.055, lng: -118.25, status: 'busy', agency: 'Ground Unit', fuelPct: 18, crewCount: 0, equipment: ['rover'], lastPing: serverTimestamp() });
      await addDoc(collection(db, 'rescuers'), { userId: 'resc1', name: 'MEDVAC B', role: 'rescuer', lat: 34.051, lng: -118.23, status: 'available', agency: 'Medical', fuelPct: 100, crewCount: 4, equipment: ['trauma kit'], lastPing: serverTimestamp() });
      
      // 3. Seed Resources
      await addDoc(collection(db, 'resources'), { name: 'DEPOT OMEGA', location: 'SECTOR 4', distance: '1.2km', type: 'MEDICAL', status: 'CRITICAL', createdAt: serverTimestamp() });
      await addDoc(collection(db, 'resources'), { name: 'HUB ALPHA', location: 'SECTOR 1', distance: '3.4km', type: 'MULTI', status: 'OPERATIONAL', createdAt: serverTimestamp() });

      // 4. Seed Danger Zones
      await addDoc(collection(db, 'danger_zones'), { type: 'Fire Spread Vector', status: 'MONITORING', radius: 1200, riskLevel: 'HIGH', description: 'Fire moving NNE at 45km/h due to wind shear.', createdAt: serverTimestamp() });

    } catch (e) {
      console.error('Seed error:', e);
    }
    setSeeding(false);
  };

  
  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'critical': return { color: 'text-error-tactical', bg: 'bg-error-container/20 text-error-tactical', border: 'border-error-tactical/50 border-l-4', pulse: 'animate-pulse' };
      case 'high': return { color: 'text-resq-high', bg: 'bg-resq-high/20 text-resq-high', border: 'border-resq-high/30 border-l-4' };
      case 'medium': return { color: 'text-resq-medium', bg: 'bg-resq-medium/20 text-resq-medium', border: 'border-resq-medium/30 border-l-2' };
      default: return { color: 'text-resq-low', bg: 'bg-resq-low/20 text-resq-low', border: 'border-resq-low/30 border-l-2' };
    }
  };

  return (
    <TacticalLayout>
      <div className="p-4 md:p-6 h-full flex flex-col xl:flex-row gap-6">
        
        {/* Left Panel: Incident Feed */}
        <div className="w-full xl:w-[400px] flex flex-col gap-4 h-full shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-resq-high">rss_feed</span>
              LIVE INCIDENTS
            </h2>
            <div className="flex gap-2">
              <button onClick={seedDatabase} disabled={seeding} className="text-[10px] font-mono bg-primary-tactical text-surface-dim font-bold px-2 py-1 rounded hover:bg-white transition flex items-center gap-1">
                {seeding ? <Loader2 className="w-3 h-3 animate-spin"/> : <span className="material-symbols-outlined text-[12px]">database</span>}
                SEED DB
              </button>
              <button className="material-symbols-outlined text-outline hover:text-primary-tactical transition">filter_list</button>
              <button className="material-symbols-outlined text-outline hover:text-primary-tactical transition">sort</button>
            </div>
          </div>
          
          {/* Incidents List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-10">
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-tactical opacity-50" />
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center text-outline text-xs font-mono py-10 opacity-50">NO ACTIVE INCIDENTS DETECTED</div>
            ) : (
              incidents.map((incident) => {
                const styles = getSeverityStyles(incident.severity);
                let timeAgo = '';
                if (incident.createdAt) {
                  // handle Firestore timestamp
                  const date = (incident.createdAt as any).toDate ? (incident.createdAt as any).toDate() : new Date(incident.createdAt as any);
                  try {
                     timeAgo = formatDistanceToNow(date, { addSuffix: true }).toUpperCase();
                  } catch (e) { timeAgo = 'JUST NOW'; }
                }
                
                return (
                  <div key={incident.id} className={`glass-panel p-4 rounded-xl border ${styles.border} hover:bg-surface-container-high/50 transition cursor-pointer group`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider ${styles.bg} ${styles.pulse || ''}`}>{incident.severity.toUpperCase()}</span>
                      <span className="text-[10px] text-outline font-mono uppercase">{timeAgo}</span>
                    </div>
                    <h3 className={`font-bold text-on-surface text-sm mb-1 group-hover:${styles.color} transition`}>{incident.type.toUpperCase()}</h3>
                    <p className="text-xs text-outline line-clamp-2 mb-3">{incident.description || incident.address}</p>
                    <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-outline">
                      <div className="flex items-center gap-1"><span className={`material-symbols-outlined text-[14px] ${styles.color}`}>personal_injury</span> {incident.assignedTo?.length || 0} UNITS</div>
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary-tactical">distance</span> {incident.source?.toUpperCase() || 'MANUAL'}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Panel: Live Radar & Metrics */}
        <div className="flex-1 flex flex-col gap-6 h-full pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {[
              { label: 'ACTIVE RESPONDERS', value: rescuers.length.toString(), trend: 'OP', icon: 'groups', color: 'text-primary-tactical' },
              { label: 'CRITICAL OPS', value: incidents.filter(i => i.severity === 'critical').length.toString(), trend: 'ACT', icon: 'warning', color: 'text-error-tactical' },
              { label: 'DRONES DEPLOYED', value: '--', trend: 'N/A', icon: 'flight', color: 'text-tertiary-container' },
              { label: 'TOTAL INCIDENTS', value: incidents.length.toString(), trend: 'LIVE', icon: 'crisis_alert', color: 'text-resq-medium' },
            ].map((metric, i) => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-on-tertiary/20 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className={`material-symbols-outlined ${metric.color}`}>{metric.icon}</span>
                  <span className={`text-[10px] font-bold font-mono text-outline`}>{metric.trend}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-on-surface">{metric.value}</div>
                  <div className="text-[9px] text-outline tracking-wider uppercase mt-1">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 glass-panel rounded-xl border border-primary-container/30 relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-primary-container/20 flex justify-between items-center bg-surface-dim/50 z-10 shrink-0">
              <h2 className="font-headline font-bold text-primary-tactical tracking-wide">SECTOR SCANNER</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary-tactical text-surface-dim text-xs font-bold rounded">MAP</button>
                <button className="px-3 py-1 border border-outline/30 text-outline hover:text-on-surface text-xs font-bold rounded transition">RADAR</button>
              </div>
            </div>
            {/* Map Placeholder */}
            <div className="flex-1 relative bg-[#0c0e13]">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-container/20 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 border border-primary-container/40 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 border border-primary-container/60 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-tactical rounded-full animate-pulse"></div>
                  </div>
                </div>
                {/* Radar Sweep */}
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-tr from-primary-tactical/20 to-transparent origin-top-left animate-[spin_4s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
              </div>

              {/* Fake Map Markers */}
              {incidents.slice(0, 5).map((inc, i) => {
                 const x = 30 + (i * 15) % 50; 
                 const y = 30 + (i * 20) % 50;
                 return (
                  <div key={inc.id} className={`absolute top-[${y}%] left-[${x}%] flex flex-col items-center`}>
                    <span className={`w-3 h-3 rounded-full animate-pulse ${inc.severity === 'critical' ? 'bg-error-tactical shadow-[0_0_10px_#ffb4ab]' : 'bg-resq-high'}`}></span>
                    <span className={`text-[8px] font-mono mt-1 bg-surface-dim/80 px-1 rounded ${inc.severity === 'critical' ? 'text-error-tactical' : 'text-resq-high'}`}>{inc.id?.substring(0, 6) || 'UNIT'}</span>
                  </div>
                 )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Resource Dispatch */}
        <div className="w-full xl:w-[350px] flex flex-col gap-4 h-full shrink-0 pb-10">
          <div className="glass-panel p-5 rounded-xl border border-on-tertiary-container/30 h-full flex flex-col">
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-tertiary-container">support_agent</span>
              UNIT DISPATCH
            </h2>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline/20 hover:border-primary-tactical/30 transition cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary-tactical group-hover:bg-primary-tactical group-hover:text-surface-dim transition">
                    <span className="material-symbols-outlined text-sm">local_hospital</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-on-surface">MED-VAC ALPHA</div>
                    <div className="text-[10px] text-outline">ETA: 04 MINS</div>
                  </div>
                </div>
                <button className="text-[10px] bg-surface-container-high hover:bg-primary-container px-3 py-1.5 rounded font-bold transition group-hover:text-surface-dim">DEPLOY</button>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-outline/20 hover:border-primary-tactical/30 transition cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-error-container/20 flex items-center justify-center text-error-tactical group-hover:bg-error-tactical group-hover:text-surface-dim transition">
                    <span className="material-symbols-outlined text-sm">fire_truck</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-on-surface">HAZMAT TEAM-3</div>
                    <div className="text-[10px] text-outline">ETA: 08 MINS</div>
                  </div>
                </div>
                <button className="text-[10px] bg-surface-container-high hover:bg-error-tactical px-3 py-1.5 rounded font-bold transition group-hover:text-surface-dim">DEPLOY</button>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-outline/20 hover:border-primary-tactical/30 transition cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-resq-high/20 flex items-center justify-center text-resq-high group-hover:bg-resq-high group-hover:text-surface-dim transition">
                    <span className="material-symbols-outlined text-sm">local_police</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-on-surface">RIOT CONTROL-9</div>
                    <div className="text-[10px] text-outline">ETA: 12 MINS</div>
                  </div>
                </div>
                <button className="text-[10px] bg-surface-container-high hover:bg-resq-high px-3 py-1.5 rounded font-bold transition group-hover:text-surface-dim">DEPLOY</button>
              </div>
            </div>

            <div className="mt-auto p-4 bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary-container/20 blur-xl rounded-full"></div>
                <h3 className="text-sm font-bold text-tertiary-container mb-1">Global Comms</h3>
                <p className="text-xs text-outline mb-3">Broadcast emergency alert to all civilian and responder channels.</p>
                <button className="w-full py-2 bg-tertiary-container hover:bg-[#5ddac4] text-surface-dim font-bold text-xs rounded transition flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                    INITIATE BROADCAST
                </button>
            </div>
          </div>
        </div>

      </div>
    </TacticalLayout>
  );
}
