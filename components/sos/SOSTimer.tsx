'use client'

import { useEffect, useState, useMemo } from 'react'
import { AlertCircle, Clock, ShieldAlert, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SOSTimerProps {
  createdAt: number | Date
  status: string
  onEscalate?: () => void
}

export function SOSTimer({ createdAt, status, onEscalate }: SOSTimerProps) {
  const [timeLeft, setTimeLeft] = useState(180000) // 3 minutes in ms
  const [pulse, setPulse] = useState(false)

  const startTime = useMemo(() => {
    if (createdAt instanceof Date) return createdAt.getTime()
    return createdAt
  }, [createdAt])

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 180000 - elapsed)
      setTimeLeft(remaining)

      if (remaining < 60000) setPulse(true)
      if (remaining === 0 && status === 'pending') {
        onEscalate?.()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, status, onEscalate])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  if (status !== 'pending') return null

  return (
    <div className={`p-4 rounded-xl border-2 transition-all shadow-2xl backdrop-blur-md ${
      timeLeft < 60000 ? 'bg-red-600/20 border-red-500 animate-pulse' : 'bg-orange-600/10 border-orange-500/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${timeLeft < 60000 ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
            {timeLeft < 60000 ? <ShieldAlert className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-white">
            {timeLeft < 60000 ? 'Escalation Imminent' : 'Dispatcher Window'}
          </span>
        </div>
        <div className="text-lg font-mono font-bold text-white">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-900/50 rounded-full overflow-hidden mb-3">
        <motion.div 
          className={`h-full ${timeLeft < 60000 ? 'bg-red-500' : 'bg-orange-500'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 180000) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
        {timeLeft > 0 
          ? `Automatic escalation to nearest NDRF unit in ${timeLeft < 60000 ? 'less than a minute' : minutes + ' minutes'}`
          : 'ESCALATING TO COMMAND CENTER...'}
      </p>

      {timeLeft === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 py-2 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 overflow-hidden relative"
        >
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
          Escalation Sequence Active
          <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      )}

      <style jsx>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  )
}
