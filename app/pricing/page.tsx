'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Check, X } from 'lucide-react'
import { useTheme } from '@/lib/contexts/theme-context'
import { Sun, Moon } from 'lucide-react'

export default function PricingPage() {
  const { theme, toggleTheme } = useTheme()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '100 screenshots per month',
        'Basic AI analysis',
        '7-day data retention',
        'Daily reports',
        'Single user',
      ],
      limitations: [
        'No team features',
        'Limited API access',
        'Basic support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$15',
      period: 'per month',
      features: [
        'Unlimited screenshots',
        'Advanced AI insights',
        'Unlimited data retention',
        'Real-time analytics',
        'Custom reports',
        'API access',
        'Priority support',
      ],
      limitations: [
        'Single user only',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$25',
      period: 'per user/month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'User management',
        'Team analytics',
        'SSO integration',
        'Dedicated support',
        'Custom integrations',
      ],
      limitations: [],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

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
              
              <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Sign In
              </Link>
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-dark-card rounded-sm border-2 p-8 relative ${
                  plan.highlighted
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-gray-200 dark:border-dark-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start">
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-500">
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`block text-center py-3 px-6 rounded-sm font-medium transition ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
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
    </div>
  )
}
