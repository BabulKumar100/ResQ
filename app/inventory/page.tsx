'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeResources } from '@/lib/useRealtime';
import { Loader2 } from 'lucide-react';

const STATIC_RESOURCES = [
  { id: 'r-med', name: 'Medical Kits', icon: 'medical_services', quantity: 4281, maxQty: 20000, status: 'CRITICAL', color: 'text-red-400', barColor: 'bg-red-500', unit: 'units' },
  { id: 'r-food', name: 'Food Rations', icon: 'restaurant', quantity: 12940, maxQty: 20000, status: 'STABLE', color: 'text-green-400', barColor: 'bg-green-500', unit: 'packs' },
  { id: 'r-water', name: 'Potable Water', icon: 'water_drop', quantity: 8400, maxQty: 20000, status: 'STABLE', color: 'text-[#41ddc2]', barColor: 'bg-[#41ddc2]', unit: 'L' },
  { id: 'r-power', name: 'Power Cores', icon: 'bolt', quantity: 412, maxQty: 2000, status: 'LOW', color: 'text-orange-400', barColor: 'bg-orange-500', unit: 'cores' },
];

const STATIC_HUBS = [
  { id: 'h1', name: 'DEPOT OMEGA', sector: 'Sector 4', type: 'MEDICAL', status: 'CRITICAL', distance: '1.2km', lat: 34.0489, lng: -118.2583, resources: { medical: 12, food: 45, water: 200, power: 3 } },
  { id: 'h2', name: 'HUB ALPHA', sector: 'Sector 1', type: 'MULTI', status: 'OPERATIONAL', distance: '3.4km', lat: 34.0561, lng: -118.2356, resources: { medical: 340, food: 1200, water: 4500, power: 89 } },
  { id: 'h3', name: 'FIELD BASE CHARLIE', sector: 'Sector 2', type: 'WATER', status: 'WARNING', distance: '5.1km', lat: 34.0601, lng: -118.2498, resources: { medical: 85, food: 320, water: 8200, power: 42 } },
];

export default function InventoryPage() {
  const { resources, loading } = useRealtimeResources();
  const [search, setSearch] = useState('');
  const [hubs, setHubs] = useState(STATIC_HUBS);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [toast, setToast] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [displayQtys, setDisplayQtys] = useState(STATIC_RESOURCES.map(r => r.quantity));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // Animate quantity counters
  useEffect(() => {
    const targets = STATIC_RESOURCES.map(r => r.quantity);
    const duration = 1200;
    const step = 20;
    const steps = duration / step;
    let i = 0;
    const int = setInterval(() => {
      i++;
      setDisplayQtys(targets.map(t => Math.round((t / steps) * Math.min(i, steps))));
      if (i >= steps) clearInterval(int);
    }, step);
    return () => clearInterval(int);
  }, []);

  const filteredHubs = hubs.filter(h =>
    !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.sector.toLowerCase().includes(search.toLowerCase())
  );

  // Merge DB resources with static fallback
  const displayResources = resources.length > 0
    ? resources.map((r, i) => ({ ...STATIC_RESOURCES[i], name: r.name || STATIC_RESOURCES[i]?.name, status: r.status || STATIC_RESOURCES[i]?.status }))
    : STATIC_RESOURCES;

  const requestResupply = async (hub: any) => {
    setRequestLoading(true);
    await fetch('/api/db/live_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'RESUPPLY', message: `Resupply request sent for ${hub.name} in ${hub.sector}`, severity: 'info', locationName: hub.sector })
    });
    await new Promise(r => setTimeout(r, 800));
    showToast(`📦 Resupply request sent for ${hub.name} — Logistics notified`);
    setRequestLoading(false);
    setSelectedHub(null);
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'border-red-500/50 bg-red-900/10 text-red-400';
      case 'WARNING': return 'border-orange-500/40 bg-orange-900/10 text-orange-400';
      case 'OPERATIONAL': case 'STABLE': return 'border-[#41ddc2]/30 bg-[#41ddc2]/5 text-[#41ddc2]';
      default: return 'border-white/10 bg-white/5 text-gray-400';
    }
  };

  return (
    <TacticalLayout>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl max-w-xs">{toast}</div>
      )}
      {/* Hub Detail Modal */}
      {selectedHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selectedHub.name}</h2>
                <p className="text-xs text-gray-500 font-mono mt-1">{selectedHub.sector} · {selectedHub.type} · {selectedHub.distance}</p>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded border ${statusStyle(selectedHub.status)}`}>{selectedHub.status}</span>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Medical Kits', val: selectedHub.resources.medical, color: 'bg-red-500', max: 500 },
                { label: 'Food Rations', val: selectedHub.resources.food, color: 'bg-green-500', max: 2000 },
                { label: 'Water (L)', val: selectedHub.resources.water, color: 'bg-[#41ddc2]', max: 10000 },
                { label: 'Power Cores', val: selectedHub.resources.power, color: 'bg-orange-500', max: 200 },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="text-white font-bold">{r.val.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-[#0c0e13] rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${Math.min(100, (r.val / r.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => requestResupply(selectedHub)} disabled={requestLoading} className="flex-1 py-2.5 bg-[#41ddc2] text-[#080a0e] font-bold text-sm rounded hover:bg-white transition disabled:opacity-50 flex items-center justify-center gap-2">
                {requestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[16px]">local_shipping</span>}
                REQUEST RESUPPLY
              </button>
              <button onClick={() => setSelectedHub(null)} className="flex-1 py-2.5 bg-[#0c0e13] border border-white/10 text-gray-400 text-sm rounded hover:border-white/20 hover:text-white transition">CLOSE</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Resource Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayResources.map((r, i) => {
              const pct = Math.min(100, ((displayQtys[i] || r.quantity) / (r.maxQty || 20000)) * 100);
              return (
                <div key={r.id} className={`bg-[#111318] p-5 rounded-xl border ${r.status === 'CRITICAL' ? 'border-red-500/30' : r.status === 'LOW' ? 'border-orange-500/30' : 'border-white/5'} flex flex-col gap-4`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-3xl font-bold font-mono ${r.color}`}>{(displayQtys[i] || r.quantity).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-1">{r.unit?.toUpperCase()}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#0c0e13] ${r.color}`}>
                      <span className="material-symbols-outlined text-xl">{r.icon}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-gray-400">{r.name}</span>
                      <span className={`font-bold ${r.color}`}>{r.status}</span>
                    </div>
                    <div className="h-1.5 bg-[#0c0e13] rounded-full overflow-hidden">
                      <div className={`h-full ${r.barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distribution Hubs */}
          <div className="bg-[#111318] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold text-white text-lg flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="material-symbols-outlined text-[#41ddc2]">warehouse</span>
                DISTRIBUTION HUBS
              </h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hub / sector..." className="bg-[#0c0e13] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-[#41ddc2]/40 outline-none w-56 transition font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
              {filteredHubs.map(hub => (
                <button key={hub.id} onClick={() => setSelectedHub(hub)} className={`p-5 rounded-xl border text-left transition hover:scale-[1.01] group ${statusStyle(hub.status)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-white text-base group-hover:text-[#41ddc2] transition" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{hub.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{hub.sector}</div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusStyle(hub.status)}`}>{hub.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">distance</span>{hub.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">category</span>{hub.type}
                    </span>
                    <span className="ml-auto text-[#41ddc2] group-hover:underline">VIEW →</span>
                  </div>
                  {/* Mini resource bars */}
                  <div className="mt-3 space-y-1.5">
                    {[
                      { label: 'MED', val: hub.resources.medical, max: 500, color: 'bg-red-500' },
                      { label: 'FOOD', val: hub.resources.food, max: 2000, color: 'bg-green-500' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-gray-600 w-8">{r.label}</span>
                        <div className="flex-1 h-1 bg-[#0c0e13] rounded-full overflow-hidden">
                          <div className={`h-full ${r.color} rounded-full`} style={{ width: `${Math.min(100, (r.val / r.max) * 100)}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-gray-600 w-10 text-right">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
