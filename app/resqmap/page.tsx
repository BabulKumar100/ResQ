'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeIncidents, useRealtimeRescuers } from '@/lib/useRealtime';
import { Loader2, RadioTower } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CommandCenterPage() {
  const { incidents, loading } = useRealtimeIncidents();
  const { rescuers } = useRealtimeRescuers();
  const [seeding, setSeeding] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [deployedUnits, setDeployedUnits] = useState<string[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      if (res.ok) showToast('✅ Database seeded — 3 incidents, 3 rescuers, 2 depots loaded');
      else showToast('❌ Seed failed');
    } catch { showToast('❌ Network error'); }
    setSeeding(false);
  };

  const deployUnit = async (unitName: string, incidentId?: string) => {
    const target = incidentId || selectedIncident?.id || incidents[0]?.id;
    if (!target) { showToast('⚠️ Select an incident first'); return; }
    setDeployedUnits(prev => [...prev, unitName]);
    // Log deploy action to the API
    await fetch('/api/db/live_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DEPLOY', message: `${unitName} deployed to incident ${target}`, severity: 'info', locationName: selectedIncident?.address || 'Unknown' })
    });
    showToast(`🚁 ${unitName} → Dispatched to incident ${target}`);
  };

  const broadcastAlert = async () => {
    setBroadcasting(true);
    await fetch('/api/db/live_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'BROADCAST', message: 'EMERGENCY ALERT: All channels notified. Civilians advised to evacuate Zones 4 & 7.', severity: 'critical', locationName: 'ALL SECTORS' })
    });
    await new Promise(r => setTimeout(r, 1200));
    showToast('📡 BROADCAST SENT — All responder channels notified');
    setBroadcasting(false);
  };

  const resolveIncident = async (id: string) => {
    await fetch('/api/db/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'resolved' })
    });
    showToast(`✅ Incident ${id} marked resolved`);
    if (selectedIncident?.id === id) setSelectedIncident(null);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return { color: 'text-red-400', bg: 'bg-red-900/20 text-red-400', border: 'border-red-500/50 border-l-4', pulse: 'animate-pulse' };
      case 'high': return { color: 'text-orange-400', bg: 'bg-orange-900/20 text-orange-400', border: 'border-orange-500/30 border-l-4' };
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-900/20 text-yellow-400', border: 'border-yellow-500/30 border-l-2' };
      default: return { color: 'text-green-400', bg: 'bg-green-900/20 text-green-400', border: 'border-green-500/30 border-l-2' };
    }
  };

  const staticUnits = [
    { name: 'MED-VAC ALPHA', icon: 'local_hospital', color: 'text-[#41ddc2]', hoverBg: 'hover:bg-[#41ddc2]', eta: '04 MINS' },
    { name: 'HAZMAT TEAM-3', icon: 'fire_truck', color: 'text-red-400', hoverBg: 'hover:bg-red-500', eta: '08 MINS' },
    { name: 'RIOT CONTROL-9', icon: 'local_police', color: 'text-orange-400', hoverBg: 'hover:bg-orange-500', eta: '12 MINS' },
  ];

  return (
    <TacticalLayout>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl animate-fade-in max-w-xs">
          {toast}
        </div>
      )}

      <div className="p-4 md:p-6 h-full flex flex-col xl:flex-row gap-6">
        
        {/* LEFT: Incident Feed */}
        <div className="w-full xl:w-[400px] flex flex-col gap-4 h-full shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="material-symbols-outlined text-orange-400">rss_feed</span>
              LIVE INCIDENTS
              <span className="text-xs font-mono text-[#41ddc2] ml-2 bg-[#41ddc2]/10 px-2 py-0.5 rounded">{incidents.length} ACTIVE</span>
            </h2>
            <button onClick={seedDatabase} disabled={seeding} className="text-[10px] font-mono bg-[#41ddc2] text-[#080a0e] font-bold px-3 py-1.5 rounded hover:bg-white transition flex items-center gap-1">
              {seeding ? <Loader2 className="w-3 h-3 animate-spin" /> : <span className="material-symbols-outlined text-[12px]">database</span>}
              SEED DB
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar pb-10">
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#41ddc2] opacity-50" />
              </div>
            ) : incidents.length === 0 ? (
              <div className="text-center text-gray-500 text-xs font-mono py-10">
                NO ACTIVE INCIDENTS — CLICK "SEED DB" TO LOAD DATA
              </div>
            ) : (
              incidents.map((incident) => {
                const styles = getSeverityStyles(incident.severity);
                let timeAgo = 'JUST NOW';
                if (incident.createdAt) {
                  try { timeAgo = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true }).toUpperCase(); } catch { }
                }
                const isSelected = selectedIncident?.id === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(isSelected ? null : incident)}
                    className={`p-4 rounded-xl border ${styles.border} transition cursor-pointer ${isSelected ? 'bg-[#41ddc2]/10 border-[#41ddc2]/50' : 'bg-[#111318] hover:bg-[#1a1d24]'} group`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider ${styles.bg} ${styles.pulse || ''}`}>{incident.severity?.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-mono">{timeAgo}</span>
                        <button
                          onClick={e => { e.stopPropagation(); resolveIncident(incident.id); }}
                          className="text-[10px] font-mono bg-green-900/30 text-green-400 px-2 py-0.5 rounded hover:bg-green-500 hover:text-white transition"
                        >RESOLVE</button>
                      </div>
                    </div>
                    <h3 className={`font-bold text-white text-sm mb-1`}>{incident.type?.toUpperCase()}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{incident.description || incident.address}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px] text-[#41ddc2]">location_on</span>{incident.address}</span>
                      <button
                        onClick={e => { e.stopPropagation(); deployUnit('MED-VAC ALPHA', incident.id); }}
                        className="ml-auto bg-[#41ddc2]/10 border border-[#41ddc2]/30 text-[#41ddc2] px-2 py-0.5 rounded hover:bg-[#41ddc2] hover:text-[#080a0e] transition font-bold"
                      >DISPATCH →</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER: Radar + Metrics */}
        <div className="flex-1 flex flex-col gap-4 h-full pb-10">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {[
              { label: 'ACTIVE RESPONDERS', value: rescuers.length.toString(), icon: 'groups', color: 'text-[#41ddc2]' },
              { label: 'CRITICAL OPS', value: incidents.filter(i => i.severity === 'critical').length.toString(), icon: 'warning', color: 'text-red-400' },
              { label: 'UNITS DEPLOYED', value: deployedUnits.length.toString(), icon: 'flight', color: 'text-orange-400' },
              { label: 'TOTAL INCIDENTS', value: incidents.length.toString(), icon: 'crisis_alert', color: 'text-yellow-400' },
            ].map((m, i) => (
              <div key={i} className="bg-[#111318] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className={`material-symbols-outlined ${m.color}`}>{m.icon}</span>
                  <span className="w-1.5 h-1.5 bg-[#41ddc2] rounded-full animate-pulse" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">{m.value}</div>
                <div className="text-[9px] text-gray-500 tracking-wider uppercase mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Radar */}
          <div className="flex-1 bg-[#0c0e13] rounded-xl border border-[#41ddc2]/10 relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#41ddc2]/10 flex justify-between items-center z-10 shrink-0">
              <h2 className="font-bold text-[#41ddc2] tracking-wide text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SECTOR SCANNER</h2>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono text-gray-500">TRACKING {incidents.length} ZONES</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              {/* Radar rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#41ddc2]/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-[#41ddc2]/15 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#41ddc2]/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#41ddc2] rounded-full animate-pulse" />
              {/* Sweep */}
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-tr from-[#41ddc2]/20 to-transparent origin-top-left" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', animation: 'spin 4s linear infinite' }} />
              {/* Incident markers from DB */}
              {incidents.slice(0, 5).map((inc, i) => {
                const positions = [{ x: '35%', y: '30%' }, { x: '60%', y: '45%' }, { x: '45%', y: '65%' }, { x: '25%', y: '55%' }, { x: '70%', y: '30%' }];
                const pos = positions[i] || { x: '50%', y: '50%' };
                const isCrit = inc.severity === 'critical';
                return (
                  <div key={inc.id} className="absolute flex flex-col items-center cursor-pointer" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }} onClick={() => setSelectedIncident(inc)}>
                    <span className={`w-3 h-3 rounded-full ${isCrit ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse' : 'bg-orange-400'}`} />
                    <span className={`text-[8px] font-mono mt-1 bg-[#0c0e13]/90 px-1 rounded ${isCrit ? 'text-red-400' : 'text-orange-400'}`}>{inc.type?.substring(0, 6).toUpperCase()}</span>
                  </div>
                );
              })}
              {/* Rescuer markers */}
              {rescuers.slice(0, 3).map((r, i) => {
                const positions = [{ x: '55%', y: '40%' }, { x: '40%', y: '60%' }, { x: '65%', y: '55%' }];
                const pos = positions[i] || { x: '50%', y: '50%' };
                return (
                  <div key={r.id} className="absolute flex flex-col items-center" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
                    <span className="w-2 h-2 rounded-full bg-[#41ddc2] shadow-[0_0_6px_#41ddc2]" />
                    <span className="text-[7px] font-mono mt-0.5 text-[#41ddc2]">◆</span>
                  </div>
                );
              })}
              {/* Selected incident panel */}
              {selectedIncident && (
                <div className="absolute bottom-4 left-4 bg-[#111318]/95 border border-[#41ddc2]/30 rounded-xl p-4 max-w-xs backdrop-blur z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm">{selectedIncident.type?.toUpperCase()}</h4>
                    <button onClick={() => setSelectedIncident(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{selectedIncident.description}</p>
                  <div className="text-[10px] font-mono text-gray-500 mb-3">📍 {selectedIncident.address}</div>
                  <button onClick={() => deployUnit('RAPID RESPONSE', selectedIncident.id)} className="w-full text-xs bg-[#41ddc2] text-[#080a0e] font-bold py-1.5 rounded hover:bg-white transition">
                    DISPATCH RAPID RESPONSE →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Unit Dispatch */}
        <div className="w-full xl:w-[340px] flex flex-col gap-4 h-full shrink-0 pb-10">
          <div className="bg-[#111318] p-5 rounded-xl border border-white/5 h-full flex flex-col">
            <h2 className="font-bold text-lg text-white flex items-center gap-2 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="material-symbols-outlined text-[#41ddc2]">support_agent</span>
              UNIT DISPATCH
            </h2>
            {/* DB rescuers */}
            <div className="space-y-2 mb-4">
              {rescuers.map((r) => {
                const isDeployed = deployedUnits.includes(r.name);
                return (
                  <div key={r.id} className={`p-3 rounded-lg border ${isDeployed ? 'border-[#41ddc2]/50 bg-[#41ddc2]/5' : 'border-white/5 bg-[#0c0e13] hover:border-[#41ddc2]/30'} transition flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${isDeployed ? 'bg-[#41ddc2]/20 text-[#41ddc2]' : 'bg-gray-800 text-gray-400'}`}>
                        <span className="material-symbols-outlined text-sm">{r.equipment?.includes('drone') ? 'flight' : r.equipment?.includes('rover') ? 'directions_car' : 'local_hospital'}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono text-white">{r.name}</div>
                        <div className="text-[10px] text-gray-500">{isDeployed ? '🟢 IN FIELD' : `🔋 ${r.fuelPct}% · ${r.agency}`}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deployUnit(r.name)}
                      disabled={isDeployed}
                      className={`text-[10px] px-3 py-1.5 rounded font-bold font-mono transition ${isDeployed ? 'bg-[#41ddc2]/20 text-[#41ddc2] cursor-default' : 'bg-gray-800 text-gray-400 hover:bg-[#41ddc2] hover:text-[#080a0e]'}`}
                    >
                      {isDeployed ? 'DEPLOYED' : 'DEPLOY'}
                    </button>
                  </div>
                );
              })}

              {/* Static units as fallback */}
              {staticUnits.map((u) => {
                const isDeployed = deployedUnits.includes(u.name);
                return (
                  <div key={u.name} className={`p-3 rounded-lg border ${isDeployed ? 'border-[#41ddc2]/50 bg-[#41ddc2]/5' : 'border-white/5 bg-[#0c0e13] hover:border-[#41ddc2]/30'} transition flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${isDeployed ? 'bg-[#41ddc2]/20 text-[#41ddc2]' : 'bg-gray-800 ' + u.color}`}>
                        <span className="material-symbols-outlined text-sm">{u.icon}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono text-white">{u.name}</div>
                        <div className="text-[10px] text-gray-500">{isDeployed ? '🟢 IN FIELD' : `ETA: ${u.eta}`}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deployUnit(u.name)}
                      disabled={isDeployed}
                      className={`text-[10px] px-3 py-1.5 rounded font-bold font-mono transition ${isDeployed ? 'bg-[#41ddc2]/20 text-[#41ddc2] cursor-default' : 'bg-gray-800 text-gray-400 hover:bg-[#41ddc2] hover:text-[#080a0e]'}`}
                    >
                      {isDeployed ? 'DEPLOYED' : 'DEPLOY'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Broadcast Button */}
            <div className="mt-auto p-4 bg-[#41ddc2]/5 border border-[#41ddc2]/20 rounded-xl">
              <h3 className="text-sm font-bold text-[#41ddc2] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Global Comms</h3>
              <p className="text-xs text-gray-400 mb-3">Broadcast emergency alert to all civilian and responder channels.</p>
              <button
                onClick={broadcastAlert}
                disabled={broadcasting}
                className="w-full py-2.5 bg-[#41ddc2] hover:bg-[#65fade] disabled:opacity-60 text-[#080a0e] font-bold text-xs rounded transition flex items-center justify-center gap-2"
              >
                {broadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[16px]">campaign</span>}
                {broadcasting ? 'BROADCASTING...' : 'INITIATE BROADCAST'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
