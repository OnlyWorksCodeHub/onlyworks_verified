'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { useState } from 'react'

export default function UpdatesPage() {
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
  const updates = [
    {
    date: "October 6, 2025",
    title: "MVP Completed — A New Beginning",
    image: "/images/mvp-complete.jpg",
    description: "Today marks a huge moment for OnlyWorks we’ve completed the MVP. From idea to execution, we now have a working product that brings our vision to life: helping professionals make their work undeniable.",
    improvements: [
      "Completed core features for AI-driven work validation",
      "Refined dashboard experience for clarity and performance",
      "Integrated backend with real-time data sync and analytics",
      "Added secure authentication and profile management",
      "Prepared internal demo for first round of user testing"
    ],
    fixes: [
      "Polished UI across key app sections",
      "Resolved minor API inconsistencies between modules",
      "Optimized backend tasks for faster data processing"
    ]
  },
  {
    date: "September 14, 2025",
    title: "Building the Application — The Next Chapter",
    image: "/images/app-development.jpg",
    description: "We’ve officially begun development on the OnlyWorks application creating a focused, intelligent platform that turns professional output into undeniable proof of effort and skill.",
    improvements: [
      "Designed core app flow for tracking and validating work effortlessly",
      "Built early backend systems for scalability and performance",
      "Integrated first AI models for work detection and automation patterning",
      "Developed prototype dashboard for internal testing",
      "Aligned design with website for a seamless brand experience"
    ],
    fixes: [
      "Removed outdated webapp to focus on new architecture",
      "Updated all public materials and social media to reflect current progress",
      "Cleaned up internal tools for faster iteration and testing"
    ]
  },
  {
    date: "August 24, 2025",
    title: "The Website Launch — Our First Public Step",
    image: "/images/website-launch.jpg",
    description: "We launched the new OnlyWorks website — simple, fast, and designed to feel like the product we’re building: professional and effortless. It’s our first look outward.",
    improvements: [
      "Completed full website redesign with modern, responsive UI",
      "Integrated newsletter signup for early supporters",
      "Added product overview, team section, and roadmap preview",
      "Optimized content to reflect OnlyWorks’ tone and direction"
    ],
    fixes: [
      "Refined copy and visuals for brand consistency",
      "Fixed social link and SEO metadata errors",
      "Adjusted color palette and typography for accessibility"
    ]
  },
  {
    date: "August 05, 2025",
    title: "Building the Foundation",
    image: "/images/founder-team.png",
    description: "Once the vision felt right, it was time to make it real. We formed the founding team, documented our first roadmap, and established OnlyWorks as a real company not just a concept.",
    improvements: [
      "Created business documentation and structure for growth",
      "Formed the core founder team and defined early roles",
      "Set up collaboration tools and internal communication systems",
      "Launched official social media channels to start building in public"
    ],
    fixes: [
      "Aligned brand visuals and messaging across platforms",
      "Streamlined internal processes for faster coordination"
    ]
  },
  {
    date: "July 29, 2025",
    title: "The Spark — Where OnlyWorks Begins",
    image: "/images/Outro.mp4",
    description: "OnlyWorks started as a simple idea: professionals deserve a better way to prove their work — clear, undeniable, and free from noise. That idea became the blueprint for everything we’re building.",
    improvements: [
      "Defined the mission and long-term vision for the platform",
      "Outlined product goals centered around credibility and transparency",
      "Sketched early workflows for how AI could validate real work",
      "Built the first internal mockups and flow diagrams"
    ],
    fixes: [
      "Early exploration phase — no major fixes yet"
    ]
  }
]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MobileNavigation currentPage="/updates" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-semibold text-gray-900 mb-6">
            Product Updates
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay up to date with the latest OnlyWorks features, improvements, and insights
            from our team. See what we're building and where we're headed.
          </p>
        </div>
      </section>

      {/* Updates Timeline */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {updates.map((update, index) => (
              <article key={index} className="group">
                <div className="mb-6">
                  <time className="text-sm font-medium text-primary">{update.date}</time>
                  <h2 className="text-3xl font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors cursor-pointer">
                    {update.title}
                  </h2>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center overflow-hidden">
                  {update.image?.endsWith('.mp4') ? (
                    <video
                      src={update.image}
                      controls
                      className="w-full h-full object-cover rounded-xl"
                      preload="metadata"
                    />
                  ) : update.image ? (
                    <Image
                      src={update.image}
                      alt={update.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">Featured image placeholder</p>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {update.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvements</h3>
                    <ul className="space-y-2">
                      {update.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fixes</h3>
                    <ul className="space-y-2">
                      {update.fixes.map((fix, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Stay in the loop</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get notified about new features, improvements, and insights delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
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
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p className="mt-3 text-sm text-center text-gray-600">
                {message}
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
