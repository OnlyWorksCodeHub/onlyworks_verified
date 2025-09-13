'use client'

import Link from 'next/link'
import { Target, Eye, Lock, Users } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'

export default function AboutPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Thanks for joining! We\'ll keep you updated.')
        setEmail('')
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-10">
              <Link href="/" className="flex items-center space-x-2">
                <Logo size={32} />
                <span className="text-2xl font-semibold text-gray-900">OnlyWorks</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-base">Pricing</Link>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-base">Careers</Link>
                <Link href="/updates" className="text-gray-600 hover:text-gray-900 text-base">Updates</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-base">Contact</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/coming-soon" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-base">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-semibold text-gray-900 mb-6">
            Proving Work is <span className="text-primary">Real</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            In a world of remote work and AI assistance, how do you prove your work is genuine?
            OnlyWorks was built to solve the trust problem in modern work.
          </p>

          <div className="w-full">
            <div className="space-y-16 py-12">

              {/* Stage 1 */}
              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                </div>
                <div className="text-center max-w-4xl mx-auto">
                  <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">Stage One Complete</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    We've launched an AI-powered self-reporting system that saves employees time and delivers instant, accurate reports to managers.
                  </p>
                </div>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-gray-400"></div>
                  <svg className="w-6 h-6 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-2xl">2</span>
                  </div>
                </div>
                <div className="text-center max-w-4xl mx-auto">
                  <h3 className="text-4xl md:text-5xl font-semibold text-gray-400 mb-6">Stage Two</h3>
                  <p className="text-xl text-gray-500 leading-relaxed">
                    Something revolutionary is coming...
                  </p>
                </div>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                  <svg className="w-6 h-6 text-gray-300 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-2xl">3</span>
                  </div>
                </div>
                <div className="text-center max-w-4xl mx-auto">
                  <h3 className="text-4xl md:text-5xl font-semibold text-gray-300 mb-6">Stage Three</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    The future awaits...
                  </p>
                </div>
              </div>

              {/* Final Message */}
              <div className="text-center max-w-4xl mx-auto pt-8">
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-2xl">
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    But this is only the beginning. Two more groundbreaking stages are in the works designed to revolutionize hiring and talent management as you know it.
                  </p>
                  <p className="text-lg text-primary font-semibold mt-4 mb-6">
                    Curious? Stay tuned. The future of work is unfolding.
                  </p>
                  <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto mt-6">
                    <div className="flex items-center justify-center">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Joining...' : 'Join'}
                      </button>
                    </div>
                    {message && (
                      <p className="mt-3 text-sm text-center text-gray-600">
                        {message}
                      </p>
                    )}
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe that honest, hard-working professionals deserve a way to prove their value.
              Whether you're a freelancer showing clients your effort, a remote employee demonstrating
              productivity, or a team lead ensuring quality work, OnlyWorks provides the verification you need.
            </p>
            <p className="text-gray-600">
              Our AI-powered platform tracks real work patterns, detects automation, and creates
              tamper-proof reports that anyone can verify. No more doubts about outsourcing,
              no more questions about productivity—just clear, verifiable proof of genuine work.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Image placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Truth First</h3>
              <p className="text-gray-600">
                We never compromise on accuracy. Every verification is thorough and honest.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Privacy Matters</h3>
              <p className="text-gray-600">
                We track productivity, not personal data. Your privacy is non-negotiable.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Empower Workers</h3>
              <p className="text-gray-600">
                We help professionals prove their worth and improve their productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div></div>
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              OnlyWorks is an AI Platform built for professionals and specialists. Undeniable work with analytics and reports, minus the hassle.
            </p>
            <p className="text-gray-600">
              We work directly with you to understand your needs, then match you with reliable talent who are ready to contribute. Our goal is to streamline the hiring process, no more ghosting, no more unqualified matches just the right fit but, faster. We believe every professional deserves the chance to earn and grow. And every business deserves talent that they can count on.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
