'use client'

import { Navigation } from '@/components/Navigation'
import { MapPin, AlertCircle, Users, Navigation2, Heart, Phone, Linkedin, Mail, ArrowRight, Plane, Brain, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      id: 'emergency-map',
      icon: MapPin,
      title: 'Emergency Services Map',
      description: 'Find nearest hospitals, police, and fire stations with real-time routing',
      href: '/map',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
      details: 'Interactive map showing all nearby emergency services within your area',
    },
    {
      id: 'accessible-routes',
      icon: Navigation2,
      title: 'Accessible Routes',
      description: 'Navigate barrier-free routes with wheelchair accessibility information',
      href: '/accessibility',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      details: 'Community-verified routes that are wheelchair accessible',
    },
    {
      id: 'local-resources',
      icon: Users,
      title: 'Local Resources',
      description: 'Discover pharmacies, shelters, food banks, and community services',
      href: '/resources',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
      details: 'Find resources and services available in your community',
    },
    {
      id: 'disaster-dashboard',
      icon: AlertCircle,
      title: 'Disaster Dashboard',
      description: 'Real-time disaster tracking, safe zones, and resource distribution',
      href: '/disasters',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
      details: 'Track ongoing disasters and find safe zones near you',
    },
    {
      id: 'sos-emergency',
      icon: Heart,
      title: 'SOS Emergency',
      description: 'Share your emergency location with contacts and nearby responders',
      href: '/sos',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
      details: 'One-tap emergency alert system for instant help',
    },
    {
      id: 'survivor-tracker',
      icon: Users,
      title: 'Survivor Tracker',
      description: 'Keep track of found and missing individuals in real-time coordination.',
      href: '/survivors',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
      details: 'Advanced database and tracking system for missing persons.',
    },
    {
      id: 'drone-feeds',
      icon: Plane,
      title: 'Drone Feeds',
      description: 'Live interactive drone footage for comprehensive damage assessment.',
      href: '/drones',
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400',
      details: 'Analyze live feeds directly from reconnaissance drones.',
    },
    {
      id: 'ai-predictions',
      icon: Brain,
      title: 'AI Predictions',
      description: 'Advanced machine learning risk assessment and disaster prediction models.',
      href: '/predictions',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
      details: 'Anticipate risk zones and resource requirements using AI.',
    },
    {
      id: 'public-alerts',
      icon: Megaphone,
      title: 'Public Alerts',
      description: 'Critical mass broadcasting for impending threats and evacuation orders.',
      href: '/alerts',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400',
      details: 'Broadcast verified push warnings from authorities directly.',
    }
  ]

  const steps = [
    { step: '1', title: 'Enable Location', desc: 'Allow ResQMap to access your location' },
    { step: '2', title: 'Find Services', desc: 'Discover nearby emergency services & resources' },
    { step: '3', title: 'Get Directions', desc: 'Navigate with turn-by-turn directions' },
    { step: '4', title: 'Share Alert', desc: 'Send SOS to emergency contacts' },
  ]

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 z-50" style={{ width: `${scrollProgress}%` }} />

      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
          backgroundImage: 'url(/homepage-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent dark:to-gray-900" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-400 font-semibold text-sm mb-6 border border-red-500/30 backdrop-blur-sm animate-fade-in">
                Next-Gen Emergency Platform
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in leading-[1.1] tracking-tight">
                Emergency Response <br className="hidden md:block"/>& Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Navigation</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 mx-auto animate-fade-in-delayed leading-relaxed font-light">
                ResQMap connects you with emergency services, accessible routes, local resources, and disaster support in real-time. Get help when you need it most.
              </p>
              <div className="flex gap-4 sm:gap-6 justify-center flex-col sm:flex-row">
              <Link
                href="/map"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Open Map
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/sos"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Emergency SOS
                <Heart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        </section>

        {/* Interactive Features Grid */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Core Features</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Comprehensive tools designed to streamline emergency response and empower communities during crises.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon
                const isHovered = hoveredFeature === feature.id
                
                return (
                  <Link
                    key={feature.id}
                    href={feature.href}
                    onMouseEnter={() => setHoveredFeature(feature.id)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent dark:from-gray-700 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                    <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm ${feature.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="relative text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{feature.description}</p>
                    <div className={`relative transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        {feature.details}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Interactive How It Works */}
        <section className="bg-gray-100 dark:bg-gray-800/50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
              
              {/* Connector Lines (hidden on mobile) */}
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600 z-0" />
              
              {steps.map((item, index) => (
                <div 
                  key={item.step} 
                  className="text-center cursor-pointer transition-transform duration-300 relative z-10"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(-1)}
                >
                  <div 
                    className={`w-20 h-20 rounded-2xl text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6 transition-all duration-300 shadow-lg ${
                      activeStep === index ? 'bg-red-600 scale-110 shadow-red-500/50 rotate-3' : 'bg-red-500'
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-base text-gray-600 dark:text-gray-400">{item.desc}</p>
                  
                  <div className={`mt-4 transform transition-all duration-300 overflow-hidden ${
                    activeStep === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 h-0'
                  }`}>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Quick action for faster response</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Quick Access Buttons */}
        <section className="bg-white dark:bg-gray-900 py-16 sm:py-24 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <button className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 border-2 border-red-100 dark:border-red-900/30 rounded-2xl hover:border-red-300 dark:hover:border-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                  <Phone className="w-8 h-8 text-red-600 dark:text-red-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Emergency (911)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Call emergency services directly</p>
              </button>
              
              <button className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-2 border-green-100 dark:border-green-900/30 rounded-2xl hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-green-500 transition-all duration-300">
                  <Navigation2 className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Safe Route</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Find barrier-free, secure paths</p>
              </button>
              
              <button className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Send SOS</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Alert your emergency contacts instantly</p>
              </button>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">About Our Founder</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full" />
            </div>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="md:flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-20 transform -rotate-12 scale-150" />
                  <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-500 mb-6 border-4 border-blue-400">
                    <span className="text-4xl font-extrabold text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center">Pawan Singh</h3>
                  <p className="text-blue-200 font-medium text-center mt-1">Founder & Lead Dev</p>
                </div>
                <div className="md:w-2/3 p-8 sm:p-12 flex flex-col justify-center">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic mb-8 relative">
                    <span className="text-4xl text-blue-200 dark:text-blue-900/50 absolute -top-4 -left-4 font-serif">"</span>
                    Passionate about building innovative solutions that make emergency response and accessibility services more efficient. With expertise in full-stack development, ResQMap was created to bridge the critical gap between people in need and available resources during emergencies.
                    <span className="text-4xl text-blue-200 dark:text-blue-900/50 absolute -bottom-8 -right-4 font-serif">"</span>
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <a
                      href="mailto:pawan9140582015@gmail.com"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-semibold border border-red-200 dark:border-red-900/30"
                    >
                      <Mail className="w-5 h-5" />
                      Contact via Email
                    </a>
                    <a
                      href="https://www.linkedin.com/in/pawan-singh-555423322/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                    >
                      <Linkedin className="w-5 h-5" />
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-6 sm:py-8 mt-12 sm:mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
              <p>&copy; 2024 ResQMap. Founded by Pawan Singh.</p>
              <div className="flex gap-4 sm:gap-6">
                <Link href="/about" className="hover:text-white transition">About</Link>
                <Link href="#" className="hover:text-white transition">Privacy</Link>
                <Link href="#" className="hover:text-white transition">Terms</Link>
                <Link href="#" className="hover:text-white transition">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
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

        .animate-fade-in-delayed {
          animation: fadeIn 0.5s ease-out 0.2s both;
        }
      `}</style>
    </>
  )
}
