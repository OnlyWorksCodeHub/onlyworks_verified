'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MapPin, Clock, Briefcase, ArrowRight, X } from 'lucide-react'

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
}

const jobs: Job[] = [
  {
    id: 'senior-frontend',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build the next generation of our web application using React, Next.js, and TypeScript. You\'ll work on features that help professionals verify their work authenticity.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Experience with Next.js and modern CSS frameworks',
      'Strong understanding of web performance optimization',
      'Excellent communication skills'
    ]
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design and build scalable backend systems that power our verification platform. Work with Node.js, PostgreSQL, and cloud infrastructure.',
    requirements: [
      '3+ years of backend development experience',
      'Proficiency in Node.js and SQL databases',
      'Experience with cloud platforms (AWS/GCP)',
      'Understanding of security best practices'
    ]
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    location: 'Remote',
    type: 'Full-time',
    description: 'Develop and improve our AI models for fraud detection and work pattern analysis. Push the boundaries of what\'s possible in automated verification.',
    requirements: [
      '3+ years of ML engineering experience',
      'Strong Python skills and familiarity with PyTorch/TensorFlow',
      'Experience with computer vision or anomaly detection',
      'Published research is a plus'
    ]
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Shape the user experience of our platform. Create intuitive interfaces that make work verification seamless and trustworthy.',
    requirements: [
      '4+ years of product design experience',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with Figma and design systems',
      'Ability to conduct user research'
    ]
  }
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    portfolio: '',
    message: ''
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Load Turnstile script
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script')
      script.id = 'turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (isModalOpen && turnstileRef.current && window.turnstile) {
      // Small delay to ensure the container is rendered
      const timer = setTimeout(() => {
        if (turnstileRef.current && !widgetIdRef.current) {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
            callback: (token: string) => {
              setTurnstileToken(token)
            },
            'expired-callback': () => {
              setTurnstileToken(null)
            },
            'error-callback': () => {
              setTurnstileToken(null)
              toast.error('Verification failed. Please try again.')
            },
            theme: 'light'
          })
        }
      }, 100)
      return () => clearTimeout(timer)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [isModalOpen])

  const openModal = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    setTurnstileToken(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
    setFormData({ name: '', email: '', linkedin: '', portfolio: '', message: '' })
    setResumeFile(null)
    setTurnstileToken(null)
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current)
      widgetIdRef.current = null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      toast.error('Please complete the verification')
      return
    }

    if (!selectedJob) return

    setIsLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('jobId', selectedJob.id)
      submitData.append('jobTitle', selectedJob.title)
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('linkedin', formData.linkedin)
      submitData.append('portfolio', formData.portfolio)
      submitData.append('message', formData.message)
      submitData.append('turnstileToken', turnstileToken)
      if (resumeFile) {
        submitData.append('resume', resumeFile)
      }

      const res = await fetch('/api/job-applications', {
        method: 'POST',
        body: submitData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      toast.success('Application submitted successfully!')
      closeModal()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      // Reset Turnstile on error
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/">
            <Image src="/images/logo.png" alt="OnlyWorks" width={32} height={32} className="logo-icon" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
          </div>
          <Link href="/downloads" className="btn btn-primary">
            Access
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full" style={{ background: '#8b5cf6', color: '#fff' }}>
              We're Hiring — {jobs.length} open roles
            </span>
            <h1 className="mb-6">Join our team</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Help us build the future of work verification.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-10 text-center">Open positions</h2>

            <div className="space-y-4">
              {jobs.map((job, index) => {
                const deptColors: Record<string, string> = {
                  'Engineering': '#ede9fe',
                  'AI/ML': '#ede9fe',
                  'Design': '#ede9fe'
                }
                const deptTextColors: Record<string, string> = {
                  'Engineering': '#8b5cf6',
                  'AI/ML': '#8b5cf6',
                  'Design': '#8b5cf6'
                }
                return (
                  <div
                    key={job.id}
                    className="group cursor-pointer rounded-xl p-6 transition-all hover:shadow-lg"
                    style={{
                      background: '#fff',
                      border: '1px solid var(--border)',
                    }}
                    onClick={() => openModal(job)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                              background: deptColors[job.department] || '#f5f5f5',
                              color: deptTextColors[job.department] || '#525252'
                            }}
                          >
                            {job.department}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 group-hover:underline">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 hidden md:block transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {jobs.length === 0 && (
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                No open positions at the moment. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Don't see a perfect fit?</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { title: 'Remote-first', desc: 'Work from anywhere. We believe in flexibility and trust.' },
                { title: 'Impact-driven', desc: 'Your work shapes how millions verify their productivity.' },
                { title: 'Growth-focused', desc: 'Learning budgets, mentorship, and room to grow.' }
              ].map((value, i) => (
                <div key={i} className="text-center p-4">
                  <h3 className="text-sm font-medium mb-1">{value.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{value.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/contact" className="btn btn-primary">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="mb-1">Apply for {selectedJob.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {selectedJob.department} · {selectedJob.location}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[var(--bg-alt)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {selectedJob.description}
              </p>
              <h4 className="text-sm font-medium mb-2">Requirements:</h4>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                {selectedJob.requirements.map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name *"
                  required
                  className="input"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email *"
                  required
                  className="input"
                />
              </div>
              <div>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="LinkedIn profile URL"
                  className="input"
                />
              </div>
              <div>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="Portfolio / GitHub URL"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Resume (PDF, max 5MB)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="input text-sm"
                  style={{ padding: '12px' }}
                />
              </div>
              <div>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Why are you interested in this role?"
                  rows={3}
                  className="input"
                  style={{ height: 'auto', padding: '16px' }}
                />
              </div>

              {/* Cloudflare Turnstile Widget */}
              <div className="flex justify-center">
                <div ref={turnstileRef}></div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !turnstileToken}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Submitting...' : 'Submit application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
