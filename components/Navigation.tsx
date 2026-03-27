'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, AlertCircle, Accessibility, MapIcon, Heart, Info, Mail, Users, Plane, Brain, Boxes, Megaphone, LogOut, LogIn } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { getCurrentUser, signOut } from '@/lib/auth-utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setIsOpen(false)
  }

  const menuItems = [
    { href: '/resqmap', label: 'Command Center', icon: AlertCircle },
    { href: '/map', label: 'Emergency Map', icon: MapPin },
    { href: '/survivors', label: 'Survivor Tracker', icon: Users },
    { href: '/drones', label: 'Drone Feeds', icon: Plane },
    { href: '/predictions', label: 'AI Predictions', icon: Brain },
    { href: '/inventory', label: 'Resources', icon: Boxes },
    { href: '/alerts', label: 'Public Alerts', icon: Megaphone },
    { href: '/accessibility', label: 'Accessible Routes', icon: Accessibility },
    { href: '/sos', label: 'SOS Alert', icon: Heart },
    { href: '/admin', label: 'Admin', icon: AlertCircle },
  ]

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="w-6 h-6 text-red-500" />
            ResQMap
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-4 items-center">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 hover:text-red-500 transition text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex gap-3 items-center">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                localStorage.setItem('language', e.target.value)
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 hover:text-red-500 transition text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1 hover:text-red-500 transition text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <div className="px-4 py-2 space-y-2">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value)
                    localStorage.setItem('language', e.target.value)
                  }}
                  className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
                <ThemeToggle />
              </div>
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
