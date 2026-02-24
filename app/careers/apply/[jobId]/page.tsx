'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'
import { findJobById } from '@/lib/data/jobs'

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

export default function ApplyPage() {
  const params = useParams()
  const jobId = params.jobId as string
  const job = findJobById(jobId)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: ''
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const renderTurnstile = () => {
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
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
    }

    // Check if script already exists and is loaded
    const existingScript = document.getElementById('turnstile-script')
    if (existingScript && window.turnstile) {
      renderTurnstile()
      return
    }

    // Load the script if it doesn't exist
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.onload = () => {
        // Wait a tick for turnstile to initialize
        setTimeout(renderTurnstile, 0)
      }
      document.head.appendChild(script)
    } else {
      // Script exists but not loaded yet, poll for it
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval)
          renderTurnstile()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff' }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Job not found</h1>
          <Link href="/careers" className="text-sm" style={{ color: '#0064e0' }}>
            ← Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeFile) {
      toast.error('Please upload your resume')
      return
    }

    setIsLoading(true)

    try {
      // Submit directly to backend to bypass Vercel firewall
      const submitData = new FormData()
      submitData.append('job_id', job.id)
      submitData.append('job_title', job.title)
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      if (formData.phone) submitData.append('phone', formData.phone)
      if (formData.linkedin) submitData.append('linkedin', formData.linkedin)
      if (formData.portfolio) submitData.append('portfolio', formData.portfolio)
      if (formData.coverLetter) submitData.append('cover_letter', formData.coverLetter)
      submitData.append('resume', resumeFile)

      const res = await fetch('/api/job-applications', {
        method: 'POST',
        body: submitData
      })

      if (!res.ok) {
        let errorMessage = 'Failed to submit application'
        try {
          const data = await res.json()
          errorMessage = data.error || errorMessage
        } catch {
          // Response was not JSON (e.g., "Forbidden")
          const text = await res.text().catch(() => '')
          if (text && text.length < 100) {
            errorMessage = text
          }
        }
        throw new Error(errorMessage)
      }

      setIsSubmitted(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ background: '#fff' }}>
        <Toaster position="top-center" />
        <header className="border-b" style={{ borderColor: '#e5e5e5' }}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/careers" className="inline-flex items-center gap-2 text-sm" style={{ color: '#525252' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#dcfce7' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#16a34a' }} />
          </div>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#0a0a0a' }}>
            Application Submitted
          </h1>
          <p className="text-lg mb-8" style={{ color: '#525252' }}>
            Thank you for applying for the {job.title} position. We'll review your application and get back to you within 5 business days.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium"
            style={{ background: '#0a0a0a', color: '#fff' }}
          >
            Back to Careers
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <Toaster position="top-center" />

      {/* Header */}
      <header className="border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm" style={{ color: '#525252' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Job Details - Left Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
                  style={{ background: '#f3f4f6', color: '#525252' }}
                >
                  {job.department}
                </span>
                <h1 className="text-2xl font-semibold mb-2" style={{ color: '#0a0a0a' }}>
                  {job.title}
                </h1>
                <p className="text-sm" style={{ color: '#525252' }}>
                  {job.location} · {job.type}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>About the Role</h3>
                  <p className="text-sm" style={{ color: '#525252', lineHeight: 1.6 }}>
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>Responsibilities</h3>
                  <ul className="space-y-1">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>Requirements</h3>
                  <ul className="space-y-1">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>What We Offer</h3>
                  <ul className="space-y-1">
                    {job.benefits.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="rounded-xl p-8" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#0a0a0a' }}>
                Submit Your Application
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="yourportfolio.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Resume *
                  </label>
                  <div
                    className="relative rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-white"
                    style={{ border: '2px dashed #e5e5e5', background: '#fff' }}
                    onClick={() => document.getElementById('resume-input')?.click()}
                  >
                    <input
                      id="resume-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#a3a3a3' }} />
                    {resumeFile ? (
                      <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>{resumeFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#a3a3a3' }}>
                          PDF or Word (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                    style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                    placeholder="Tell us why you're interested in this internship and what makes you a great fit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#0a0a0a', color: '#fff' }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>

                <p className="text-xs text-center" style={{ color: '#a3a3a3' }}>
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" style={{ color: '#0064e0' }}>Privacy Policy</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
