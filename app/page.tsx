// app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Check, Twitter, Github, Linkedin, Youtube } from 'lucide-react'
import { LogoCarousel } from '@/components/ui/logo-carousel'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import anime from 'animejs'

export default function HomePage() {
  const { user } = useAuth() as any
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeUseCase, setActiveUseCase] = useState('finance')

  // Refs for animations
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtextRef = useRef<HTMLParagraphElement>(null)
  const heroBadgeRef = useRef<HTMLDivElement>(null)
  const heroButtonsRef = useRef<HTMLDivElement>(null)
  const useCaseContentRef = useRef<HTMLDivElement>(null)
  const useCaseImageRef = useRef<HTMLDivElement>(null)

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      toast.success(data.message)
      setEmail('') // Clear the input
    } catch (error) {
      console.error('Newsletter signup error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe')
    } finally {
      setIsLoading(false)
    }
  }

  // Hero entrance animation
  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    })

    timeline
      .add({
        targets: heroTitleRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      })
      .add({
        targets: heroSubtextRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
      }, '-=400') // Start 400ms before previous animation ends
      .add({
        targets: heroBadgeRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
      }, '-=300')
      .add({
        targets: heroButtonsRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 400,
      }, '-=250')
  }, [])

  // Badge pulse animation
  useEffect(() => {
    if (!heroBadgeRef.current) return

    anime({
      targets: heroBadgeRef.current,
      scale: [1, 1.02, 1],
      duration: 2000,
      easing: 'easeInOutQuad',
      delay: 3000,
      loop: true,
    })
  }, [])

  // Industry toggle transition animation
  useEffect(() => {
    if (!useCaseContentRef.current || !useCaseImageRef.current) return

    const timeline = anime.timeline({
      easing: 'easeInOutQuad',
    })

    timeline
      .add({
        targets: [useCaseContentRef.current, useCaseImageRef.current],
        opacity: [1, 0],
        translateX: [-10, 0],
        duration: 300,
      })
      .add({
        targets: [useCaseContentRef.current, useCaseImageRef.current],
        opacity: [0, 1],
        translateX: [10, 0],
        duration: 300,
      })
  }, [activeUseCase])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MobileNavigation currentPage="/" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-3 xs:px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            ref={heroTitleRef}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold md:font-semibold text-gray-900 mb-6 leading-tight sm:leading-snug md:leading-normal lg:leading-loose"
            style={{ opacity: 0 }}
          >
          An AI platform built for<br className="hidden sm:block" />professionals and specialists.
          </h1>
          <br></br>
          <p
            ref={heroSubtextRef}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            style={{ opacity: 0 }}
          >
          Making your work undeniable, detect automation, and generate verified reports, minus the headache.
          </p>

          <div className="flex items-center justify-center mb-8">
            <div
              ref={heroBadgeRef}
              className="flex items-center space-x-2 px-3 py-3 sm:py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              style={{ opacity: 0 }}
            >
              <img src="/images/f.svg" alt="F" className="w-5 h-5" />
              <p className="text-sm text-gray-600">Backed by Friends and Family</p>
            </div>
          </div>
          <div
            ref={heroButtonsRef}
            className="flex flex-row items-center justify-center gap-4"
            style={{ opacity: 0 }}
          >
            <Link href="/downloads" className="text-center px-6 py-3 sm:px-5 sm:py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
              Download
            </Link>
            <Link href="/contact" className="text-center px-6 py-3 sm:px-5 sm:py-2.5 text-gray-700 hover:text-gray-900 hover:scale-[1.02] transition-all duration-200">
              Book a demo →
            </Link>
          </div>
          
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Demo Video */}
      {/* <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            See OnlyWorks in action
          </h2>
          <p className="text-gray-600 mb-8">
            Watch how easy it is to track and verify your work
          </p>
          <div className="relative bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
            <button
              onClick={() => {
                toast.error('Demo video coming soon! We\'re preparing an amazing showcase for you.')
              }}
              className="w-20 h-20 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors group"
            >
              <svg
                className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-600">
              Complete work verification in one platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time tracking</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Works while you work, capturing workflow data to monitor productivity patterns in real time.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI analysis</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Advanced AI detects automation tools and analyzes work quality and efficiency.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Verified reports</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Generate tamper-proof reports with public verification codes anyone can authenticate.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team insights</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Monitor team productivity and ensure quality across all projects and clients.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Privacy focused</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Your data is encrypted and never shared. You control what gets reported.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Integrations</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Connect with your existing tools. Export data to any platform via API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              Built for every industry
            </h2>
            <p className="text-lg text-gray-600">
              See how OnlyWorks transforms work verification across different sectors
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12 px-4 sm:px-0">
            <div className="bg-white rounded-lg p-1 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveUseCase('finance')}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeUseCase === 'finance'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Finance
              </button>
              <button
                onClick={() => setActiveUseCase('cybersecurity')}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeUseCase === 'cybersecurity'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cybersecurity
              </button>
              <button
                onClick={() => setActiveUseCase('everyday')}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeUseCase === 'everyday'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Everyday Projects
              </button>
            </div>
          </div>

          {/* Use Case Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div ref={useCaseContentRef}>
              {activeUseCase === 'finance' && (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Financial Compliance Made Simple
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Meet regulatory requirements with tamper-proof work verification. Generate audit-ready reports that prove compliance with financial regulations and demonstrate due diligence.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">SOX compliance documentation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Audit trail generation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Risk assessment verification</span>
                    </li>
                  </ul>
                </>
              )}

              {activeUseCase === 'cybersecurity' && (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Security Work Verification
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Prove security implementations and vulnerability assessments are genuine. Detect automated security tools and ensure human oversight in critical security work.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Penetration testing verification</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Security audit documentation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Incident response tracking</span>
                    </li>
                  </ul>
                </>
              )}

              {activeUseCase === 'everyday' && (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Everyday Work Transparency
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Build trust with clients and teams by proving your daily work is real and efficient. Perfect for freelancers, consultants, and remote teams who need to demonstrate productivity.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Client work verification</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Time tracking accuracy</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Productivity insights</span>
                    </li>
                  </ul>
                </>
              )}
            </div>

            <div ref={useCaseImageRef} className="bg-white rounded-xl p-8 shadow-sm">
              <div className="rounded-lg aspect-video overflow-hidden">
                {activeUseCase === 'finance' && (
                  <Image
                    src="/images/industry-finance.png"
                    alt="Financial work with iPad and mouse"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                )}
                {activeUseCase === 'cybersecurity' && (
                  <Image
                    src="/images/industry-cybersecurity.png"
                    alt="Focused remote cybersecurity work"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}
                {activeUseCase === 'everyday' && (
                  <Image
                    src="/images/industry-everyday.png"
                    alt="Clear computer screens for everyday projects"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">How it Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Start Recording</h3>
              <p className="text-gray-600 leading-relaxed">
                Launch OnlyWorks and begin your work session. Our intelligent system automatically captures your productivity patterns while respecting your privacy.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI analyzes your work patterns, detects genuine productivity, and identifies any automation or outsourcing attempts with 98% accuracy.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Verified Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate tamper-proof reports with verified proof of work. Perfect for clients, managers, or personal tracking with customizable privacy settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            Get the latest from OnlyWorks in your inbox.
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of teams using OnlyWorks to verify their work.
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center max-w-md mx-auto mb-4 gap-2 sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              inputMode="email"
              autoComplete="email"
              className="flex-1 px-4 py-3 sm:py-2.5 bg-white text-gray-900 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 sm:py-2.5 bg-primary text-white rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-primary-dark hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none whitespace-nowrap"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </button>
          </form>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link
              href="/downloads"
              className="text-center px-6 py-3 sm:px-5 sm:py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              Download
            </Link>
            <Link href="/contact" className="text-center px-6 py-3 sm:px-5 sm:py-2.5 text-gray-700 hover:text-gray-900 hover:scale-[1.02] transition-all duration-200">
            Book a demo →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
