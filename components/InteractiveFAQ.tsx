'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export function InteractiveFAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'How do I find emergency services near me?',
      answer: 'Open the Emergency Services Map, enable your location, and you will see all nearby hospitals, police stations, and fire departments with real-time directions.',
    },
    {
      id: 2,
      question: 'Can I use ResQMap offline?',
      answer: 'Yes! ResQMap is a Progressive Web App (PWA). Once installed on your device, you can access core features even without an internet connection.',
    },
    {
      id: 3,
      question: 'How does the SOS feature work?',
      answer: 'The SOS button sends your real-time location and emergency details to nearby responders and your emergency contacts. They receive an instant notification with your exact location.',
    },
    {
      id: 4,
      question: 'Is my location data secure?',
      answer: 'Your location data is encrypted and only shared when you specifically request it. We do not store personal location history. All data follows strict privacy guidelines.',
    },
    {
      id: 5,
      question: 'Can I report issues and contribute information?',
      answer: 'Yes! You can report road closures, accessible routes, and resource availability. Community contributions help keep ResQMap accurate and up-to-date.',
    },
    {
      id: 6,
      question: 'Which languages does ResQMap support?',
      answer: 'ResQMap supports English and Hindi. More languages are being added. You can change your language in the settings menu.',
    },
  ]

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-4 bg-white hover:bg-gray-50 transition flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="px-4 py-3 bg-blue-50 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-gray-700 mb-3">Can't find your answer?</p>
          <a
            href="mailto:support@resqmap.com"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
