'use client'

import { Navigation } from '@/components/Navigation'
import { ContactForm } from '@/components/ContactForm'
import Link from 'next/link'
import { Zap, Lock, Users, TrendingUp, Smartphone, Globe } from 'lucide-react'

export default function ContactPage() {
  const contactReasons = [
    { icon: Zap, title: 'Quick Support', desc: 'Get answers to your questions' },
    { icon: Lock, title: 'Security', desc: 'Report a security issue' },
    { icon: Users, title: 'Partnership', desc: 'Work with us' },
    { icon: TrendingUp, title: 'Business', desc: 'Enterprise solutions' },
    { icon: Smartphone, title: 'Technical', desc: 'Technical support' },
    { icon: Globe, title: 'Other', desc: 'Other inquiries' },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </section>

        {/* Contact Reasons */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How can we help?</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {contactReasons.map((reason, idx) => {
              const Icon = reason.icon
              return (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition text-center group cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-125 transition-transform" />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{reason.title}</h3>
                  <p className="text-xs text-gray-500">{reason.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContactForm />
        </section>

        {/* Social & Quick Links */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
              <div className="space-y-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-semibold text-blue-600 border border-blue-200"
                >
                  Twitter / X
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-semibold text-blue-600 border border-blue-200"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-semibold text-gray-700 border border-gray-200"
                >
                  GitHub
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-semibold text-blue-600 border border-blue-200"
                >
                  Facebook
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  href="/learn"
                  className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition font-semibold text-blue-600 border border-blue-200"
                >
                  Learn More
                </Link>
                <Link
                  href="/directory"
                  className="block p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition font-semibold text-green-600 border border-green-200"
                >
                  Service Directory
                </Link>
                <Link
                  href="/map"
                  className="block p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg hover:shadow-md transition font-semibold text-red-600 border border-red-200"
                >
                  Emergency Map
                </Link>
                <Link
                  href="/sos"
                  className="block p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg hover:shadow-md transition font-semibold text-pink-600 border border-pink-200"
                >
                  SOS Alert
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Access */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Can't find what you're looking for?</h3>
          <Link
            href="/learn"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Check Our FAQ
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p>&copy; 2024 ResQMap. Founded by Pawan Singh.</p>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/about" className="hover:text-white transition">About</Link>
                <Link href="#" className="hover:text-white transition">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
