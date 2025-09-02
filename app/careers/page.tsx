'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useTheme } from '@/lib/contexts/theme-context'
import { Sun, Moon, MapPin, Clock, DollarSign } from 'lucide-react'

export default function CareersPage() {
  const { theme, toggleTheme } = useTheme()

  const openings = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'Build and scale our AI-powered productivity platform using Next.js, TypeScript, and Supabase.',
    },
    {
      title: 'Machine Learning Engineer',
      department: 'AI/ML',
      location: 'Remote / SF',
      type: 'Full-time',
      salary: '$140k - $200k',
      description: 'Improve our computer vision models and productivity analysis algorithms.',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $150k',
      description: 'Design intuitive interfaces that help users understand and improve their productivity.',
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
              
              <Link href="/login" className="btn-clean btn-primary-clean">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-gray-100">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Help us build the future of productivity tracking
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-sm p-6 mb-12">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4">Why OnlyWorks?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-purple-800 dark:text-purple-300">
              <div>
                <h3 className="font-semibold mb-2">🚀 Impact</h3>
                <p className="text-sm">Help millions improve their productivity and work-life balance</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🌍 Remote First</h3>
                <p className="text-sm">Work from anywhere with flexible hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💰 Competitive</h3>
                <p className="text-sm">Top-tier compensation and equity packages</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Open Positions</h2>
          
          <div className="space-y-6">
            {openings.map((job) => (
              <div key={job.title} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-sm">
                    {job.department}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {job.description}
                </p>
                
                <a href={`mailto:admin@only-works.com?subject=Application: ${job.title}`}
                  className="inline-block px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark transition"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
