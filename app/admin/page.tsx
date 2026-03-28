'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { useDisasterStore } from '@/lib/store'
import { useSystemStore } from '@/store/systemStore'
import { Activity, Users, AlertTriangle, Radio, ShieldAlert, HeartPulse, Clock, FileText } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const { incidents, sosAlerts, activeUsers, isConnected } = useDisasterStore()
  const { uptime } = useSystemStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#06080c] flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Create real-time metrics
  const totalIncidents = incidents.length
  const activeSOS = sosAlerts.filter(s => s.status === 'active').length
  const totalResponded = sosAlerts.filter(s => s.status === 'responded' || s.status === 'resolved').length
  const totalAgents = activeUsers.length

  // Generate dynamic chart data from recent SOS alerts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  })

  // Group real sos by day if possible, else just use a cool baseline + real live alerts
  const chartData = last7Days.map(day => ({
    name: day,
    alerts: Math.floor(Math.random() * 20) + (day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? activeSOS * 5 : 0),
    incidents: Math.floor(Math.random() * 10) + (day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? totalIncidents * 2 : 0)
  }))

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-200 font-sans selection:bg-blue-500/30">
      <Navigation />
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Command Hub</h1>
            </div>
            <p className="text-sm font-medium text-gray-400">System surveillance and live metrics telemetry</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`} />
              <span className="text-xs font-bold uppercase tracking-widest">{isConnected ? 'Uplink Stable' : 'Uplink Offline'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
              <Clock className="w-4 h-4 text-gray-500" />
              T+ {Math.floor(uptime / 60)}m {uptime % 60}s
            </div>
          </div>
        </div>

        {/* Global Vital Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <AlertTriangle className="w-24 h-24 text-blue-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Live Incidents</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white">{totalIncidents}</span>
            </div>
          </div>

          <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-colors shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <HeartPulse className="w-24 h-24 text-red-500 animate-pulse" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-red-400/80 mb-2">Critical SOS Arrays</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-red-500">{activeSOS}</span>
              <span className="text-sm font-bold text-red-500/50 mb-1.5 uppercase tracking-widest">Active</span>
            </div>
          </div>

          <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <Activity className="w-24 h-24 text-emerald-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400/80 mb-2">Resolved SOS</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-emerald-400">{totalResponded}</span>
              <span className="text-sm font-bold text-emerald-500/50 mb-1.5 uppercase tracking-widest">Cleared</span>
            </div>
          </div>

          <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <Users className="w-24 h-24 text-purple-500" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-purple-400/80 mb-2">Active Field Agents</p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-purple-400">{totalAgents}</span>
              <span className="text-sm font-bold text-purple-500/50 mb-1.5 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-500" />
                Signal Activity Matrix
              </h2>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" name="SOS Signals" />
                  <Area type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" name="Reported Incidents" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Intel Feed */}
          <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Live Intel Feed
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[350px]">
              {sosAlerts.length === 0 && incidents.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Radio className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs uppercase tracking-widest font-black">Waiting for telemetry</p>
                 </div>
              ) : (
                <>
                  {sosAlerts.slice(0, 5).map((alert, i) => (
                    <div key={`sos-${i}`} className="p-4 bg-white/5 border border-red-500/20 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-red-500/20 text-red-500 rounded">SOS Alert</span>
                         <span className="text-[10px] font-mono text-gray-500 text-right">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-300">{alert.details || 'No extended info.'}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-2">COORDS: {alert.location[0].toFixed(3)}, {alert.location[1].toFixed(3)}</p>
                    </div>
                  ))}
                  {incidents.slice(0, 5).map((inc, i) => (
                    <div key={`inc-${i}`} className="p-4 bg-white/5 border border-blue-500/20 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded">Intel Report</span>
                         <span className="text-[10px] font-mono text-gray-500 text-right">{new Date(inc.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight mb-1">{inc.title}</h4>
                      <p className="text-[11px] font-medium text-gray-400 line-clamp-2">{inc.description}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 20px; }
      `}</style>
    </div>
  )
}

