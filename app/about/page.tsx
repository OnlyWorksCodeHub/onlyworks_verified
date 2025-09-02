'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useTheme } from '@/lib/contexts/theme-context'
import { Sun, Moon, Twitter, Linkedin, Github } from 'lucide-react'

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme()

  const team = [
    {
      name: 'Namkha',
      role: 'Founder & CEO',
      bio: 'Building tools to help people work smarter, not harder.',
      twitter: '@namkha',
      linkedin: 'namkha',
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
              <Link href="/teams" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light font-medium transition">
                Teams
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
          <h1 className="text-5xl font-bold tracking-tighter mb-8 text-gray-900 dark:text-gray-100">
            About OnlyWorks
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              We're on a mission to help people understand and improve their productivity through AI-powered insights.
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-sm p-8 mb-12">
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4">Our Story</h2>
              <p className="text-purple-800 dark:text-purple-300">
                OnlyWorks was born from a simple observation: we spend countless hours at our computers, 
                but rarely understand how that time is actually spent. We built OnlyWorks to provide 
                clarity, insights, and actionable recommendations to help you work smarter.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Our Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">🔒 Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is yours. We never sell it, share it, or use it for anything other than helping you.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">🎯 User Focused</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every feature we build starts with user needs. No bloat, no unnecessary complexity.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">🚀 Continuous Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're constantly improving our AI models and features to provide better insights.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">The Team</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {team.map((member) => (
                <div key={member.name} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                  <div className="flex items-center gap-3">
                    <a href={`https://twitter.com/${member.twitter}`} className="text-gray-600 dark:text-gray-400 hover:text-primary">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={`https://linkedin.com/in/${member.linkedin}`} className="text-gray-600 dark:text-gray-400 hover:text-primary">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 rounded-sm p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Ready to improve your productivity?
              </h3>
              <Link href="/login" className="btn-clean btn-primary-clean inline-block">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
