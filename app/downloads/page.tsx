'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Monitor, Apple, Download } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

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

      <Footer />
    </div>
  )
}
