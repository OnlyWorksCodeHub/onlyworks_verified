'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Monitor, Apple } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'

export default function DownloadsPage() {
  const [accessCode, setAccessCode] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = accessCode.trim().toUpperCase()
    if (code === 'ONLYWORKS' || code === 'OW2025') {
      setHasAccess(true)
      setError('')
      toast.success('Access granted!')
    } else {
      setError('Invalid access code.')
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactForm.email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join waitlist')
      }

      toast.success('You\'re on the list! We\'ll notify you when we launch.')
      setContactForm({ name: '', email: '', company: '', message: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async (platform: string, arch: string) => {
    const key = `${platform}-${arch}`
    setDownloading(key)
    try {
      const res = await fetch('/api/desktop/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, arch }),
      })
      const data = await res.json()
      if (data.success && data.downloadUrl) {
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.setAttribute('download', '')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Download started')
      } else {
        toast.error('Not available yet.')
      }
    } catch {
      toast.error('Download failed.')
    } finally {
      setDownloading(null)
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen">
        <Navigation />

        <div className="min-h-screen grid md:grid-cols-2 pt-20">
          {/* Left - Access Code */}
          <div className="flex items-center justify-center p-8 md:p-12" style={{ background: 'var(--bg)' }}>
            <div className="max-w-sm w-full">
              <h1 className="text-3xl font-medium mb-2">Enter access code</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Already have an access code? Enter it below to download.
              </p>
              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="input font-mono"
                  required
                />
                {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
                <button type="button" onClick={(e) => handleAccessSubmit(e)} className="btn btn-primary w-full">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-8">
                <Link href="/" className="inline-flex items-center text-sm hover:text-[#8b5cf6]" style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Waitlist */}
          <div className="flex items-center justify-center p-8 md:p-12 border-l" style={{ background: 'var(--bg-alt)' }}>
            <div className="max-w-sm w-full">
              <h2 className="text-3xl font-medium mb-2">Join the waitlist</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Be the first to know when we launch. Get early access.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="input"
                  required
                />
                <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                  {submitting ? 'Joining...' : 'Join Waitlist'}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              <p className="mt-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Downloads */}
      <section className="flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="text-center px-6">
          <h1 className="mb-4">Downloads</h1>
          <p className="mb-12" style={{ color: 'var(--text-secondary)' }}>Get the desktop app.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="icon-wrap mx-auto mb-4">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="mb-1">macOS</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>10.15 or later</p>
              <button
                onClick={() => handleDownload('mac', 'arm64')}
                disabled={downloading?.startsWith('mac-')}
                className="btn btn-primary w-full mb-3"
              >
                {downloading?.startsWith('mac-') ? 'Downloading...' : 'Download'}
                {!downloading?.startsWith('mac-') && <ArrowRight className="w-4 h-4" />}
              </button>
              <div className="flex justify-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <button onClick={() => handleDownload('mac', 'arm64')} className="hover:underline">Apple Silicon</button>
                <span>·</span>
                <button onClick={() => handleDownload('mac', 'intel')} className="hover:underline">Intel</button>
              </div>
            </div>

            <div className="card text-center">
              <div className="icon-wrap mx-auto mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="mb-1">Windows</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>10 or later</p>
              <button
                onClick={() => handleDownload('windows', 'x64')}
                disabled={downloading === 'windows-x64'}
                className="btn btn-primary w-full"
              >
                {downloading === 'windows-x64' ? 'Downloading...' : 'Download'}
                {downloading !== 'windows-x64' && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="inline-flex items-center text-sm hover:text-[#8b5cf6]" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
            </Link>
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
    </div>
  )
}
