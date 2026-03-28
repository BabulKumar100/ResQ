'use client';

import React, { useState, useEffect } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import { Brain, AlertTriangle, TrendingUp, RefreshCw, ChevronRight, Zap } from 'lucide-react';

interface RiskZone {
  id: string;
  region: string;
  state: string;
  type: 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'FIRE' | 'LANDSLIDE';
  confidence: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  window: string;
  lat: number;
  lng: number;
  population: number;
  lastUpdated: string;
}

const MOCK_ZONES: RiskZone[] = [
  { id: 'rz1', region: 'Coastal Odisha', state: 'Odisha', type: 'CYCLONE', confidence: 94, severity: 'CRITICAL', window: 'Next 6–12 hours', lat: 20.94, lng: 85.09, population: 420000, lastUpdated: '2 min ago' },
  { id: 'rz2', region: 'Brahmaputra Valley', state: 'Assam', type: 'FLOOD', confidence: 87, severity: 'HIGH', window: 'Next 24 hours', lat: 26.14, lng: 91.73, population: 890000, lastUpdated: '8 min ago' },
  { id: 'rz3', region: 'Uttarkashi', state: 'Uttarakhand', type: 'LANDSLIDE', confidence: 72, severity: 'HIGH', window: 'Next 48 hours', lat: 30.72, lng: 78.44, population: 95000, lastUpdated: '14 min ago' },
  { id: 'rz4', region: 'Kutch District', state: 'Gujarat', type: 'EARTHQUAKE', confidence: 61, severity: 'MEDIUM', window: 'Next 72 hours', lat: 23.25, lng: 69.53, population: 310000, lastUpdated: '30 min ago' },
  { id: 'rz5', region: 'Wayanad Hills', state: 'Kerala', type: 'FIRE', confidence: 79, severity: 'HIGH', window: 'Next 18 hours', lat: 11.60, lng: 76.13, population: 52000, lastUpdated: '5 min ago' },
  { id: 'rz6', region: 'Sundarbans Delta', state: 'West Bengal', type: 'FLOOD', confidence: 55, severity: 'MEDIUM', window: 'Next 96 hours', lat: 21.94, lng: 89.18, population: 760000, lastUpdated: '1 hr ago' },
];

const TYPE_COLORS: Record<string, string> = {
  CYCLONE: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  FLOOD: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  LANDSLIDE: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  EARTHQUAKE: 'text-red-400 bg-red-400/10 border-red-400/30',
  FIRE: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

const SEV_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-400/10 border-red-500/50',
  HIGH: 'text-orange-400 bg-orange-400/10 border-orange-500/30',
  MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
  LOW: 'text-green-400 bg-green-400/10 border-green-500/30',
};

export default function PredictionPage() {
  const [zones, setZones] = useState<RiskZone[]>(MOCK_ZONES);
  const [selected, setSelected] = useState<RiskZone | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modelRunning, setModelRunning] = useState(false);
  const [lastRun, setLastRun] = useState('Today, 03:45 IST');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setZones(MOCK_ZONES.map(z => ({ ...z, confidence: Math.max(40, Math.min(99, z.confidence + Math.floor((Math.random() - 0.5) * 10))) })));
      setRefreshing(false);
    }, 1500);
  };

  const runModel = () => {
    setModelRunning(true);
    setTimeout(() => {
      setModelRunning(false);
      setLastRun('Just now');
    }, 4000);
  };

  const criticalCount = zones.filter(z => z.severity === 'CRITICAL').length;
  const highCount = zones.filter(z => z.severity === 'HIGH').length;
  const avgConfidence = Math.round(zones.reduce((s, z) => s + z.confidence, 0) / zones.length);

  return (
    <TacticalLayout>
      <div className="p-4 md:p-6 overflow-y-auto h-full">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <Brain className="w-7 h-7 text-primary-tactical" />
                AI INCIDENT PREDICTION
              </h1>
              <p className="text-xs text-outline font-mono mt-1">ML Risk Model · Powered by PostGIS + Historical NDMA Data · Last run: {lastRun}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline/20 text-on-surface rounded-lg text-sm font-bold font-mono hover:border-primary-tactical/50 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                REFRESH DATA
              </button>
              <button
                onClick={runModel}
                disabled={modelRunning}
                className="flex items-center gap-2 px-4 py-2 bg-primary-tactical text-surface-dim rounded-lg text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                <Zap className={`w-4 h-4 ${modelRunning ? 'animate-pulse' : ''}`} />
                {modelRunning ? 'RUNNING MODEL...' : 'RUN PREDICTION'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'RISK ZONES', value: zones.length, icon: 'crisis_alert', color: 'text-primary-tactical' },
              { label: 'CRITICAL', value: criticalCount, icon: 'emergency', color: 'text-error-tactical', pulse: true },
              { label: 'HIGH RISK', value: highCount, icon: 'warning', color: 'text-resq-high' },
              { label: 'AVG CONFIDENCE', value: `${avgConfidence}%`, icon: 'percent', color: 'text-resq-low' },
            ].map((s, i) => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-outline/20 flex items-center justify-between hover:border-primary-tactical/30 transition">
                <div>
                  <div className="text-2xl font-black font-mono text-on-surface">{s.value}</div>
                  <div className="text-[10px] text-outline font-mono tracking-widest mt-1">{s.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-full bg-surface-container flex items-center justify-center ${s.pulse ? 'animate-pulse' : ''}`}>
                  <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Risk Zone List */}
            <div className="xl:col-span-2 glass-panel rounded-xl border border-outline/20 p-5">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-tactical" />
                PREDICTED RISK ZONES
              </h2>
              <div className="space-y-3">
                {zones.sort((a, b) => b.confidence - a.confidence).map(zone => (
                  <div
                    key={zone.id}
                    onClick={() => setSelected(zone)}
                    className={`p-4 rounded-xl border cursor-pointer transition hover:border-primary-tactical/30 hover:bg-surface-container ${selected?.id === zone.id ? 'border-primary-tactical/50 bg-primary-tactical/5' : 'border-outline/15 bg-surface-container-low'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${TYPE_COLORS[zone.type]}`}>{zone.type}</span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${SEV_COLORS[zone.severity]}`}>{zone.severity}</span>
                          <span className="text-[10px] text-outline font-mono">{zone.lastUpdated}</span>
                        </div>
                        <div className="font-black text-on-surface">{zone.region}</div>
                        <div className="text-xs text-outline font-mono">{zone.state} · Pop: {zone.population.toLocaleString()} · {zone.window}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="text-2xl font-black font-mono text-primary-tactical">{zone.confidence}%</div>
                        <div className="text-[9px] text-outline font-mono">CONFIDENCE</div>
                        <ChevronRight className="w-4 h-4 text-outline mt-1" />
                      </div>
                    </div>
                    {/* Confidence Bar */}
                    <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${zone.confidence > 80 ? 'bg-error-tactical' : zone.confidence > 60 ? 'bg-resq-high' : 'bg-resq-low'}`}
                        style={{ width: `${zone.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="xl:col-span-1 glass-panel rounded-xl border border-outline/20 p-5 flex flex-col">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-resq-high" />
                ZONE DETAIL
              </h2>

              {!selected ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-outline">
                  <span className="material-symbols-outlined text-5xl opacity-20">touch_app</span>
                  <p className="text-xs font-mono">SELECT A RISK ZONE FROM THE LIST TO VIEW ML ANALYSIS</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  <div className={`p-3 rounded-lg border ${SEV_COLORS[selected.severity]}`}>
                    <div className="text-xs font-bold">{selected.severity} RISK</div>
                    <div className="text-lg font-black">{selected.region}</div>
                    <div className="text-[11px] opacity-80">{selected.state}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'HAZARD TYPE', value: selected.type },
                      { label: 'CONFIDENCE', value: `${selected.confidence}%` },
                      { label: 'TIME WINDOW', value: selected.window },
                      { label: 'POPULATION AT RISK', value: selected.population.toLocaleString() },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface-container p-3 rounded-lg border border-outline/10">
                        <div className="text-[9px] text-outline font-mono mb-1">{item.label}</div>
                        <div className="text-xs font-bold text-on-surface">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-container p-3 rounded-lg border border-outline/10">
                    <div className="text-[9px] text-outline font-mono mb-2">MODEL INPUTS</div>
                    <ul className="space-y-1 text-xs text-on-surface font-mono">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-tactical" />Historical NDMA events (7y)</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-tactical" />IMD weather forecast</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-tactical" />CWC river gauge levels</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-tactical" />USGS seismic telemetry</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-tactical" />Population density grid</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-error-tactical/10 border border-error-tactical/30 text-error-tactical text-xs font-bold rounded-lg hover:bg-error-tactical hover:text-white transition font-mono">
                      DISPATCH PREEMPTIVE
                    </button>
                    <button className="flex-1 py-2 bg-surface-container border border-outline/20 text-outline text-xs font-bold rounded-lg hover:border-primary-tactical/40 transition font-mono">
                      SHARE ALERT
                    </button>
                  </div>
                </div>
              )}

              {/* Model Info */}
              <div className="mt-4 pt-4 border-t border-outline/10">
                <div className="text-[9px] text-outline font-mono mb-2">MODEL INFO</div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-outline font-mono">
                  <span>ENGINE: XGBoost v2.1</span>
                  <span>ACC: 89.4%</span>
                  <span>RETRAIN: Daily 02:00 IST</span>
                  <span>DATASET: 2.1M events</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </TacticalLayout>
  );
}
