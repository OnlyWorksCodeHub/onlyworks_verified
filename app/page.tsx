'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useTheme } from '@/lib/contexts/theme-context'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Company names for the carousel
  const companies = [
    'Indeed',
    'Lennar',
    'LIV Golf',
    'OpenTable',
    'PepsiCo',
    'UChicago',
    '1-800 Accountant',
    'Big Brothers Big Sisters',
    'Chase',
    'CUNY',
    'SUNY',
    'Indeed',
    'Lennar',
    'LIV Golf',
    'OpenTable',
    'PepsiCo',
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size={28} />
              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">OnlyWorks</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                About
              </Link>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="btn-clean btn-primary-clean"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tightest mb-6 text-gray-900 dark:text-gray-100">
                Track Your
                <span className="text-primary dark:text-primary-light"> Productivity</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                AI-powered workflow analytics that help you understand and improve your work patterns. Simple, private, effective.
              </p>
              <div className="flex gap-4">
                <Link href="/login" className="btn-clean btn-primary-clean">
                  Start Free Trial
                </Link>
                <button className="btn-clean btn-secondary-clean">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-96 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    AI-Powered Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Carousel Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">
            Trusted by teams at leading companies
          </h2>
          
          {/* Carousel Container */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-scroll">
                {companies.map((company, index) => (
                  <div
                    key={`${company}-${index}`}
                    className="flex-shrink-0 px-8"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors whitespace-nowrap">
                        {company}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {companies.map((company, index) => (
                  <div
                    key={`${company}-duplicate-${index}`}
                    className="flex-shrink-0 px-8"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors whitespace-nowrap">
                        {company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-gray-100">Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand and improve your productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-card p-6 border border-gray-200 dark:border-dark-border rounded-sm hover:shadow-lg dark:hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary dark:bg-primary-light rounded-sm flex items-center justify-center text-white mb-6">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Real-time productivity scoring and intelligent activity detection powered by advanced AI.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 border border-gray-200 dark:border-dark-border rounded-sm hover:shadow-lg dark:hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary dark:bg-primary-light rounded-sm flex items-center justify-center text-white mb-6">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your data stays yours. Full encryption, user-controlled recording, no surveillance.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 border border-gray-200 dark:border-dark-border rounded-sm hover:shadow-lg dark:hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-primary dark:bg-primary-light rounded-sm flex items-center justify-center text-white mb-6">
                📈
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Detailed Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate comprehensive reports to showcase your productivity and work patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-dark-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size={24} />
                <span className="font-semibold text-gray-900 dark:text-gray-100">OnlyWorks</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered productivity tracking for modern professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Pricing</Link></li>
                <li><Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">About</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Careers</Link></li>
                <li><Link href="/teams" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Teams</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://twitter.com/onlyworks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Twitter</a></li>
                <li><a href="https://linkedin.com/company/onlyworks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">LinkedIn</a></li>
                <li><a href="https://github.com/onlyworks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">GitHub</a></li>
                <li><a href="mailto:hello@only-works.com" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 OnlyWorks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
