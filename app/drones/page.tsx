'use client';

import React, { useState, useEffect } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import dynamic from 'next/dynamic';
import { useRealtimeRescuers } from '@/lib/useRealtime';
import { Loader2 } from 'lucide-react';

const DroneCanvas = dynamic(() => import('@/components/map/DroneCanvas'), { ssr: false });

export default function DronesPage() {
  const { rescuers, loading } = useRealtimeRescuers();
  const fleet = rescuers;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [deployModal, setDeployModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', type: 'AIR', incident: '' });
  const [deploying, setDeploying] = useState(false);

  const selectedUnit = fleet.find(f => f.id === selectedId) || fleet[0] || null;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Drone battery simulation — every 10 seconds
  useEffect(() => {
    const simulate = () => fetch('/api/drones/simulate', { method: 'POST' }).catch(() => {});
    simulate();
    const int = setInterval(simulate, 10000);
    return () => clearInterval(int);
  }, []);

  const handleAction = async (action: string, unit: any) => {
    const newStatus = action === 'RTB' ? 'returning' : action === 'RECALL' ? 'offline' : action === 'DEPLOY' ? 'busy' : 'available';
    await fetch('/api/db/rescuers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...unit, status: newStatus })
    });
    showToast(`${action} → ${unit.name}: ${newStatus.toUpperCase()}`);
  };

  const deployNewUnit = async () => {
    if (!newUnit.name) { showToast('⚠️ Unit name required'); return; }
    setDeploying(true);
    await fetch('/api/db/rescuers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUnit.name.toUpperCase(),
        agency: `${newUnit.type} UNIT`,
        status: 'busy',
        fuelPct: 100,
        crewCount: 0,
        equipment: [newUnit.type === 'AIR' ? 'drone' : newUnit.type === 'GROUND' ? 'rover' : 'medkit'],
        lat: 34.05 + (Math.random() - 0.5) * 0.03,
        lng: -118.24 + (Math.random() - 0.5) * 0.03,
        isRecording: true,
        altitude: 450,
        speed: 65,
        heading: 104,
        headingLabel: 'ESE',
      })
    });
    await fetch('/api/db/live_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DEPLOY', message: `${newUnit.name} deployed to ${newUnit.incident || 'standby'}`, severity: 'info', locationName: 'Base' })
    });
    showToast(`🚁 ${newUnit.name} added & deployed`);
    setDeployModal(false);
    setNewUnit({ name: '', type: 'AIR', incident: '' });
    setDeploying(false);
  };

  return (
    <TacticalLayout>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl">{toast}</div>
      )}

      {/* Deploy Modal */}
      {deployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>DEPLOY NEW UNIT</h2>
            <div className="space-y-4 mb-5">
              <div>
                <label className="text-[10px] text-gray-500 font-mono block mb-1">UNIT NAME</label>
                <input type="text" value={newUnit.name} onChange={e => setNewUnit({ ...newUnit, name: e.target.value })} placeholder="e.g. HAWK-9" className="w-full bg-[#0c0e13] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#41ddc2]/50 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-mono block mb-1">UNIT TYPE</label>
                <div className="flex gap-2">
                  {['AIR', 'GROUND', 'MEDICAL'].map(t => (
                    <button key={t} onClick={() => setNewUnit({ ...newUnit, type: t })} className={`flex-1 py-2 text-xs font-mono font-bold rounded border transition ${newUnit.type === t ? 'bg-[#41ddc2] text-[#080a0e] border-[#41ddc2]' : 'border-white/10 text-gray-500 hover:border-[#41ddc2]/30'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-mono block mb-1">ASSIGN TO INCIDENT (optional)</label>
                <input type="text" value={newUnit.incident} onChange={e => setNewUnit({ ...newUnit, incident: e.target.value })} placeholder="Incident ID or type..." className="w-full bg-[#0c0e13] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#41ddc2]/50 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={deployNewUnit} disabled={deploying} className="flex-1 py-2.5 bg-[#41ddc2] text-[#080a0e] font-bold text-sm rounded hover:bg-white transition disabled:opacity-50 flex items-center justify-center gap-2">
                {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[16px]">rocket_launch</span>}
                DEPLOY UNIT
              </button>
              <button onClick={() => setDeployModal(false)} className="flex-1 py-2.5 bg-[#0c0e13] border border-white/10 text-gray-400 text-sm rounded hover:text-white transition">CANCEL</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0c0e13] rounded-2xl border border-[#41ddc2]/10 relative overflow-hidden h-[480px] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#41ddc2]/10 bg-[#0c0e13] z-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#41ddc2] animate-pulse">videocam</span>
                  <h2 className="font-bold text-xl text-[#41ddc2] tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {selectedUnit ? selectedUnit.name.toUpperCase() : 'NO UNIT SELECTED'} FEED
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />REC
                  </div>
                  <div className="bg-[#111318] border border-white/10 text-gray-400 px-2 py-0.5 rounded text-[10px] font-mono">4K / 60FPS</div>
                </div>
              </div>
              {/* Canvas Area */}
              <div className="flex-1 relative">
                <DroneCanvas drone={selectedUnit ? { ...selectedUnit, batteryPct: selectedUnit.fuelPct, altitude: selectedUnit.altitude || 450, speed: selectedUnit.speed || 65, heading: selectedUnit.heading || 104, headingLabel: selectedUnit.headingLabel || 'ESE', isRecording: true } : null} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: 'settings_remote', label: 'TAKE CONTROL', action: () => showToast('🕹️ Manual control mode active') },
                { icon: 'my_location', label: 'RETURN TO BASE', action: () => selectedUnit ? handleAction('RTB', selectedUnit) : showToast('⚠️ Select a unit first') },
                { icon: 'screenshot_monitor', label: 'SNAPSHOT', action: () => showToast('📸 Snapshot captured and logged') },
                { icon: 'emergency_home', label: 'ABORT', action: () => selectedUnit ? handleAction('RECALL', selectedUnit) : showToast('⚠️ Select a unit first') },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} className="bg-[#111318] p-4 flex flex-col items-center gap-2 rounded-xl border border-white/5 hover:border-[#41ddc2]/30 hover:bg-[#41ddc2]/5 transition group">
                  <span className="material-symbols-outlined text-gray-500 group-hover:text-[#41ddc2] text-3xl transition">{btn.icon}</span>
                  <span className="text-[10px] font-bold font-mono text-gray-500 group-hover:text-[#41ddc2] transition text-center">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fleet Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#111318] p-5 rounded-2xl border border-white/5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FLEET STATUS</h3>
                <span className="text-xs font-mono bg-[#41ddc2]/10 text-[#41ddc2] px-2 py-1 rounded border border-[#41ddc2]/20">{fleet.length} UNITS</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {loading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#41ddc2]" /></div>}
                {!loading && fleet.length === 0 && (
                  <div className="text-center text-gray-600 text-xs font-mono py-10">NO UNITS — CLICK "SEED DB" TO LOAD</div>
                )}
                {fleet.map(unit => {
                  const battery = unit.fuelPct ?? 100;
                  const isWarn = battery < 20;
                  const isReturning = unit.status === 'returning';
                  const isSelected = unit.id === selectedId;
                  const icon = unit.equipment?.includes('drone') ? 'flight' : unit.equipment?.includes('rover') ? 'airport_shuttle' : 'local_hospital';
                  const barColor = battery > 50 ? 'bg-[#41ddc2]' : battery > 20 ? 'bg-orange-500' : 'bg-red-500';

                  return (
                    <div
                      key={unit.id}
                      onClick={() => setSelectedId(isSelected ? null : unit.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${isSelected ? 'border-[#41ddc2]/50 bg-[#41ddc2]/5' : isWarn ? 'border-red-500/30 bg-red-900/5 animate-pulse' : 'border-white/5 bg-[#0c0e13] hover:border-[#41ddc2]/20'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWarn ? 'bg-red-900/30' : 'bg-[#41ddc2]/10'}`}>
                            <span className={`material-symbols-outlined ${isWarn ? 'text-red-400' : 'text-[#41ddc2]'}`}>{icon}</span>
                          </div>
                          <div>
                            <div className="font-bold font-mono text-sm text-white">{unit.name?.toUpperCase()}</div>
                            <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                              {isReturning && <span className="text-orange-400 animate-pulse">RTB ↗</span>}
                              {!isReturning && unit.agency} · {unit.status?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold font-mono ${isWarn ? 'text-red-400 animate-pulse' : 'text-white'}`}>{battery}%</div>
                          <div className="text-[9px] text-gray-500 mt-0.5">ENERGY</div>
                        </div>
                      </div>
                      {/* Battery bar */}
                      <div className="w-full h-1.5 bg-[#0c0e13] rounded-full overflow-hidden mb-3">
                        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${battery}%` }} />
                      </div>
                      {/* Action buttons when selected */}
                      {isSelected && (
                        <div className="flex gap-2">
                          <button onClick={e => { e.stopPropagation(); handleAction('DEPLOY', unit); }} className="flex-1 text-[10px] font-mono py-1.5 rounded border border-[#41ddc2]/30 text-[#41ddc2] hover:bg-[#41ddc2] hover:text-[#080a0e] transition font-bold">DEPLOY</button>
                          <button onClick={e => { e.stopPropagation(); handleAction('RTB', unit); }} className="flex-1 text-[10px] font-mono py-1.5 rounded border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition font-bold">RTB</button>
                          <button onClick={e => { e.stopPropagation(); handleAction('RECALL', unit); }} className="flex-1 text-[10px] font-mono py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition font-bold">RECALL</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <button onClick={() => setDeployModal(true)} className="w-full py-3 bg-[#0c0e13] hover:bg-[#41ddc2]/10 border border-white/5 hover:border-[#41ddc2]/40 rounded-xl text-sm font-bold font-mono text-gray-400 hover:text-[#41ddc2] transition flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  DEPLOY NEW UNIT
                </button>
                <button onClick={() => { fetch('/api/feeds/sync').then(() => showToast('📡 USGS feed synced — checking for new events')); }} className="w-full py-2.5 bg-[#0c0e13] border border-white/5 hover:border-white/20 rounded-xl text-xs font-mono text-gray-600 hover:text-gray-400 transition">
                  SYNC EXTERNAL FEEDS (USGS)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
