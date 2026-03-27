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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Emergency SOS Alert</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">Instantly share your location with emergency responders and your emergency contacts</p>
          </div>
        </section>

        {/* Success Message */}
        {submitted && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-2 sm:gap-3 animate-bounce">
              <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base text-green-800">SOS Alert Sent Successfully!</p>
                <p className="text-xs sm:text-sm text-green-700 mt-0.5">Emergency responders have been notified of your location</p>
              </div>
            </div>
          </div>
        )}

        {/* SOS Form & Active Alerts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* SOS Form */}
            <div className="md:col-span-1">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`w-full p-6 sm:p-8 rounded-lg font-semibold text-white flex flex-col items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 transition-all transform hover:scale-105 active:scale-95 bg-red-500 hover:bg-red-600 min-h-32 sm:min-h-40`}
              >
                <Heart className="w-7 sm:w-8 h-7 sm:h-8 fill-white animate-pulse" />
                <span className="text-base sm:text-lg font-bold">SEND SOS</span>
              </button>

              {showForm && (
                <form onSubmit={handleSubmitSOS} className="bg-white border-2 border-red-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Emergency Type</label>
                    <select
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="medical">Medical Emergency</option>
                      <option value="accident">Accident</option>
                      <option value="fire">Fire</option>
                      <option value="police">Police Needed</option>
                      <option value="disaster">Natural Disaster</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Severity Level</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSeverity(level)}
                          className={`flex-1 py-2 px-2 sm:px-3 rounded-lg font-semibold text-xs sm:text-sm transition ${
                            severity === level
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your emergency..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Emergency Contacts</label>
                    <div className="space-y-2">
                      {emergencyContacts.map((contact, idx) => (
                        <input
                          key={idx}
                          type="email"
                          placeholder="Email or phone"
                          value={contact}
                          onChange={(e) => {
                            const newContacts = [...emergencyContacts]
                            newContacts[idx] = e.target.value
                            setEmergencyContacts(newContacts)
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmergencyContacts([...emergencyContacts, ''])}
                      className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-700 font-semibold"
                    >
                      + Add Contact
                    </button>
                  </div>

                  {userLocation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-blue-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</span>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    Send Emergency Alert
                  </button>
                </form>
              )}
            </div>

            {/* Active Alerts List */}
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Active SOS Alerts Nearby</h2>
              {sosAlerts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
                  <AlertCircle className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-gray-600">No active emergency alerts in your area</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {sosAlerts.map((alert, idx) => (
                    <div
                      key={alert.id || idx}
                      className="bg-white border-2 border-red-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all animate-fade-in"
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 fill-red-600 flex-shrink-0" />
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Emergency Alert</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${
                              alert.urgency === 'high' ? 'bg-red-500 text-white' :
                              alert.urgency === 'medium' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-white'
                            }`}>
                              {alert.urgency.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{alert.details}</p>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 overflow-x-auto">
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <MapPin className="w-3 h-3" />
                              {alert.location[0].toFixed(4)}, {alert.location[1].toFixed(4)}
                            </span>
                            <span className="flex-shrink-0">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                          alert.status === 'active' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-blue-50 py-8 sm:py-12 mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Safety Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">1. Stay Calm</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Take deep breaths and assess your situation before sending an SOS alert</p>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">2. Provide Details</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Give as much information as possible about your emergency to help responders</p>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">3. Stay in Location</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">If safe, remain in your current location so responders can find you easily</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
