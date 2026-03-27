'use client'

import { Navigation } from '@/components/Navigation'
import { InteractiveStats } from '@/components/InteractiveStats'
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel'
import { InteractiveFAQ } from '@/components/InteractiveFAQ'
import { UserFeedbackForm } from '@/components/UserFeedbackForm'
import { InteractiveSearch } from '@/components/InteractiveSearch'
import { InteractiveDataViz } from '@/components/InteractiveDataViz'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function LearnPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Learn & Explore</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover ResQMap Features
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Learn how ResQMap can help you find emergency services, accessible routes, and resources when you need them most.
            </p>
          </div>
        </section>

        {/* Interactive Search Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-xl my-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Search</h2>
          <InteractiveSearch />
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">ResQMap Impact</h2>
          <p className="text-center text-gray-600 mb-8">Real numbers showing how ResQMap helps communities</p>
          <InteractiveStats />
        </section>

        {/* Data Visualization */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <InteractiveDataViz />
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <TestimonialsCarousel />
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <InteractiveFAQ />
        </section>

        {/* Feedback Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <UserFeedbackForm />
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            ResQMap is free to use and available on all devices. Start exploring emergency services and resources in your area today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/map"
              className="group inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 font-semibold"
            >
              Open Interactive Map
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/sos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition transform hover:scale-105 font-semibold"
            >
              Emergency SOS
            </Link>
          </div>
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
                <Link href="#" className="hover:text-white transition">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
