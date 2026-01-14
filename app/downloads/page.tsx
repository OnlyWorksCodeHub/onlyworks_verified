'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Monitor, Apple, Loader2, Download } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'

export default function DownloadsPage() {
  const [email, setEmail] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    status?: string
    trialDaysRemaining?: number | null
  } | null>(null)

  // Handle success redirect from Stripe and auto-verify access code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Handle success message
    if (params.get('success') === 'true') {
      toast.success('Payment successful!', { duration: 4000 })
    }

    // Auto-verify if access code is in URL
    const code = params.get('code')
    if (code) {
      setValidating(true)
      fetch('/api/access-codes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setHasAccess(true)
            setSubscriptionInfo({
              status: data.status,
              trialDaysRemaining: data.trialDaysRemaining
            })
            if (data.email) setEmail(data.email)
            toast.success(data.message || 'Access granted!')
          } else {
            setError(data.error || 'Invalid access code')
          }
        })
        .catch(() => {
          setError('Failed to verify access code')
        })
        .finally(() => {
          setValidating(false)
          // Clean up URL
          window.history.replaceState({}, '', '/downloads')
        })
    }
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidating(true)

    try {
      const res = await fetch('/api/subscriptions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await res.json()

      if (data.valid) {
        setHasAccess(true)
        setSubscriptionInfo({
          status: data.status,
          trialDaysRemaining: data.trialDaysRemaining
        })
        toast.success(data.message || 'Access granted!')
      } else {
        setError(data.error || 'No active subscription found.')
      }
    } catch {
      setError('Failed to verify. Please try again.')
    } finally {
      setValidating(false)
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

  // Show loading state while auto-verifying code from URL
  if (validating && !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#8b5cf6' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Verifying your access...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen">
        <Toaster position="top-center" />
        <Navigation />

        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-20">
          {/* Left - Email Verification */}
          <div className="flex items-center justify-center p-6 md:p-12" style={{ background: 'var(--bg)' }}>
            <div className="max-w-sm w-full">
              <h1 className="text-2xl md:text-3xl font-medium mb-2">Verify your email</h1>
              <p className="text-sm mb-6 md:mb-8" style={{ color: 'var(--text-secondary)' }}>
                Enter the email you used to start your free trial.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
                {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
                <button type="submit" disabled={validating} className="btn btn-primary w-full">
                  {validating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <div className="mt-6 md:mt-8">
                <Link href="/" className="inline-flex items-center text-sm hover:text-[#8b5cf6]" style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Start Trial */}
          <div className="flex items-center justify-center p-6 md:p-12 border-t md:border-t-0 md:border-l" style={{ background: 'var(--bg-alt)' }}>
            <div className="max-w-sm w-full text-center">
              <h2 className="text-2xl md:text-3xl font-medium mb-2">New here?</h2>
              <p className="text-sm mb-6 md:mb-8" style={{ color: 'var(--text-secondary)' }}>
                Start your 14-day free trial to get access to downloads.
              </p>
              <Link href="/pricing" className="btn btn-primary w-full inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 md:mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
                Full access to all Pro features. No charge until trial ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navigation />

      {/* Downloads */}
      <section className="flex-1 pt-24 md:pt-32 pb-12 md:pb-16 px-4">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h1 className="mb-3 md:mb-4">Download OnlyWorks</h1>
            <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              Get started with our desktop app. Available for macOS and Windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {/* macOS Card */}
            <div
              className="rounded-2xl p-6 md:p-10 text-center transition-all hover:scale-[1.02]"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
              }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)' }}
              >
                <Apple className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">macOS</h2>
              <p className="text-sm mb-1 md:mb-2" style={{ color: 'var(--text-muted)' }}>
                Requires macOS 10.15 or later
              </p>
              <p className="text-xs mb-6 md:mb-8" style={{ color: 'var(--text-muted)' }}>
                Native support for Apple Silicon & Intel
              </p>

              <button
                onClick={() => handleDownload('mac', 'arm64')}
                disabled={downloading?.startsWith('mac-')}
                className="btn btn-primary w-full text-sm md:text-base py-3 md:py-4 mb-3 md:mb-4"
              >
                {downloading?.startsWith('mac-') ? 'Downloading...' : 'Download for Mac'}
                {!downloading?.startsWith('mac-') && <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <div className="flex justify-center gap-4 md:gap-6 text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                <button
                  onClick={() => handleDownload('mac', 'arm64')}
                  className="hover:text-[var(--text)] transition-colors underline underline-offset-2"
                >
                  Apple Silicon
                </button>
                <button
                  onClick={() => handleDownload('mac', 'intel')}
                  className="hover:text-[var(--text)] transition-colors underline underline-offset-2"
                >
                  Intel Chip
                </button>
              </div>
            </div>

            {/* Windows Card */}
            <div
              className="rounded-2xl p-6 md:p-10 text-center transition-all hover:scale-[1.02]"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
              }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6"
                style={{ background: 'linear-gradient(135deg, #0078D4 0%, #00BCF2 100%)' }}
              >
                <Monitor className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Windows</h2>
              <p className="text-sm mb-1 md:mb-2" style={{ color: 'var(--text-muted)' }}>
                Requires Windows 10 or later
              </p>
              <p className="text-xs mb-6 md:mb-8" style={{ color: 'var(--text-muted)' }}>
                64-bit systems supported
              </p>

              <button
                onClick={() => handleDownload('windows', 'x64')}
                disabled={downloading === 'windows-x64'}
                className="btn btn-primary w-full text-sm md:text-base py-3 md:py-4 mb-3 md:mb-4"
              >
                {downloading === 'windows-x64' ? 'Downloading...' : 'Download for Windows'}
                {downloading !== 'windows-x64' && <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
              </button>

              <div className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Windows 10/11 (64-bit)</span>
              </div>
            </div>
          </div>

          {/* Reinstall Section */}
          <div className="mt-12 md:mt-16 pt-8 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Need to do a fresh reinstall?
            </p>
            <a
              href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER/releases/download/v1/UninstallOnlyWorks.dmg"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors hover:bg-[#8b5cf6]/10"
              style={{ color: '#8b5cf6', border: '1px solid #8b5cf6' }}
            >
              <Download className="w-4 h-4" />
              Download Uninstaller (Mac)
            </a>
            <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              Opens the uninstaller app. Double-click to remove OnlyWorks and all its data.
            </p>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <Link href="/" className="inline-flex items-center text-sm hover:text-[#8b5cf6] transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
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
