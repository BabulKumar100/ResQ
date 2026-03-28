'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { Package, Fuel, Users, AlertTriangle, MapPin, ChevronDown } from 'lucide-react';

interface Resource {
  id: string;
  label: string;
  type: 'VEHICLE' | 'MEDKIT' | 'RESCUE_UNIT' | 'SHELTER' | 'SUPPLY';
  status: 'AVAILABLE' | 'DEPLOYED' | 'RTB' | 'OFFLINE';
  fuelPct: number;
  crewCount: number;
  batteryPct: number;
  location: string;
  lat: number;
  lng: number;
  incident?: string;
  equipment: string[];
}

const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', label: 'TRUCK-ALPHA', type: 'VEHICLE', status: 'DEPLOYED', fuelPct: 72, crewCount: 4, batteryPct: 88, location: 'Delhi Sector 5', lat: 28.61, lng: 77.20, incident: 'INC-001', equipment: ['Water pump', 'Ladder', 'Rope'] },
  { id: 'r2', label: 'MED-VAN-01', type: 'MEDKIT', status: 'AVAILABLE', fuelPct: 95, crewCount: 3, batteryPct: 100, location: 'Base Camp Alpha', lat: 28.57, lng: 77.22, equipment: ['Defibrillator', 'ICU Kit', 'Stretcher'] },
  { id: 'r3', label: 'RESCUE-BRAVO', type: 'RESCUE_UNIT', status: 'DEPLOYED', fuelPct: 18, crewCount: 6, batteryPct: 45, location: 'Ring Road Junction', lat: 28.62, lng: 77.21, incident: 'INC-002', equipment: ['Rope kit', 'Hydraulic cutter', 'Helmets'] },
  { id: 'r4', label: 'SHELTER-C3', type: 'SHELTER', status: 'AVAILABLE', fuelPct: 100, crewCount: 0, batteryPct: 62, location: 'Kapashera Relief Camp', lat: 28.51, lng: 77.07, equipment: ['Tents x40', 'Ration kits', 'Medkits x20'] },
  { id: 'r5', label: 'SUPPLY-RUN-7', type: 'SUPPLY', status: 'RTB', fuelPct: 34, crewCount: 2, batteryPct: 100, location: 'NH-48 Checkpoint', lat: 28.53, lng: 77.10, equipment: ['Food packs', 'Water 500L'] },
  { id: 'r6', label: 'TRUCK-GAMMA', type: 'VEHICLE', status: 'OFFLINE', fuelPct: 5, crewCount: 0, batteryPct: 10, location: 'Maintenance Bay', lat: 28.65, lng: 77.23, equipment: ['Fire hose', 'Foam canister'] },
  { id: 'r7', label: 'MED-VAN-02', type: 'MEDKIT', status: 'DEPLOYED', fuelPct: 60, crewCount: 2, batteryPct: 73, location: 'Hospital Zone', lat: 28.57, lng: 77.22, incident: 'INC-003', equipment: ['ICU Kit', 'Blood supply'] },
];

const STATUS_STYLE: Record<string, string> = {
  AVAILABLE: 'text-green-400 bg-green-400/10 border-green-400/30',
  DEPLOYED: 'text-primary-tactical bg-primary-tactical/10 border-primary-tactical/30',
  RTB: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  OFFLINE: 'text-outline bg-surface-container border-outline/20',
};

const TYPE_ICONS: Record<string, string> = {
  VEHICLE: 'airport_shuttle',
  MEDKIT: 'medical_services',
  RESCUE_UNIT: 'emergency_share',
  SHELTER: 'holiday_village',
  SUPPLY: 'inventory_2',
};

export default function ResourceInventoryPage() {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [dispatchTarget, setDispatchTarget] = useState('');

  const filtered = resources.filter(r => {
    if (filterType !== 'ALL' && r.type !== filterType) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const dispatch = (id: string) => {
    setResources(rs => rs.map(r => r.id === id ? { ...r, status: 'DEPLOYED', incident: dispatchTarget || 'INC-AUTO' } : r));
    setDispatchTarget('');
  };

  const recall = (id: string) => {
    setResources(rs => rs.map(r => r.id === id ? { ...r, status: 'RTB', incident: undefined } : r));
  };

  const lowFuelCount = resources.filter(r => r.fuelPct < 20).length;
  const availableCount = resources.filter(r => r.status === 'AVAILABLE').length;
  const deployedCount = resources.filter(r => r.status === 'DEPLOYED').length;

  return (
    <TacticalLayout>
      <div className="p-4 md:p-6 overflow-y-auto h-full">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <Package className="w-7 h-7 text-primary-tactical" />
              RESOURCE INVENTORY MAP
            </h1>
            <div className="flex gap-2 flex-wrap text-xs font-mono">
              {['ALL', 'VEHICLE', 'MEDKIT', 'RESCUE_UNIT', 'SHELTER', 'SUPPLY'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg border transition font-bold ${filterType === t ? 'bg-primary-tactical text-surface-dim border-primary-tactical' : 'bg-surface-container border-outline/20 text-outline hover:border-primary-tactical/40'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TOTAL UNITS', value: resources.length, icon: 'inventory', color: 'text-primary-tactical' },
              { label: 'AVAILABLE', value: availableCount, icon: 'check_circle', color: 'text-resq-low' },
              { label: 'DEPLOYED', value: deployedCount, icon: 'travel_explore', color: 'text-resq-high' },
              { label: 'LOW FUEL ⚠', value: lowFuelCount, icon: 'local_gas_station', color: 'text-error-tactical', pulse: lowFuelCount > 0 },
            ].map((s, i) => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-outline/20 flex items-center justify-between hover:border-primary-tactical/30 transition">
                <div>
                  <div className="text-2xl font-black font-mono text-on-surface">{s.value}</div>
                  <div className="text-[10px] text-outline font-mono tracking-widest mt-1">{s.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-full bg-surface-container flex items-center justify-center ${(s as any).pulse ? 'animate-pulse' : ''}`}>
                  <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Resource List */}
            <div className="xl:col-span-2 glass-panel rounded-xl border border-outline/20 p-5">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="font-bold text-on-surface">INVENTORY DATABASE</h2>
                <div className="flex gap-2">
                  {['ALL', 'AVAILABLE', 'DEPLOYED', 'RTB', 'OFFLINE'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-2 py-1 text-[10px] font-bold font-mono rounded border transition ${filterStatus === s ? 'bg-primary-tactical/20 border-primary-tactical/50 text-primary-tactical' : 'border-outline/15 text-outline hover:border-primary-tactical/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filtered.map(res => {
                  const isSel = selected?.id === res.id;
                  const fuelWarn = res.fuelPct < 20;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelected(isSel ? null : res)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${isSel ? 'border-primary-tactical/50 bg-primary-tactical/5' : fuelWarn ? 'border-red-500/30 bg-red-500/5' : 'border-outline/10 bg-surface-container-low hover:border-primary-tactical/20'}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fuelWarn ? 'bg-red-900/30' : 'bg-surface-container'}`}>
                            <span className={`material-symbols-outlined text-xl ${fuelWarn ? 'text-red-400' : 'text-primary-tactical'}`}>{TYPE_ICONS[res.type]}</span>
                          </div>
                          <div>
                            <div className="font-bold font-mono text-on-surface text-sm">{res.label}</div>
                            <div className="text-[10px] text-outline font-mono flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{res.location}
                              {res.incident && <span className="text-primary-tactical ml-1">→ {res.incident}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${STATUS_STYLE[res.status]}`}>{res.status}</span>
                          <div className="text-right hidden md:block">
                            <div className="flex items-center gap-1 text-[10px] text-outline font-mono">
                              <Fuel className="w-3 h-3" />{res.fuelPct}%
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-outline font-mono">
                              <Users className="w-3 h-3" />{res.crewCount}
                            </div>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-outline transition-transform ${isSel ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Fuel Bar */}
                      <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${res.fuelPct > 50 ? 'bg-resq-low' : res.fuelPct > 20 ? 'bg-resq-high' : 'bg-error-tactical animate-pulse'}`}
                          style={{ width: `${res.fuelPct}%` }}
                        />
                      </div>

                      {/* Expanded row actions */}
                      {isSel && (
                        <div className="mt-3 pt-3 border-t border-outline/10 flex gap-2">
                          {res.status !== 'DEPLOYED' && (
                            <button onClick={e => { e.stopPropagation(); dispatch(res.id); }} className="flex-1 py-1.5 text-[11px] font-bold font-mono rounded border border-primary-tactical/40 text-primary-tactical hover:bg-primary-tactical hover:text-surface-dim transition">
                              DISPATCH
                            </button>
                          )}
                          {res.status === 'DEPLOYED' && (
                            <button onClick={e => { e.stopPropagation(); recall(res.id); }} className="flex-1 py-1.5 text-[11px] font-bold font-mono rounded border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-surface-dim transition">
                              RECALL
                            </button>
                          )}
                          <button onClick={e => e.stopPropagation()} className="flex-1 py-1.5 text-[11px] font-bold font-mono rounded border border-outline/20 text-outline hover:border-primary-tactical/30 transition">
                            VIEW ON MAP
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Detail Panel */}
            <div className="xl:col-span-1 space-y-4">
              {/* Dispatch Panel */}
              <div className="glass-panel rounded-xl border border-primary-container/30 p-5">
                <h2 className="font-bold text-primary-tactical mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  QUICK DISPATCH
                </h2>
                {selected ? (
                  <div className="space-y-3">
                    <div className="bg-surface-container p-3 rounded-lg border border-outline/10">
                      <div className="text-[9px] text-outline font-mono mb-1">SELECTED UNIT</div>
                      <div className="font-bold text-on-surface">{selected.label}</div>
                      <div className="text-xs text-outline font-mono">{selected.location}</div>
                    </div>
                    <div>
                      <label className="text-[10px] text-outline font-mono block mb-1">TARGET INCIDENT ID</label>
                      <input
                        type="text"
                        value={dispatchTarget}
                        onChange={e => setDispatchTarget(e.target.value)}
                        placeholder="e.g. INC-004"
                        className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface font-mono"
                      />
                    </div>
                    <button
                      onClick={() => dispatch(selected.id)}
                      disabled={selected.status === 'DEPLOYED'}
                      className="w-full py-2.5 bg-primary-tactical disabled:opacity-50 text-surface-dim font-bold rounded-lg text-sm hover:opacity-90 transition"
                    >
                      {selected.status === 'DEPLOYED' ? 'ALREADY DEPLOYED' : 'CONFIRM DISPATCH'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-outline text-xs font-mono py-8">
                    <span className="material-symbols-outlined text-4xl opacity-20 block mb-2">touch_app</span>
                    SELECT A UNIT FROM THE LIST
                  </div>
                )}
              </div>

              {/* Low Fuel Alerts */}
              {lowFuelCount > 0 && (
                <div className="glass-panel rounded-xl border border-error-tactical/30 p-5">
                  <h2 className="font-bold text-error-tactical mb-3 flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    LOW FUEL ALERTS
                  </h2>
                  <div className="space-y-2">
                    {resources.filter(r => r.fuelPct < 20).map(r => (
                      <div key={r.id} className="flex justify-between items-center text-xs font-mono">
                        <span className="text-error-tactical font-bold">{r.label}</span>
                        <span className="text-outline">{r.fuelPct}% · {r.location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Summary */}
              {selected && (
                <div className="glass-panel rounded-xl border border-outline/20 p-5">
                  <h2 className="font-bold text-on-surface mb-3 text-sm">EQUIPMENT MANIFEST</h2>
                  <ul className="space-y-1">
                    {selected.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-mono text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-tactical shrink-0" />
                        {eq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
