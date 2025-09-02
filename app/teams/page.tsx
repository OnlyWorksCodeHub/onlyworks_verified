'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useTheme } from '@/lib/contexts/theme-context'
import { Sun, Moon, Users, BarChart3, Shield, Zap } from 'lucide-react'

export default function TeamsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size={28} />
              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">OnlyWorks</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
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
              
              <Link href="/login" className="btn-clean btn-primary-clean">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-gray-100">
              OnlyWorks for Teams
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Empower your entire team with productivity insights and collaborative tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Built for Modern Teams
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Whether you're a startup or enterprise, OnlyWorks Teams provides the insights 
                and tools you need to optimize team productivity and collaboration.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Users className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Team Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      See aggregated insights while respecting individual privacy
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Department Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Compare productivity across teams and departments
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Privacy Controls</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Granular controls over what data is shared with managers
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Zap className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Integrations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connect with Slack, Teams, Jira, and more
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-sm p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share insights and improve together
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-sm p-8 text-center">
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-4">
              Ready to transform your team's productivity?
            </h2>
            <p className="text-purple-800 dark:text-purple-300 mb-6">
              Join hundreds of teams already using OnlyWorks
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/pricing" className="btn-clean btn-primary-clean">
                View Team Pricing
              </Link>
              <a href="mailto:sales@only-works.com" className="btn-clean btn-secondary-clean">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
