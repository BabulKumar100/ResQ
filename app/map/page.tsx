'use client';

import React, { useState, useEffect } from 'react';
import { TacticalLayout } from '@/components/ui/TacticalLayout';
import dynamic from 'next/dynamic';
import { Loader2, Navigation2, ShieldAlert, Globe, Compass, Layers } from 'lucide-react';
import { useMapStore } from '@/store/mapStore';
import { useIncidentStore } from '@/store/incidentStore';
import { useDroneStore } from '@/store/droneStore';
import { DisasterFilterPanel } from '@/components/map/DisasterFilterPanel';
import { RouteSelectionPanel } from '@/components/map/RouteSelectionPanel';
import { BottomSheet, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetTrigger } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const TacticalMap = dynamic(() => import('@/components/map/TacticalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#06080c] flex flex-col items-center justify-center gap-4 text-rose-500/50">
      <div className="relative">
         <Loader2 className="animate-spin w-12 h-12 text-rose-600" />
         <div className="absolute inset-0 bg-rose-500/10 blur-xl animate-pulse" />
      </div>
      <div className="flex flex-col items-center">
         <span className="text-[10px] font-black tracking-[0.3em] font-mono animate-pulse uppercase">Initializing Tactical Index</span>
         <span className="text-[8px] font-bold text-gray-600 uppercase mt-1">Connecting to NDMA Sentinel Cluster...</span>
      </div>
    </div>
  ),
});

export default function EmergencyMapPage() {
  const { incidents, activeIncidentId, setActiveIncidentId } = useIncidentStore();
  const { drones } = useDroneStore();
  const { setFlyToTarget, mouseLatLng, overlays, toggleOverlay } = useMapStore();
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeIncident = incidents.find(i => i.id === activeIncidentId);

  return (
    <TacticalLayout>
      <div className="relative w-full h-full overflow-hidden bg-[#06080c]">
        
        {/* The Map Engine */}
        <div className="absolute inset-0 z-0">
          <TacticalMap />
        </div>

        {/* Global Tactical Overlays (Desktop) */}
        {!isMobile && (
          <>
            <DisasterFilterPanel />
            {showRoutePanel && <RouteSelectionPanel />}
            
            {/* Legend / Status Overlay */}
            <div className="absolute bottom-12 left-6 pointer-events-none z-10 transition-all">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="p-5 bg-gray-950/90 border border-gray-800 rounded-[2rem] backdrop-blur-xl shadow-3xl flex flex-col gap-3 min-w-[200px]"
               >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><Compass className="w-4 h-4"/></div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Region Ready</span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest font-mono">India Sector Alpha</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                     <div className="bg-white/5 p-2 rounded-xl flex flex-col">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Grid LAT</span>
                        <span className="text-[10px] font-mono font-black text-white">{mouseLatLng?.lat?.toFixed(4) || '20.5937'}°N</span>
                     </div>
                     <div className="bg-white/5 p-2 rounded-xl flex flex-col">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Grid LNG</span>
                        <span className="text-[10px] font-mono font-black text-white">{mouseLatLng?.lng?.toFixed(4) || '78.9629'}°E</span>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Tactical Actions (Floating Right) */}
            <div className="absolute top-24 right-6 flex flex-col gap-3 z-10">
               <Button 
                 onClick={() => setShowRoutePanel(!showRoutePanel)}
                 className={`h-14 w-14 rounded-2xl shadow-2xl transition-all ${
                   showRoutePanel ? 'bg-rose-600 text-white scale-110' : 'bg-gray-950/90 border border-gray-800 text-rose-500 hover:bg-rose-500/10'
                 }`}
               >
                  <Navigation2 className="w-6 h-6" />
               </Button>
               <Button 
                  className="h-14 w-14 rounded-2xl bg-gray-950/90 border border-gray-800 text-amber-500 shadow-2xl hover:bg-amber-500/10 transition-all"
                  onClick={() => toggleOverlay('evacuationRoutes')}
               >
                  <ShieldAlert className="w-6 h-6" />
               </Button>
            </div>
          </>
        )}

        {/* Mobile-Only Dashboard (Fix 8) */}
        {isMobile && (
          <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-center gap-3 z-50">
             <BottomSheet>
                <BottomSheetTrigger asChild>
                   <Button className="flex-1 h-14 bg-gray-950/90 border border-gray-800 rounded-2xl backdrop-blur-xl text-xs font-black uppercase tracking-widest text-white gap-2 shadow-2xl">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Tactical Overlays
                   </Button>
                </BottomSheetTrigger>
                <BottomSheetContent>
                   <BottomSheetHeader>
                      <BottomSheetTitle className="text-xl font-black uppercase tracking-widest text-white italic">Overlay Hub</BottomSheetTitle>
                   </BottomSheetHeader>
                   <div className="pb-8">
                      <DisasterFilterPanel />
                   </div>
                </BottomSheetContent>
             </BottomSheet>
             
             <BottomSheet>
                <BottomSheetTrigger asChild>
                   <Button className="w-14 h-14 bg-rose-600 rounded-2xl shadow-xl shadow-rose-900/40 text-white">
                      <Navigation2 className="w-6 h-6" />
                   </Button>
                </BottomSheetTrigger>
                <BottomSheetContent>
                    <BottomSheetHeader>
                      <BottomSheetTitle className="text-xl font-black uppercase tracking-widest text-white italic">Strategic Routing</BottomSheetTitle>
                   </BottomSheetHeader>
                   <div className="pb-8">
                      <RouteSelectionPanel />
                   </div>
                </BottomSheetContent>
             </BottomSheet>
          </div>
        )}

        {/* Incident Detail Card (Desktop Overlay) */}
        <AnimatePresence>
          {activeIncident && !isMobile && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, x: 20 }}
               animate={{ opacity: 1, scale: 1, x: 0 }}
               exit={{ opacity: 0, scale: 0.9, x: 20 }}
               className="absolute right-6 top-44 w-80 bg-gray-950/95 border border-gray-800 rounded-[2.5rem] shadow-3xl backdrop-blur-2xl z-20 overflow-hidden"
            >
               <div className="p-1">
                  <div className="relative w-full h-32 rounded-[2rem] overflow-hidden bg-gray-900">
                     <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />
                     <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
                     <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Overwatch Alpha</span>
                     </div>
                  </div>
               </div>
               <div className="p-6 pt-2">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">{activeIncident.type}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{activeIncident.address}</p>
                     </div>
                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                       activeIncident.severity === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                     }`}>
                        {activeIncident.severity}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                     <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest block mb-1">Status</span>
                        <span className="text-xs font-black text-rose-500 uppercase">{activeIncident.status}</span>
                     </div>
                     <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest block mb-1">Units</span>
                        <span className="text-xs font-black text-emerald-500 uppercase">{activeIncident.unitsAssigned || 0} Deployed</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <Button className="w-full h-11 bg-rose-600 hover:bg-rose-700 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-900/20">
                        Dispatch Extra Units
                     </Button>
                     <Button 
                       variant="ghost" 
                       className="w-full h-11 border border-white/5 hover:bg-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400"
                       onClick={() => setActiveIncidentId(null)}
                     >
                        Close Tactical Detail
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TacticalLayout>
  );
}
