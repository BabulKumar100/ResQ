'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface TimelineEvent {
  year: number
  title: string
  description: string
  milestone: string
}

export function InteractiveTimeline() {
  const [expandedYear, setExpandedYear] = useState<number | null>(null)

  const events: TimelineEvent[] = [
    {
      year: 2022,
      title: 'ResQMap Founded',
      description: 'Pawan Singh started ResQMap with a vision to revolutionize emergency response and resource discovery.',
      milestone: 'Foundation',
    },
    {
      year: 2023,
      title: 'MVP Launch',
      description: 'Released first version with Emergency Services Map and basic SOS functionality.',
      milestone: '5K Users',
    },
    {
      year: 2023,
      title: 'Accessibility Features',
      description: 'Added comprehensive accessibility navigation with barrier detection and route planning.',
      milestone: '25K Users',
    },
    {
      year: 2024,
      title: 'Disaster Integration',
      description: 'Integrated real-time disaster tracking and emergency alert system for communities.',
      milestone: '100K Users',
    },
    {
      year: 2024,
      title: 'PWA & Offline',
      description: 'Launched Progressive Web App with offline capabilities for critical areas.',
      milestone: '250K Users',
    },
    {
      year: 2024,
      title: 'Admin Dashboard',
      description: 'Released comprehensive admin dashboard for emergency coordinators and organizations.',
      milestone: '500K Users',
    },
  ]

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">ResQMap Journey</h2>
        <p className="text-center text-gray-600 mb-12">How we grew from an idea to helping millions</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-200" />

          {/* Events */}
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="pl-12 relative cursor-pointer"
                onClick={() => setExpandedYear(expandedYear === event.year ? null : event.year)}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition">
                  {event.year % 100}
                </div>

                {/* Card */}
                <div className={`p-4 rounded-lg border transition-all ${
                  expandedYear === event.year
                    ? 'bg-red-50 border-red-300 shadow-lg'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-1">{event.year}</p>
                      <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.milestone}</p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedYear === event.year ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {expandedYear === event.year && (
                    <p className="text-sm text-gray-700 mt-3 pt-3 border-t border-red-200 animate-in fade-in">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 text-center">
          <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
          <p className="text-gray-700">
            We're constantly innovating to bring more features and expand to more regions. 
            Join us in our mission to revolutionize emergency response worldwide.
          </p>
        </div>
      </div>
    </div>
  )
}
