'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Monitor, Apple, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DownloadsPage() {
  const [accessCode, setAccessCode] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessCode.toUpperCase() === 'OW2025@!') {
      setHasAccess(true)
      setError('')
    } else {
      setError('Invalid access code.')
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
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-sm w-full">
          <div className="icon-wrap mx-auto mb-6">
            <Download className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-medium text-center mb-2">Access required</h1>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Enter your access code to download.
          </p>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="input text-center font-mono"
              required
            />
            {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Need access? <a href="mailto:admin@only-works.com" className="underline">admin@only-works.com</a>
            </p>
            <Link href="/" className="inline-flex items-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Link>
          </div>
        </div>
      </div>
    )
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
        </div>
      </nav>

      {/* Downloads */}
      <section className="pt-40 pb-24">
        <div className="container">
          <div className="max-w-lg mb-12">
            <h1 className="mb-4">Downloads</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Get the desktop app.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
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
            <Link href="/" className="inline-flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
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
              <Link href="/privacy" className="footer-link">Privacy</Link>
              <Link href="/terms" className="footer-link">Terms</Link>
              <Link href="/security" className="footer-link">Security</Link>
              <Link href="/support" className="footer-link">Support</Link>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
