'use client'

import Link from 'next/link'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { useRef } from 'react'
import { useHeroEntrance } from '@/hooks/useHeroEntrance'

export default function ContactPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtextRef = useRef<HTMLParagraphElement>(null)

  useHeroEntrance([heroTitleRef, heroSubtextRef])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MobileNavigation currentPage="/contact" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-3 xs:px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            ref={heroTitleRef}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold md:font-semibold text-gray-900 mb-6 leading-tight sm:leading-snug md:leading-normal"
            style={{ opacity: 0 }}
          >
            Book a Demo
          </h1>
          <p
            ref={heroSubtextRef}
            className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            style={{ opacity: 0 }}
          >
            See OnlyWorks in action. Schedule a personalized demo with our team.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center hover-lift">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sales Inquiries</h3>
              <p className="text-gray-600 mb-4">Questions about pricing or features?</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center hover-lift">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">Custom solutions for large teams</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center hover-lift">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Partnership</h3>
              <p className="text-gray-600 mb-4">Interested in partnering with us?</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Schedule Your Demo</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="given-name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="family-name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
              <input
                type="text"
                inputMode="text"
                autoComplete="organization"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Team Size</label>
              <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none">
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-1000 employees</option>
                <option>1000+ employees</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">What would you like to see in the demo?</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Tell us about your specific use case or what features you're most interested in..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition font-medium"
            >
              Book Demo
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
