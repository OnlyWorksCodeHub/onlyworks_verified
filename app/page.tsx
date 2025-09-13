// app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Check, Twitter, Github, Linkedin, Youtube } from 'lucide-react'
import { LogoCarousel } from '@/components/ui/logo-carousel'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeUseCase, setActiveUseCase] = useState('finance')

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
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-10">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                OnlyWorks
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/product" className="text-gray-600 hover:text-gray-900 text-sm">Product</Link>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
                <Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Docs</Link>
                <Link href="/company" className="text-gray-600 hover:text-gray-900 text-sm">Company</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm">
                Sign in
              </Link>
              <Link href="/auth/register" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
          AI Platform built for professionals and specialists. 
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Making your work undeniable, detect automation, and generate verified reports, minus the headache.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth/register" className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark">
              Start free trial
            </Link>
            <Link href="/contact" className="px-5 py-2.5 text-gray-700 hover:text-gray-900">
              Book a demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Demo Video */}
      <section className="py-16 px-6">
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
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Everything you need
            </h2>
            <p className="text-gray-600">
              Complete work verification in one platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Capture screenshots on every click and keystroke. Monitor productivity patterns in real-time.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced AI detects automation tools and analyzes work quality and efficiency.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verified reports</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate tamper-proof reports with public verification codes anyone can authenticate.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Team insights</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor team productivity and ensure quality across all projects and clients.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy focused</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your data is encrypted and never shared. You control what gets reported.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Integrations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Built for every industry
            </h2>
            <p className="text-gray-600">
              See how OnlyWorks transforms work verification across different sectors
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 flex space-x-1 border">
              <button
                onClick={() => setActiveUseCase('finance')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeUseCase === 'finance'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Finance
              </button>
              <button
                onClick={() => setActiveUseCase('cybersecurity')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeUseCase === 'cybersecurity'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cybersecurity
              </button>
              <button
                onClick={() => setActiveUseCase('everyday')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
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
            <div>
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

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {activeUseCase === 'finance' && 'Financial compliance dashboard preview'}
                    {activeUseCase === 'cybersecurity' && 'Security verification interface preview'}
                    {activeUseCase === 'everyday' && 'Daily productivity tracking preview'}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Success Rate</div>
                <div className="text-3xl font-bold text-primary">
                  {activeUseCase === 'finance' && '99.8%'}
                  {activeUseCase === 'cybersecurity' && '97.5%'}
                  {activeUseCase === 'everyday' && '98.2%'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-600">Start free. Upgrade when you need more.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-2">Free</h3>
              <div className="text-3xl font-semibold text-gray-900 mb-4">$0</div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>3 sessions per month</li>
                <li>Basic tracking</li>
                <li>7-day history</li>
              </ul>
              <Link href="/auth/register" className="block py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">
                Get started
              </Link>
            </div>
            
            <div className="border-2 border-gray-900 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-2">Pro</h3>
              <div className="text-3xl font-semibold text-gray-900 mb-4">$19<span className="text-base text-gray-500">/mo</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>Unlimited sessions</li>
                <li>AI analysis</li>
                <li>Public reports</li>
                <li>90-day history</li>
              </ul>
              <Link href="/auth/register" className="block py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">
                Start free trial
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-900 mb-2">Team</h3>
              <div className="text-3xl font-semibold text-gray-900 mb-4">$29<span className="text-base text-gray-500">/user</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>Everything in Pro</li>
                <li>Team dashboard</li>
                <li>API access</li>
                <li>Unlimited history</li>
              </ul>
              <Link href="/contact" className="block py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm">
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Get the latest from OnlyWorks in your inbox.
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of teams using OnlyWorks to verify their work.
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex items-center justify-center max-w-md mx-auto mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </button>
          </form>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                toast.error('Download coming soon! We\'re preparing the latest version for you.')
              }}
              className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Download
            </button>
            <Link href="/contact" className="px-5 py-2.5 text-gray-700 hover:text-gray-900">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900">OnlyWorks</h3>
              <br></br>
              <p className="text-gray-600 text-sm mb-4">The AI Backbone of Credibility..</p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a 
                  href="https://x.com/OnlyWorksAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/only-works" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@OnlyWorksAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-600 hover:text-gray-900 text-sm">Use Case</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Teams</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Business</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Download</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">Resources</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">FAQs</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2025 OnlyWorks. All rights reserved.
              <ul className="space-y-2">
                <p>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">     Privacy     </Link> 
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">    Terms     </Link>
                  <Link href="/security" className="text-gray-600 hover:text-gray-900 text-sm">    Security     </Link>
                </p>
              </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}