'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, X, ChevronDown, CheckCircle2, AlertTriangle, Info, Calendar, MapPin, Gauge } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useMapStore } from '@/store/mapStore'
import { Label } from '@/components/ui/label'

const INDIA_STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 
  'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

const DISASTER_TYPES = ['All', 'Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Drought']
const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
const SOURCES = ['All', 'NDMA', 'IMD', 'USGS', 'NASA', 'Manual']

export function DisasterFilterPanel() {
  const { overlays, toggleOverlay } = useMapStore()
  const [isOpen, setIsOpen] = useState(true)
  const [filters, setFilters] = useState({ 
    date: 'Today', 
    type: 'All', 
    severity: 'All', 
    source: 'All',
    state: 'All India'
  })

  const OverlayToggle = ({ id, label, icon: Icon, color }: any) => (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500/20 transition-all shadow-sm`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <Label htmlFor={id} className="text-[10px] font-black text-gray-500 group-hover:text-white transition-all cursor-pointer uppercase tracking-widest">
          {label}
        </Label>
      </div>
      <Switch 
        id={id} 
        checked={(overlays as any)[id]} 
        onCheckedChange={() => toggleOverlay(id)}
        className="data-[state=checked]:bg-rose-500 scale-75"
      />
    </div>
  )

  const FilterSelect = ({ label, icon: Icon, value, options, onChange }: any) => (
    <div className="space-y-1.5 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
       <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
       </div>
       <select 
         value={value} 
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer appearance-none"
       >
          {options.map((opt: string) => <option key={opt} value={opt} className="bg-gray-950">{opt}</option>)}
       </select>
    </div>
  )

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-6 z-[1000] bg-gray-950/90 border border-gray-800 text-white rounded-2xl h-14 w-14 p-0 shadow-2xl hover:bg-rose-600 transition-all group"
      >
        <div className="flex flex-col items-center gap-1">
           <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
           <span className="text-[7px] font-black text-white/50">FILTER</span>
        </div>
      </Button>
    )
  }

  return (
    <Card className="fixed top-24 left-6 w-80 bg-gray-950/95 border-gray-800 text-white backdrop-blur shadow-3xl z-[1000] animate-in slide-in-from-left-4 fade-in-0 duration-500 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
      
      <CardHeader className="p-5 pb-3 border-b border-gray-900 flex flex-row items-center justify-between bg-white/5">
        <div className="flex flex-col">
           <CardTitle className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Disaster Intelligence</CardTitle>
           <div className="text-[8px] font-medium text-gray-500 font-mono tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> GRID MAPPING ACTIVE
           </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-rose-500/20 text-gray-500 hover:text-white transition-all">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
        
        {/* Real-time Overlays */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 opacity-50 flex items-center gap-2">
             <Layers className="w-3 h-3" /> TACTICAL OVERLAYS
          </h4>
          <OverlayToggle id="hazard" label="Real-time Incidents" icon={AlertTriangle} color="rose" />
          <OverlayToggle id="evacuationRoutes" label="Evacuation Routes" icon={Info} color="amber" />
          <OverlayToggle id="bhuvanFlood" label="ISRO Flood Monitor" icon={CheckCircle2} color="emerald" />
        </div>

        {/* Tactical Filters */}
        <div className="space-y-4 pt-4 border-t border-gray-900">
           <FilterSelect 
             label="Temporal Range" 
             icon={Calendar} 
             value={filters.date} 
             options={['Today', 'Last 7 days', 'Last 30 days']} 
             onChange={(v: string) => setFilters({...filters, date: v})}
           />
           <FilterSelect 
             label="Disaster Classification" 
             icon={Gauge} 
             value={filters.type} 
             options={DISASTER_TYPES} 
             onChange={(v: string) => setFilters({...filters, type: v})}
           />
           <FilterSelect 
             label="Impact Severity" 
             icon={AlertTriangle} 
             value={filters.severity} 
             options={SEVERITIES} 
             onChange={(v: string) => setFilters({...filters, severity: v})}
           />
           <FilterSelect 
             label="Deployment Region" 
             icon={MapPin} 
             value={filters.state} 
             options={INDIA_STATES} 
             onChange={(v: string) => setFilters({...filters, state: v})}
           />
        </div>

        {/* Data Source Legend */}
        <div className="pt-4 border-t border-gray-900 group">
           <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-all">
             <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-gray-800 rounded-lg"><Info className="w-3.5 h-3.5 text-gray-400" /></div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Data Stream</span>
             </div>
             <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span>NDMA Sentinel v4.2</span>
                <span className="text-emerald-500 text-[10px]">VERIFIED</span>
             </div>
           </div>
        </div>

      </CardContent>
    </Card>
  )
}

import { Layers } from 'lucide-react'
