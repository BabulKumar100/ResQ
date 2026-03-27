'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  id: number
  author: string
  role: string
  content: string
  rating: number
  avatar: string
}

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Emergency Responder',
      content: 'ResQMap has revolutionized how we respond to emergencies. The real-time location tracking saves lives!',
      rating: 5,
      avatar: 'SJ',
    },
    {
      id: 2,
      author: 'Raj Patel',
      role: 'Community Volunteer',
      content: 'The accessibility features are incredible. Everyone can now find safe routes easily.',
      rating: 5,
      avatar: 'RP',
    },
    {
      id: 3,
      author: 'Maria Garcia',
      role: 'Healthcare Worker',
      content: 'Finding nearest medical facilities has never been easier. Highly recommended!',
      rating: 5,
      avatar: 'MG',
    },
    {
      id: 4,
      author: 'James Wilson',
      role: 'Disaster Relief',
      content: 'An essential tool during natural disasters. We use it in all our relief operations.',
      rating: 5,
      avatar: 'JW',
    },
  ]

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const testimonial = testimonials[current]

  return (
    <div className="py-12 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What People Say</h2>
        
        <div className="relative bg-white rounded-lg shadow-2xl p-8 md:p-12 border border-gray-200">
          {/* Testimonial Content */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              {testimonial.avatar}
            </div>
            
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.content}"</p>
            
            <div>
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 hover:bg-gray-100 rounded-full transition transform hover:scale-110 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === current ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 hover:bg-gray-100 rounded-full transition transform hover:scale-110 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>

          {/* Counter */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {current + 1} / {testimonials.length}
          </p>
        </div>
      </div>
    </div>
  )
}
