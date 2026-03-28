'use client'

import { useState, useEffect } from 'react'
import { Heart, AlertCircle, CheckCircle, Send, MapPin, Phone } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { useDisasterStore } from '@/lib/store'

export default function SOSPage() {
  const [isClient, setIsClient] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([''])
  const [emergencyType, setEmergencyType] = useState('medical')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('high')
  const [submitted, setSubmitted] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  
  const { isConnected, sosAlerts, connect, sendSOS } = useDisasterStore()

  useEffect(() => {
    setIsClient(true)
    // Get user location
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
      })
    }
  }, [])

  useEffect(() => {
    if (isClient && !isConnected) {
      connect('user_sos_' + Math.random().toString(36).substr(2, 9), 'SOS User', 'survivor', userLocation || [40.7128, -74.006])
    }
  }, [isClient, isConnected, connect, userLocation])

  const handleSubmitSOS = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userLocation) {
      alert('Location not available')
      return
    }

    sendSOS(userLocation, severity, description)
    setSubmitted(true)
    setShowForm(false)
    setDescription('')
    setSeverity('high')
    setEmergencyType('medical')
    setEmergencyContacts([''])
    
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  if (!isClient) return null
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-[#06080c] text-gray-900 dark:text-gray-100 font-sans selection:bg-red-500/30">
        
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 dark:bg-red-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-900/10 blur-[120px] rounded-full" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold tracking-widest uppercase mb-6 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Emergency Grid
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">SOS Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Instantly broadcast your location and emergency type to nearby responders and personal contacts in real-time.
          </p>
        </section>

        {/* Success Message overlay */}
        {submitted && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500/50 backdrop-blur-xl rounded-2xl flex items-center gap-4 shadow-2xl shadow-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-emerald-900 dark:text-emerald-100">SOS BROADCAST LIVE</p>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/80 mt-0.5">Responders are acquiring your beacon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Dashboard */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SOS Dispatch Terminal */}
            <div className="lg:col-span-5 w-full">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full relative group rounded-3xl overflow-hidden aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px] flex flex-col items-center justify-center p-8 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 bg-white dark:bg-[#0a0c12]/80 border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl hover:shadow-red-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent dark:from-red-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-red-50 dark:bg-bg-[#06080c] border border-red-100 dark:border-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:bg-red-100 dark:group-hover:bg-red-500/10 transition-colors">
                    {/* Ripple effects */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping [animation-duration:3s]" />
                    <div className="absolute inset-4 rounded-full border-2 border-red-500/40 animate-ping [animation-duration:3s] [animation-delay:0.5s]" />
                    
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)] flex items-center justify-center">
                      <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Initialize SOS</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Tap to configure alert beacon</p>
                </button>
              ) : (
                <div className="bg-white dark:bg-[#0a0c12]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-500" /> Alert Config
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition">CANCEL</button>
                  </div>

                  <form onSubmit={handleSubmitSOS} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Emergency Type</label>
                        <select
                          value={emergencyType}
                          onChange={(e) => setEmergencyType(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        >
                          <option value="medical">Medical Core</option>
                          <option value="accident">Severe Accident</option>
                          <option value="fire">Fire Hazard</option>
                          <option value="police">Security Threat</option>
                          <option value="disaster">Natural Disaster</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Severity</label>
                        <div className="flex bg-gray-50 dark:bg-black/50 p-1 rounded-xl border border-gray-200 dark:border-white/10 h-[46px]">
                          {['low', 'medium', 'high'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setSeverity(level)}
                              className={`flex-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                severity === level
                                  ? level === 'high' ? 'bg-red-500 text-white shadow-md' : level === 'medium' ? 'bg-orange-500 text-white shadow-md' : 'bg-yellow-500 text-white shadow-md'
                                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Situation Log</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly detail the scenario..."
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium h-24 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {userLocation && (
                      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><MapPin className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-0.5">GPS Beacon Locked</p>
                          <p className="text-sm font-mono text-blue-600 dark:text-blue-400 opacity-80">{userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-lg tracking-widest uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                      Broadcast SOS <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Realtime SOS Feed */}
            <div className="lg:col-span-7 w-full h-full">
              <div className="bg-white dark:bg-[#0a0c12]/50 border border-gray-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 h-[600px] flex flex-col shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Live Network</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Real-time distress signals within your perimeter</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Connected
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {sosAlerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-gray-300 tracking-widest uppercase text-sm mb-2">No Active Signals</p>
                      <p className="text-sm text-gray-500 font-medium">Monitoring local frequencies for incoming distress calls.</p>
                    </div>
                  ) : (
                    sosAlerts.map((alert, idx) => (
                      <div key={alert.id || idx} className="group p-5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl hover:border-red-300 dark:hover:border-red-500/50 transition-all hover:bg-white dark:hover:bg-[#0a0c12] hover:shadow-lg">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-4">
                            <div className="mt-1 flex-shrink-0 relative">
                              <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${alert.urgency === 'high' ? 'bg-red-500' : alert.urgency === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                              <div className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-white/10">
                                <Heart className={`w-5 h-5 ${alert.urgency === 'high' ? 'text-red-500 fill-red-500' : 'text-orange-500'}`} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Distress Signal</h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase ${
                                  alert.urgency === 'high' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 
                                  alert.urgency === 'medium' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' : 
                                  'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                }`}>
                                  {alert.urgency}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">{alert.details || 'No additional telemetry provided.'}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className="flex items-center gap-1.5 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {alert.location[0].toFixed(3)}, {alert.location[1].toFixed(3)}
                                </span>
                                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase ${
                            alert.status === 'active' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 animate-pulse' : 
                            'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {alert.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 20px; }
      `}</style>
    </>
  )
}
