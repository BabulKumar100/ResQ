'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeDangerZones, useRealtimeIncidents } from '@/lib/useRealtime';
import { Loader2 } from 'lucide-react';

export default function PredictionsPage() {
  const { zones } = useRealtimeDangerZones();
  const { incidents } = useRealtimeIncidents();
  const activeDanger = zones?.[0] || null;
  const [toast, setToast] = useState('');
  const [reporting, setReporting] = useState(false);
  const [form, setForm] = useState({ type: 'Flood Risk', description: '', severity: 'high' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const reportHazard = async () => {
    if (!form.description) { showToast('⚠️ Add a description'); return; }
    setReporting(true);
    await fetch('/api/db/danger_zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: form.type, description: form.description, status: 'MONITORING', radius: 800, riskLevel: form.severity.toUpperCase(), active: true })
    });
    showToast(`✅ Hazard zone "${form.type}" logged to DB`);
    setForm({ type: 'Flood Risk', description: '', severity: 'high' });
    setReporting(false);
  };

  return (
    <TacticalLayout>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111318] border border-[#41ddc2]/50 text-white text-xs font-mono px-4 py-3 rounded-xl shadow-xl max-w-xs">{toast}</div>
      )}
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Header */}
          <div className="bg-[#111318] p-6 rounded-2xl border border-[#41ddc2]/20 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="font-bold text-2xl text-[#41ddc2] flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="material-symbols-outlined text-3xl animate-pulse text-red-400">neurology</span>
                RESQ-AI PREDICTIVE ENGINE
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-2xl">Analyzing real-time sensor data, meteorological patterns, and historical density models to forecast near-future incident progression.</p>
            </div>
            <div className="flex items-center gap-4 bg-[#0c0e13] p-3 rounded-lg border border-white/5">
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-mono tracking-wider">CONFIDENCE SCORE</div>
                <div className="text-xl font-bold font-mono text-[#41ddc2]">{94 - (zones.length * 2)}%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-[3px] border-[#41ddc2] border-t-transparent animate-spin flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#41ddc2]" style={{ animation: 'none' }}>check</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Active Hazard */}
            <div className="xl:col-span-2 bg-[#111318] p-6 rounded-2xl border border-red-500/30 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-red-900/30 flex items-center justify-center text-red-400">
                    <span className="material-symbols-outlined animate-pulse">{activeDanger ? 'warning' : 'security'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{activeDanger ? activeDanger.type : 'SYSTEM NOMINAL'}</h3>
                    <div className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded inline-block mt-1 ${activeDanger ? 'text-red-400 bg-red-900/20' : 'text-[#41ddc2] bg-[#41ddc2]/10'}`}>
                      {activeDanger ? `RISK: ${activeDanger.riskLevel}` : 'NO THREATS DETECTED'}
                    </div>
                  </div>
                </div>
                <button className="text-xs font-mono text-gray-500 hover:text-white bg-[#0c0e13] px-3 py-1.5 rounded transition">VIEW MAP →</button>
              </div>
              <div className="flex-1 min-h-[120px] bg-[#0c0e13] rounded-lg border border-red-900/30 p-4 relative overflow-hidden">
                {activeDanger && <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1601007205934-1188288ce588?q=80&w=600')] bg-cover mix-blend-color-burn" />}
                <div className="relative z-10 text-sm text-gray-300 font-mono leading-loose">
                  {activeDanger ? (
                    <>
                      <span className="text-red-400 font-bold">&gt; RADIUS:</span> {activeDanger.radius}m<br />
                      <span className="text-red-400 font-bold">&gt; STATUS:</span> {activeDanger.status}<br />
                      <span className="text-[#41ddc2] font-bold">&gt; PREDICTION:</span> {activeDanger.description || 'Hazard expansion likely.'}
                    </>
                  ) : (
                    <>
                      <span className="text-[#41ddc2] font-bold">&gt; SCANNING:</span> All sectors... OK<br />
                      <span className="text-[#41ddc2] font-bold">&gt; PREDICTION:</span> No anomalies detected.
                    </>
                  )}
                </div>
                {activeDanger && (
                  <div className="mt-4 pt-3 border-t border-red-900/30 flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500">IMPACT RADIUS: <span className="text-red-400 font-bold">{activeDanger.radius}m</span></span>
                    <button
                      onClick={() => showToast('📢 Pre-evacuation order issued — Sector alerts sent')}
                      className="text-red-400 border border-red-500/30 px-3 py-1 bg-red-900/10 hover:bg-red-500 hover:text-white rounded transition font-bold"
                    >ISSUE PRE-EVAC</button>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Deficit */}
            <div className="bg-[#111318] p-6 rounded-2xl border border-orange-500/20 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-orange-900/20 flex items-center justify-center text-orange-400">
                  <span className="material-symbols-outlined">vaccines</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Medical Deficit</h3>
                  <div className="text-[10px] text-orange-400 font-mono tracking-widest mt-1">WARNING</div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative w-full h-28 flex items-end justify-between gap-1.5 px-1">
                  {[80, 65, 45, 25, 10].map((h, i) => (
                    <div key={i} className={`w-full rounded-t border-t ${i < 2 ? 'bg-[#41ddc2]/30 border-[#41ddc2]/50' : i === 2 ? 'bg-orange-400/40 border-orange-400/60' : 'bg-red-500/40 border-red-500/60 animate-pulse'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-2 px-1">
                  <span>T-0</span><span>T+2H</span><span>T+4H</span><span>T+6H</span><span>T+8H</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[11px] text-gray-500 font-mono">Trauma kits at Field Hospital Alpha critical in ~6 hours at current intake velocity.</p>
                <button onClick={() => showToast('📦 Resupply request submitted to logistics')} className="mt-2 w-full text-[10px] font-mono bg-orange-900/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white py-1.5 rounded transition font-bold">REQUEST RESUPPLY</button>
              </div>
            </div>

            {/* Grid Instability */}
            <div className="bg-[#111318] p-6 rounded-2xl border border-yellow-500/20 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded bg-yellow-900/20 flex items-center justify-center text-yellow-400">
                  <span className="material-symbols-outlined">power</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Grid Instability</h3>
                  <div className="text-[10px] text-yellow-400 font-mono tracking-widest mt-1">MONITORING</div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#0c0e13] flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl font-bold font-mono text-yellow-400">68%</span>
                    <div className="text-[8px] text-gray-500">CAPACITY</div>
                  </div>
                </div>
                <svg className="absolute w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-yellow-400" strokeDasharray="276" strokeDashoffset="88" />
                </svg>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[11px] text-gray-500 font-mono">Sector 3 substations showing abnormal load. Rolling blackouts recommended.</p>
                <button onClick={() => showToast('⚡ Rolling blackout schedule sent to grid operators')} className="mt-2 w-full text-[10px] font-mono bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black py-1.5 rounded transition font-bold">INITIATE BLACKOUT</button>
              </div>
            </div>

            {/* Report New Hazard Form */}
            <div className="xl:col-span-2 bg-[#111318] p-6 rounded-2xl border border-[#41ddc2]/20 flex flex-col">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="material-symbols-outlined text-[#41ddc2]">add_alert</span>
                LOG NEW HAZARD ZONE
              </h3>
              <div className="space-y-3 flex-1">
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">HAZARD TYPE</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-[#0c0e13] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#41ddc2]/50 outline-none">
                    {['Flood Risk', 'Fire Spread Vector', 'Chemical Plume', 'Structural Collapse', 'Civil Unrest', 'Radiation Zone'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">RISK LEVEL</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high', 'critical'].map(s => (
                      <button key={s} onClick={() => setForm({ ...form, severity: s })} className={`flex-1 text-[10px] font-mono font-bold py-1.5 rounded border transition ${form.severity === s ? 'bg-[#41ddc2] text-[#080a0e] border-[#41ddc2]' : 'border-white/10 text-gray-500 hover:border-[#41ddc2]/40'}`}>
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">ASSESSMENT NOTES</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#0c0e13] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#41ddc2]/50 outline-none resize-none" placeholder="Describe hazard conditions, impacted areas..." />
                </div>
              </div>
              <button onClick={reportHazard} disabled={reporting} className="mt-4 w-full py-3 bg-[#41ddc2] hover:bg-[#65fade] disabled:opacity-50 text-[#080a0e] font-bold text-sm rounded transition flex items-center justify-center gap-2">
                {reporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[18px]">crisis_alert</span>}
                LOG HAZARD ZONE TO DATABASE
              </button>
            </div>

            {/* System Terminal Logs */}
            <div className="xl:col-span-2 bg-[#111318] p-6 rounded-2xl border border-white/5 flex flex-col h-[340px]">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="material-symbols-outlined text-gray-500">terminal</span>
                SYSTEM LOGS
              </h3>
              <div className="bg-[#0c0e13] rounded border border-white/5 p-4 flex-1 font-mono text-[11px] space-y-2 overflow-y-auto no-scrollbar text-gray-400">
                <div className="flex gap-3"><span className="text-[#41ddc2]">[{new Date().toLocaleTimeString()}]</span> <span className="text-white">&gt; Predictive engine online... OK</span></div>
                {incidents.slice(0, 8).map((inc, i) => {
                  let timeStr = 'LIVE';
                  if (inc.createdAt) { try { timeStr = new Date(inc.createdAt).toLocaleTimeString(); } catch { } }
                  return (
                    <div key={inc.id || i} className="flex gap-3">
                      <span className={inc.severity === 'critical' ? 'text-red-400 animate-pulse' : 'text-[#41ddc2]/50'}>[{timeStr}]</span>
                      <span className={inc.severity === 'critical' ? 'text-red-400' : inc.severity === 'high' ? 'text-orange-400' : 'text-gray-300'}>
                        &gt; {inc.severity === 'critical' ? 'WARNING:' : 'LOG:'} {inc.type?.toUpperCase()} @ {inc.address}
                      </span>
                    </div>
                  );
                })}
                {zones.map((z, i) => (
                  <div key={z.id || i} className="flex gap-3">
                    <span className="text-red-400 animate-pulse">[ALERT]</span>
                    <span className="text-red-400">&gt; DANGER ZONE ACTIVE: {z.type} — {z.riskLevel} RISK</span>
                  </div>
                ))}
                <div className="flex gap-3 text-gray-700"><span className="text-[#41ddc2]/20">[STANDBY]</span><span>&gt; Awaiting telemetry...</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
