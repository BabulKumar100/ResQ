'use client';

import React, { useState, useRef } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { useRealtimeSurvivors } from '@/lib/useRealtime';
import { upsertSurvivor } from '@/lib/firestoreService';
import { Loader2, QrCode, Upload, ScanLine, Printer, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import QRCode from 'react-qr-code';

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
  
  // Modals & Panels
  const [selectedSurvivor, setSelectedSurvivor] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanId, setScanId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      // Find the newly created implicitly via update or query, but here we just reset.
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleBatchImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Simulating batch import for CSV file: ${file.name}`);
      // In a real app, parse CSV and loop through upsertSurvivor
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanId.trim()) return;
    
    // Lookup matching survivor
    const found = survivors.find(s => s.qrCode?.includes(scanId) || s.id.includes(scanId));
    if (found) {
      setSelectedSurvivor(found);
      setScannerOpen(false);
      setScanId('');
    } else {
      alert('No survivor found matching this QR code / ID');
    }
  };

  return (
    <TacticalLayout>
      <div className="p-4 md:p-6 w-full h-full relative overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-black font-headline text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-tactical text-3xl">badge</span>
              SURVIVOR REGISTRY & TRACKING
            </h1>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setScannerOpen(true)}
                className="bg-surface-container shadow-xl border border-primary-tactical text-primary-tactical hover:bg-primary-tactical hover:text-surface-dim font-bold font-mono px-4 py-2 rounded transition flex items-center gap-2 text-sm"
              >
                <ScanLine className="w-4 h-4" /> SCAN ID
              </button>
              
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleBatchImport} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-surface-container-high border border-outline/30 text-on-surface hover:border-primary-tactical/50 px-4 py-2 rounded transition flex items-center gap-2 text-sm font-mono font-bold"
              >
                <Upload className="w-4 h-4" /> BATCH IMPORT (CSV)
              </button>
            </div>
          </div>

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
              <div className="glass-panel rounded-xl border border-outline/20 p-5 flex-1 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">database</span>
                    LIVE DATABASE
                  </h2>
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
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">QR REF</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">NAME & AGE</th>
                        <th className="py-3 px-4 text-[10px] font-mono text-outline font-normal border-b border-outline/20">TRIAGE</th>
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

                        const code = person.qrCode || person.id?.substring(0, 8).toUpperCase()

                        return (
                          <tr key={person.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => setSelectedSurvivor(person)}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <QrCode className="w-3 h-3 text-outline" />
                                <span className="text-primary-tactical font-bold">{code}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold">{person.name}</div>
                              <div className="text-[9px] text-outline">AGE: {person.age || 'UNK'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 border text-[10px] rounded tracking-wider font-bold ${styles.bg} ${styles.color}`}>{triage}</span>
                            </td>
                            <td className="py-3 px-4 relative">
                              <span className={triage === 'RED' ? 'animate-pulse text-error-tactical uppercase' : 'uppercase'}>{person.status}</span>
                              <div className="text-[9px] text-outline mt-0.5">{timeAgo}</div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                className="bg-surface-container border border-outline/20 text-[10px] px-2 py-1 rounded hover:bg-primary-tactical hover:text-surface-dim transition"
                                onClick={(e) => { e.stopPropagation(); setSelectedSurvivor(person); }}
                              >
                                VIEW
                              </button>
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
              <div className="glass-panel p-5 rounded-xl border border-primary-container/30 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-headline font-bold text-lg text-primary-tactical flex items-center gap-2">
                    <span className="material-symbols-outlined">person_add</span>
                    NEW MANUAL ENTRY
                  </h2>
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
                      <button onClick={() => setFormData({...formData, triage: 'YELLOW'})} className={`border border-resq-high/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'YELLOW' ? 'bg-resq-high text-surface-dim' : 'bg-resq-high/20 text-resq-high hover:bg-resq-high hover:text-surface-dim'}`}>YEL</button>
                      <button onClick={() => setFormData({...formData, triage: 'GREEN'})} className={`border border-resq-low/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'GREEN' ? 'bg-resq-low text-surface-dim' : 'bg-resq-low/20 text-resq-low hover:bg-resq-low hover:text-surface-dim'}`}>GRN</button>
                      <button onClick={() => setFormData({...formData, triage: 'BLACK'})} className={`border border-outline/50 py-2 rounded text-[10px] font-bold font-mono transition ${formData.triage === 'BLACK' ? 'bg-outline text-surface-dim' : 'bg-surface-container-high text-outline hover:bg-outline hover:text-surface-dim'}`}>BLK</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-outline font-mono block mb-1">MEDICAL NOTES</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface transition resize-none"></textarea>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <button 
                    onClick={handleLogSurvivor}
                    disabled={submitting || !formData.name}
                    className="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-tactical hover:bg-[#65fade] text-surface-dim font-bold font-headline text-sm rounded shadow-[0_0_15px_rgba(92,242,214,0.3)] hover:shadow-[0_0_20px_rgba(92,242,214,0.5)] transition flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        LOG & GENERATE QR BAND
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Additional Scanner Info */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline/10 flex items-start gap-4">
                <span className="material-symbols-outlined text-outline text-2xl">qr_code_scanner</span>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1">Field Scanner Support</h4>
                  <p className="text-xs text-outline leading-relaxed">
                    Open this page inside the ResQMap PWA on a mobile device and use the 'SCAN ID' button above to read physical wristbands directly via camera.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Survivor Details & QR Code Modal */}
      {selectedSurvivor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/90 backdrop-blur-sm">
          <div className="bg-surface-container-low border border-outline/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            <div className="bg-surface-container p-4 border-b border-outline/20 flex justify-between items-center">
              <h3 className="text-lg font-bold font-headline text-on-surface flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary-tactical" />
                SURVIVOR ID: {selectedSurvivor.qrCode || selectedSurvivor.id?.substring(0, 8).toUpperCase()}
              </h3>
              <button 
                onClick={() => setSelectedSurvivor(null)} 
                className="text-outline hover:text-error-tactical transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              
              {/* QR display section */}
              <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl shrink-0">
                <QRCode 
                  value={selectedSurvivor.qrCode || selectedSurvivor.id} 
                  size={140}
                  level="Q"
                />
                <div className="text-surface-dim font-mono font-bold text-[10px] text-center w-full bg-gray-100 py-1 rounded">
                  {selectedSurvivor.qrCode || selectedSurvivor.id?.substring(0,8)}
                </div>
              </div>

              {/* Data section */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-outline block mb-0.5">FULL NAME</label>
                  <div className="text-sm font-bold text-on-surface">{selectedSurvivor.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-outline block mb-0.5">AGE</label>
                    <div className="text-sm font-bold text-on-surface">{selectedSurvivor.age || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-outline block mb-0.5">STATUS</label>
                    <div className="text-sm font-bold text-on-surface uppercase">{selectedSurvivor.status}</div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-outline block mb-0.5">NOTES / TRIAGE</label>
                  <div className="text-xs text-on-surface bg-surface-container p-2 rounded border border-outline/10 min-h-[60px]">
                    {selectedSurvivor.notes || 'No specific notes logged.'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container p-4 border-t border-outline/20 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedSurvivor(null)}
                className="px-4 py-2 rounded border border-outline/30 text-xs font-bold text-outline hover:bg-surface-container-high transition"
              >
                CLOSE
              </button>
              <button 
                className="px-4 py-2 rounded bg-primary-tactical hover:opacity-90 text-surface-dim text-xs font-bold flex items-center gap-2 shadow-lg transition"
                onClick={() => alert(`Printing QR Wristband logic for ${selectedSurvivor.qrCode}...`)}
              >
                <Printer className="w-4 h-4" /> PRINT WRISTBAND
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/90 backdrop-blur-sm">
          <div className="bg-surface-container-low border border-primary-tactical/30 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(92,242,214,0.1)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline/20 flex justify-between items-center bg-surface-container">
              <h3 className="text-sm font-bold font-mono text-on-surface flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-primary-tactical" />
                SCAN ID OR MANUAL ENTRY
              </h3>
              <button 
                onClick={() => setScannerOpen(false)} 
                className="text-outline hover:text-error-tactical transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleScan} className="p-6">
              <div className="bg-surface-container border-2 border-dashed border-outline/30 h-40 rounded-xl mb-6 flex flex-col items-center justify-center gap-2">
                <ScanLine className="w-10 h-10 text-outline opacity-50" />
                <span className="text-xs font-mono text-outline text-center px-4">
                  Camera API restricted in standard browser.<br/>Use text entry below for test lookup.
                </span>
              </div>
              
              <label className="text-[10px] font-mono text-outline block mb-1">ENTER QR CODE ID</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={scanId}
                  onChange={e => setScanId(e.target.value)}
                  className="flex-1 bg-surface-container border border-outline/20 focus:border-primary-tactical/50 outline-none rounded p-2 text-sm text-on-surface uppercase font-mono" 
                  placeholder="e.g. SV-XXXXXX" 
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!scanId.trim()}
                  className="bg-primary-tactical text-surface-dim disabled:opacity-50 px-4 py-2 rounded font-bold font-mono text-xs hover:opacity-90"
                >
                  LOOKUP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </TacticalLayout>
  );
}
