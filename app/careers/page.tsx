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
          <Link href="/" className="flex items-center">
            <Image src="/images/onlyworks-logo.png" alt="OnlyWorks" width={120} height={30} className="h-6 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>
          <Link href="/downloads" className="btn btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge mb-6">We're Hiring</span>
            <h1 className="mb-6">Join our team</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Help us build the future of work verification. We're looking for talented people who want to make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Remote-first', desc: 'Work from anywhere in the world. We believe in flexibility and trust.' },
              { title: 'Impact-driven', desc: 'Your work directly shapes how millions verify their productivity.' },
              { title: 'Growth-focused', desc: 'We invest in your development with learning budgets and mentorship.' }
            ].map((value, i) => (
              <div key={i} className="text-center">
                <h3 className="mb-2">{value.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Product */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="mb-4">What you'll be building</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Join us in creating a product that helps professionals verify their work authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="card p-0 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/Screenshot 2026-01-07 at 10.47.53 PM.png"
                  alt="OnlyWorks app dark mode"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2">Dark Mode</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Our desktop app features a sleek dark mode for comfortable all-day use. Real-time session tracking and productivity insights.
                </p>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/Screenshot 2026-01-07 at 10.48.07 PM.png"
                  alt="OnlyWorks app light mode"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2">Light Mode</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Clean, modern interface with intuitive navigation. Track sessions, view analytics, and generate verified reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center">Open positions</h2>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="card cursor-pointer hover:border-[var(--text)] transition-colors"
                  onClick={() => openModal(job)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
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
                    <ArrowRight className="w-5 h-5 hidden md:block" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
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
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Don't see a perfect fit?</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <Image src="/images/onlyworks-logo.png" alt="OnlyWorks" width={100} height={25} className="h-5 w-auto" />
            <div className="flex flex-wrap gap-6">
              <Link href="/about" className="footer-link">About</Link>
              <Link href="/pricing" className="footer-link">Pricing</Link>
              <Link href="/careers" className="footer-link">Careers</Link>
              <Link href="/privacy" className="footer-link">Privacy</Link>
              <Link href="/terms" className="footer-link">Terms</Link>
              <Link href="/security" className="footer-link">Security</Link>
              <Link href="/support" className="footer-link">Support</Link>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</p>
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
