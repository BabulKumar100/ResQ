'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeRescuers } from '@/lib/useRealtime';
import { Loader2 } from 'lucide-react';

export default function DronesPage() {
  const { rescuers, loading } = useRealtimeRescuers();
  const fleet = rescuers;
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAction = async (action: string, unit: any) => {
    const newStatus = action === 'RTB' ? 'available' : action === 'RECALL' ? 'offline' : 'busy';
    await fetch('/api/db/rescuers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...unit, status: newStatus })
    });
    showToast(`${action}: ${unit.name} → ${newStatus.toUpperCase()}`);
  };

  const deployNew = async () => {
    const names = ['HAWK-9', 'VIPER-3', 'SHADOW-11', 'EAGLE-4'];
    const name = names[Math.floor(Math.random() * names.length)];
    await fetch('/api/db/rescuers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, agency: 'Air Unit', status: 'busy', fuelPct: Math.floor(60 + Math.random() * 40), crewCount: 0, equipment: ['drone'], lat: 34.05 + Math.random() * 0.01, lng: -118.24 + Math.random() * 0.01 })
    });
    showToast(`🚁 ${name} added to fleet`);
  };

  return (
    <TacticalLayout>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl max-w-xs">{toast}</div>
      )}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1600px] mx-auto">
          
          {/* Main Video Feed */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0c0e13] p-2 rounded-2xl border border-[#41ddc2]/10 relative overflow-hidden h-[480px] flex flex-col">
              <div className="flex justify-between items-center p-3 border-b border-[#41ddc2]/10 z-10 bg-[#0c0e13]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#41ddc2] animate-pulse">videocam</span>
                  <h2 className="font-bold text-lg text-[#41ddc2] tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {selectedUnit ? selectedUnit.name.toUpperCase() : 'DRONE-7 ALPHA'} FEED
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div className="bg-red-900/30 border border-red-500 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />REC
                  </div>
                  <div className="bg-[#111318] border border-white/10 text-gray-400 px-2 py-0.5 rounded text-[10px] font-mono">4K / 60FPS</div>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                <div className="absolute inset-0 pointer-events-none">
                  {/* Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-[#41ddc2]/40 rounded-full flex items-center justify-center">
                    <div className="w-0.5 h-5 bg-[#41ddc2]/60 absolute top-0" />
                    <div className="w-0.5 h-5 bg-[#41ddc2]/60 absolute bottom-0" />
                    <div className="w-5 h-0.5 bg-[#41ddc2]/60 absolute left-0" />
                    <div className="w-5 h-0.5 bg-[#41ddc2]/60 absolute right-0" />
                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                  </div>
                  {/* Lock box */}
                  <div className="absolute top-1/3 left-1/3 w-24 h-24 border-2 border-dashed border-red-500/60 animate-spin" style={{ animation: 'spin 10s linear infinite' }} />
                  <div className="absolute top-1/3 left-1/3 -mt-6 text-[10px] text-red-400 font-mono font-bold bg-[#0c0e13]/60 px-1">TARGET_LOCK: VEHICLE</div>
                  {/* Telemetry */}
                  <div className="absolute bottom-4 left-4 text-[#41ddc2] font-mono text-[10px] space-y-1 bg-[#0c0e13]/70 p-2 rounded backdrop-blur">
                    <div>ALT: {selectedUnit ? Math.floor(300 + (selectedUnit.fuelPct || 80) * 2) : 450}m</div>
                    <div>SPD: 65km/h</div>
                    <div>HDG: 104° ESE</div>
                    <div>BAT: {selectedUnit?.fuelPct ?? 84}% ({Math.floor((selectedUnit?.fuelPct ?? 84) / 2)}m ETA)</div>
                  </div>
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-[#41ddc2]/60 text-right">
                    <div>LAT: {selectedUnit?.lat?.toFixed(4) ?? '34.0500'}</div>
                    <div>LNG: {selectedUnit?.lng?.toFixed(4) ?? '-118.240'}</div>
                    <div className="text-gray-600 mt-1">{new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: 'settings_remote', label: 'TAKE CONTROL', action: () => showToast('🕹️ Manual control mode active') },
                { icon: 'my_location', label: 'RETURN TO BASE', action: () => selectedUnit ? handleAction('RTB', selectedUnit) : showToast('Select a unit first') },
                { icon: 'screenshot_monitor', label: 'SNAPSHOT', action: () => showToast('📸 Snapshot captured and saved') },
                { icon: 'emergency_home', label: 'ABORT MISSION', action: () => selectedUnit ? handleAction('RECALL', selectedUnit) : showToast('Select a unit first') },
              ].map((btn) => (
                <button key={btn.label} onClick={btn.action} className="bg-[#111318] p-4 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-[#41ddc2]/10 border border-white/5 hover:border-[#41ddc2]/40 transition group">
                  <span className="material-symbols-outlined text-gray-500 group-hover:text-[#41ddc2] text-3xl transition">{btn.icon}</span>
                  <span className="text-[10px] font-bold font-mono text-gray-400 group-hover:text-[#41ddc2] transition">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fleet Status Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#111318] p-5 rounded-2xl border border-white/5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FLEET STATUS</h3>
                <span className="text-xs font-mono bg-[#41ddc2]/10 text-[#41ddc2] px-2 py-1 rounded">{fleet.length} UNITS</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-[#41ddc2]" /></div>}
                {!loading && fleet.length === 0 && (
                  <div className="text-center text-gray-600 text-xs font-mono py-10">NO UNITS — SEED DB OR DEPLOY</div>
                )}
                {fleet.map((unit) => {
                  const isWarn = (unit.fuelPct ?? 100) < 20;
                  const isSelected = selectedUnit?.id === unit.id;
                  const icon = unit.equipment?.includes('drone') ? 'flight' : unit.equipment?.includes('rover') ? 'airport_shuttle' : 'local_hospital';
                  return (
                    <div
                      key={unit.id}
                      onClick={() => setSelectedUnit(isSelected ? null : unit)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${isSelected ? 'border-[#41ddc2]/50 bg-[#41ddc2]/5' : isWarn ? 'border-red-500/30 bg-red-900/10 hover:border-red-500/60' : 'border-white/5 bg-[#0c0e13] hover:border-[#41ddc2]/30'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isWarn ? 'bg-red-900/30' : 'bg-[#41ddc2]/10'}`}>
                            <span className={`material-symbols-outlined ${isWarn ? 'text-red-400' : 'text-[#41ddc2]'}`}>{icon}</span>
                          </div>
                          <div>
                            <div className="font-bold font-mono text-sm text-white">{unit.name?.toUpperCase()}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{unit.agency} · {unit.status?.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-bold font-mono ${isWarn ? 'text-red-400 animate-pulse' : 'text-white'}`}>{unit.fuelPct ?? 100}%</div>
                          <div className="text-[9px] text-gray-500">ENERGY</div>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[#0c0e13] rounded-full overflow-hidden mb-3">
                        <div className={`h-full transition-all ${isWarn ? 'bg-red-500' : 'bg-[#41ddc2]'}`} style={{ width: `${unit.fuelPct ?? 100}%` }} />
                      </div>
                      {isSelected && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={(e) => { e.stopPropagation(); handleAction('RTB', unit); }} className="flex-1 text-[10px] font-mono bg-[#41ddc2]/10 border border-[#41ddc2]/30 text-[#41ddc2] py-1.5 rounded hover:bg-[#41ddc2] hover:text-[#080a0e] transition font-bold">RTB</button>
                          <button onClick={(e) => { e.stopPropagation(); handleAction('RECALL', unit); }} className="flex-1 text-[10px] font-mono bg-red-900/20 border border-red-500/30 text-red-400 py-1.5 rounded hover:bg-red-500 hover:text-white transition font-bold">RECALL</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <button onClick={deployNew} className="w-full py-3 bg-[#0c0e13] hover:bg-[#41ddc2]/10 border border-white/5 hover:border-[#41ddc2]/40 rounded-xl text-sm font-bold font-mono text-gray-400 hover:text-[#41ddc2] transition flex items-center justify-center gap-2">
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
