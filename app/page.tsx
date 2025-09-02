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

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Logo size={28} />
              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">OnlyWorks</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Pricing
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
              <div className="w-full max-w-md h-96 bg-gray-100 dark:bg-gray-900 rounded-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
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
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo size={24} />
            <span className="font-semibold text-gray-900 dark:text-gray-100">OnlyWorks</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 OnlyWorks. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
