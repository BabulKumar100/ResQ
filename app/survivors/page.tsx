'use client';

import React, { useState } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeSurvivors } from '@/lib/useRealtime';
import { upsertSurvivor } from '@/lib/firestoreService';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SurvivorsPage() {
  const { survivors, loading } = useRealtimeSurvivors();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'MALE',
    triage: 'RED',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  const getTriageStyles = (triage: string) => {
    switch(triage) {
      case 'RED': return { color: 'text-error-tactical', bg: 'bg-error-container/20 border-error-tactical/50' };
      case 'YELLOW': return { color: 'text-resq-high', bg: 'bg-resq-high/20 border-resq-high/50' };
      case 'GREEN': return { color: 'text-resq-low', bg: 'bg-resq-low/20 border-resq-low/50' };
      case 'BLACK': return { color: 'text-outline', bg: 'bg-surface-container-high border-outline/50' };
      default: return { color: 'text-on-surface', bg: 'bg-surface-container border-outline' };
    }
  };

  const handleLogSurvivor = async () => {
    if (!formData.name) return;
    setSubmitting(true);
    try {
      const qrCode = `SV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await upsertSurvivor(qrCode, {
        name: formData.name,
        age: parseInt(formData.age) || 0,
        status: formData.triage === 'GREEN' ? 'rescued' : formData.triage === 'BLACK' ? 'found' : 'injured',
        lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock coords for now
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        notes: `Gender: ${formData.gender}. Triage: ${formData.triage}. ${formData.notes}`,
      });
      setFormData({ name: '', age: '', gender: 'MALE', triage: 'RED', notes: '' });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <TacticalLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Top Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TOTAL LOGGED', value: survivors.length.toString(), icon: 'how_to_reg', color: 'text-primary-tactical' },
              { label: 'CRITICAL (RED)', value: survivors.filter(s => s.notes?.includes('Triage: RED')).length.toString(), icon: 'emergency', color: 'text-error-tactical', animate: true },
              { label: 'AWAITING EXTRACT', value: survivors.filter(s => s.status === 'injured').length.toString(), icon: 'transfer_within_a_station', color: 'text-resq-high' },
              { label: 'SAFE ZONES', value: survivors.filter(s => s.status === 'rescued').length.toString(), icon: 'health_and_safety', color: 'text-resq-low' },
            ].map((metric, i) => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-on-tertiary-container/30 flex items-center justify-between group hover:border-primary-tactical/50 transition-colors cursor-default">
                <div>
                  <div className="text-2xl font-bold font-mono text-on-surface">{metric.value}</div>
                  <div className="text-[10px] text-outline font-mono mt-1 tracking-wider">{metric.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-full bg-surface-container flex items-center justify-center ${metric.animate ? 'animate-pulse' : ''} group-hover:bg-surface-container-high transition-colors`}>
                  <span className={`material-symbols-outlined ${metric.color} text-2xl`}>{metric.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left col: Survivor Database */}
            <div className="xl:col-span-2 space-y-6 flex flex-col h-[700px]">
              <div className="glass-panel rounded-xl border border-outline/20 p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-tactical">badge</span>
                    REGISTRY DATABASE
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                      <input type="text" placeholder="Search ID, Name..." className="bg-surface-container-low border border-outline/20 rounded pl-9 pr-4 py-1.5 text-xs text-on-surface focus:border-primary-tactical/50 outline-none w-64 font-mono font-bold" />
                    </div>
                    <button className="bg-surface-container-low hover:bg-surface-container border border-outline/20 p-1.5 rounded text-outline hover:text-primary-tactical transition">
                      <span className="material-symbols-outlined text-lg">filter_list</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 no-scrollbar relative min-h-[200px]">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-dim/50 z-20">
                      <Loader2 className="animate-spin text-primary-tactical" />
                    </div>
                  )}
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-dim z-10">
                      <tr>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">ID REF</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">NAME & AGE</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">TRIAGE</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">LOCATION</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">STATUS</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/10 text-xs text-on-surface font-mono">
                      {survivors.map((person) => {
                        let triageMatch = person.notes?.match(/Triage: (RED|YELLOW|GREEN|BLACK)/);
                        let triage = triageMatch ? triageMatch[1] : 'YELLOW';
                        const styles = getTriageStyles(triage);
                        
                        let timeAgo = '';
                        if (person.updatedAt) {
                           const date = (person.updatedAt as any).toDate ? (person.updatedAt as any).toDate() : new Date(person.updatedAt as any);
                           try { timeAgo = formatDistanceToNow(date, { addSuffix: true }).toUpperCase(); } catch (e) { timeAgo = 'JUST NOW'; }
                        }

                        return (
                          <tr key={person.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                            <td className="py-3 px-4 text-primary-tactical font-bold">{person.qrCode || person.id?.substring(0, 8).toUpperCase()}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold">{person.name}</div>
                              <div className="text-[9px] text-outline">AGE: {person.age || 'UNK'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 border text-[10px] rounded tracking-wider font-bold ${styles.bg} ${styles.color}`}>{triage}</span>
                            </td>
                            <td className="py-3 px-4"><span className="text-[10px] text-outline truncate block max-w-[80px]">{person.lat?.toFixed(3)}, {person.lng?.toFixed(3)}</span></td>
                            <td className="py-3 px-4 relative">
                              <span className={triage === 'RED' ? 'animate-pulse text-error-tactical uppercase' : 'uppercase'}>{person.status}</span>
                              <div className="text-[9px] text-outline mt-0.5">{timeAgo}</div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="material-symbols-outlined text-outline group-hover:text-primary-tactical transition">more_horiz</button>
                            </td>
                          </tr>
                        )
                      })}
                      {!loading && survivors.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-outline opacity-50 font-mono text-xs">NO SURVIVOR RECORDS FOUND IN DB</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right col: Registration Interface */}
            <div className="xl:col-span-1 space-y-6">
              <div className="glass-panel p-5 rounded-xl border border-primary-container/30 h-full flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-headline font-bold text-lg text-primary-tactical flex items-center gap-2">
                    <span className="material-symbols-outlined">person_add</span>
                    NEW LOG
                  </h2>
                  <div className="px-2 py-1 bg-surface-container-low border border-outline/20 text-[10px] font-mono text-outline rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
                    SCAN ID
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-[10px] text-outline font-mono block mb-1">FULL NAME / DESC</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface transition" placeholder="e.g. John Doe / Adult Male..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-outline font-mono block mb-1">AGE</label>
                      <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface transition" placeholder="Est." />
                    </div>
                    <div>
                      <label className="text-[10px] text-outline font-mono block mb-1">GENDER</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface transition appearance-none cursor-pointer">
                        <option>MALE</option>
                        <option>FEMALE</option>
                        <option>OTHER</option>
                        <option>UNKNOWN</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-outline font-mono block mb-1">TRIAGE CLASSIFICATION</label>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => setFormData({...formData, triage: 'RED'})} className={`border border-error-tactical/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'RED' ? 'bg-error-tactical text-surface-dim' : 'bg-error-container/20 text-error-tactical hover:bg-error-tactical hover:text-surface-dim'}`}>RED</button>
                      <button onClick={() => setFormData({...formData, triage: 'YELLOW'})} className={`border border-resq-high/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'YELLOW' ? 'bg-resq-high text-surface-dim' : 'bg-resq-high/20 text-resq-high hover:bg-resq-high hover:text-surface-dim'}`}>YELLOW</button>
                      <button onClick={() => setFormData({...formData, triage: 'GREEN'})} className={`border border-resq-low/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'GREEN' ? 'bg-resq-low text-surface-dim' : 'bg-resq-low/20 text-resq-low hover:bg-resq-low hover:text-surface-dim'}`}>GREEN</button>
                      <button onClick={() => setFormData({...formData, triage: 'BLACK'})} className={`border border-outline/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'BLACK' ? 'bg-outline text-surface-dim' : 'bg-surface-container-high text-outline hover:bg-outline hover:text-surface-dim'}`}>BLACK</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-outline font-mono block mb-1">MEDICAL NOTES</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface transition resize-none"></textarea>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline/10 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-outline-variant text-[40px]">qr_code_2</span>
                    <span className="text-[10px] text-outline font-mono tracking-widest text-center mt-2">QR ID AUTO-GENERATED<br/>ON SUBMIT</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogSurvivor}
                  disabled={submitting || !formData.name}
                  className="mt-6 w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-tactical hover:bg-[#65fade] text-surface-dim font-bold font-headline text-sm rounded shadow-[0_0_15px_rgba(92,242,214,0.3)] hover:shadow-[0_0_20px_rgba(92,242,214,0.5)] transition flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      LOG SURVIVOR ENTRY
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
