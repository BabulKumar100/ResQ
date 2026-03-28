'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navigation2, Search, MapPin, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { calculateSafeRoute, RouteOption } from '@/lib/routing-utils'
import { useMapStore } from '@/store/mapStore'
import { toast } from 'react-hot-toast'

export function RouteSelectionPanel() {
  const { dangerZones, setFlyToTarget } = useMapStore()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [options, setOptions] = useState<RouteOption[]>([])
  const [loading, setLoading] = useState(false)
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null)

  const handleRouteSearch = async () => {
    if (!from || !to) return
    setLoading(true)
    try {
      // Nominatim search India (Mocking actual coordinates for demo, but OSRM needs real coords)
      // Ideally calls lib/geocoding.ts
      const start: [number, number] = [20.5937, 78.9629] // Start India
      const end: [number, number] = [28.6139, 77.2090] // New Delhi
      
      const routes = await calculateSafeRoute(start, end, dangerZones)
      setOptions(routes)
      if (routes.length > 0) {
        setActiveRoute(routes[0])
      }
    } catch (e) {
      toast.error('Could not calculate safe route.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="fixed top-24 right-4 w-80 bg-gray-950/90 border-gray-800 text-white backdrop-blur shadow-2xl z-[1000] animate-slide-in-right">
      <CardHeader className="pb-3 border-b border-gray-800">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation2 className="w-4 h-4 text-green-500" />
            Tactical Evacuation Routing
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOptions([])} className="h-6 w-6 p-0 text-gray-500">
            <XCircle className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Origin (India only)..." 
              className="pl-9 h-9 bg-gray-900 border-gray-800 text-xs text-white"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Destination..." 
              className="pl-9 h-9 bg-gray-900 border-gray-800 text-xs text-white"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button 
            className="w-full h-9 bg-green-600 hover:bg-green-700 text-xs font-bold transition-all"
            onClick={handleRouteSearch}
            disabled={loading}
          >
            {loading ? 'Analyzing Danger Zones...' : 'Calculate Safe Path'}
          </Button>
        </div>

        {options.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Calculated Routes</h4>
            {options.map((option, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  option.type === 'safe' ? 'border-green-500/30 bg-green-500/5' : 
                  option.type === 'caution' ? 'border-amber-500/30 bg-amber-500/5' : 
                  'border-red-500/30 bg-red-500/5'
                }`}
                onClick={() => setActiveRoute(option)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {option.type === 'safe' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                     option.type === 'caution' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
                     <XCircle className="w-4 h-4 text-red-500" />}
                    <span className={`text-[11px] font-bold ${
                      option.type === 'safe' ? 'text-green-500' : 
                      option.type === 'caution' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {option.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    {(option.distance / 1000).toFixed(1)}km / {(option.duration / 60).toFixed(0)}m
                  </span>
                </div>
                {option.warning && (
                  <p className="text-[10px] text-gray-300 leading-tight flex items-center gap-1.5 line-clamp-2">
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {option.warning}
                  </p>
                )}
                <Button className={`w-full mt-3 h-8 text-[10px] font-bold ${
                  option.type === 'safe' ? 'bg-green-600 hover:bg-green-700' : 
                  option.type === 'caution' ? 'bg-amber-600' : 'bg-red-800'
                }`}>
                  Navigate Now
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
