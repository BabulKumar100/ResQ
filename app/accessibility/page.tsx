'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/Navigation'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Loader2, Navigation2, Plus } from 'lucide-react'

const ResQMap = dynamic(() => import('@/components/ResQMap').then(mod => ({ default: mod.ResQMap })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
})

interface AccessibilityRoute {
  id: string
  name: string
  description: string
  accessibility_features: string[]
  accessibility_type: string
  difficulty_level: string
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
}

export default function AccessibilityPage() {
  const { location, loading: geoLoading } = useGeolocation()
  const [routes, setRoutes] = useState<AccessibilityRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (location) {
      fetchRoutes()
    }
  }, [location])

  const fetchRoutes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/accessibility-routes')
      const data = await response.json()
      setRoutes(data)
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const markers = routes.map((route) => ({
    position: [route.start_latitude, route.start_longitude] as [number, number],
    title: route.name,
    type: 'default' as const,
    description: `${route.accessibility_type} - ${route.description}`,
  }))

  return (
    <>
      <Navigation />
      <main className="flex flex-col md:flex-row h-screen pt-16 bg-white dark:bg-[#06080c] text-gray-900 dark:text-gray-100 overflow-hidden">
        
        {/* Sidebar Panel */}
        <div className="w-full md:w-[400px] h-full flex flex-col bg-gray-50 dark:bg-[#0a0c12]/95 border-r border-gray-200 dark:border-white/5 z-10 shadow-xl overflow-hidden relative backdrop-blur-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          
          <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  <Navigation2 className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-black uppercase tracking-tight">Accessibility</h1>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white transition-all shadow-lg hover:shadow-blue-500/30"
              >
                <Plus className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`} />
              </button>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified barrier-free tactical routing</p>
          </div>

          {/* Form Overlay */}
          <div className={`transition-all duration-300 overflow-hidden ${showForm ? 'max-h-[500px] opacity-100 border-b border-gray-200 dark:border-white/5' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10">
              <h3 className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-4">Report Safe Route</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                setShowForm(false)
              }}>
                <div className="space-y-3">
                  <input type="text" placeholder="Route designator..." className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                  <input type="text" placeholder="Situation report..." className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                  <select className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition">
                    <option>Wheelchair Accessible</option>
                    <option>Blind Friendly</option>
                    <option>Low Mobility</option>
                  </select>
                  <select className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition">
                    <option>Easy Navigation</option>
                    <option>Moderate Effort</option>
                    <option>Challenging</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm uppercase tracking-widest py-3 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  Upload Vector
                </button>
              </form>
            </div>
          </div>

          {/* Routes List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-transparent">
            {routes.length === 0 ? (
              <div className="p-8 text-center text-gray-400 h-full flex flex-col items-center justify-center">
                 <Navigation2 className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" />
                 <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">No telemetry data</span>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {routes.map((route) => (
                  <div key={route.id} onClick={() => setFlyToCoords([route.start_latitude, route.start_longitude])} className="group p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all cursor-pointer hover:bg-white dark:hover:bg-black/20">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform border border-blue-200 dark:border-blue-500/20">
                        <Navigation2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate pr-2">{route.name}</h3>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase flex-shrink-0 ${
                            route.difficulty_level?.toLowerCase() === 'easy' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 
                            route.difficulty_level?.toLowerCase() === 'challenging' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                            'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          }`}>
                            {route.difficulty_level || 'Safe'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{route.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {route.accessibility_features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-semibold uppercase tracking-wider rounded border border-gray-300 dark:border-white/5">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gray-200 dark:bg-gray-900">
          {geoLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06080c] z-20">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping [animation-duration:2s]" />
                <Navigation2 className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <p className="mt-4 text-xs font-black tracking-widest text-blue-400 uppercase animate-pulse">Establishing Geolocation</p>
            </div>
          ) : (
            <Suspense fallback={
               <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
               </div>
            }>
              <ResQMap markers={markers} flyTo={flyToCoords} />
            </Suspense>
          )}

          {/* Map Overlay Gradient */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-10" />
        </div>

      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 20px; }
      `}</style>
    </>
  )
}
