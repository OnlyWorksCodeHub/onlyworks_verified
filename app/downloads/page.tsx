'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, Apple, Monitor, Download } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ScanLines } from '@/components/ui/decorative-fills'

type MacArch = 'arm64' | 'intel' | 'unknown'

async function detectMacArch(): Promise<MacArch> {
  if (typeof navigator === 'undefined') return 'unknown'
  if (!/Mac/i.test(navigator.platform || navigator.userAgent || '')) return 'unknown'

  // Primary: User-Agent Client Hints (Chrome, Edge, Brave on macOS)
  const uaData = (navigator as unknown as { userAgentData?: { getHighEntropyValues: (h: string[]) => Promise<{ architecture?: string }> } }).userAgentData
  if (uaData?.getHighEntropyValues) {
    try {
      const hints = await uaData.getHighEntropyValues(['architecture'])
      if (hints.architecture === 'arm') return 'arm64'
      if (hints.architecture === 'x86') return 'intel'
    } catch {
      // fall through
    }
  }

  // Fallback: WebGL renderer string (Safari/Firefox)
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
      if (/apple/i.test(renderer) && !/intel/i.test(renderer)) return 'arm64'
      if (/(intel|amd|radeon)/i.test(renderer)) return 'intel'
    }
  } catch {
    // fall through
  }

  return 'unknown'
}

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [macArch, setMacArch] = useState<MacArch>('unknown')

  useEffect(() => {
    detectMacArch().then(setMacArch)
  }, [])

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

  const macPrimary = macArch === 'intel'
    ? { label: 'Download for Intel Mac', platform: 'mac', arch: 'intel' }
    : { label: 'Download for Mac', platform: 'mac', arch: 'arm64' }

  const macSecondary = macArch === 'intel'
    ? { label: 'Apple Silicon instead', platform: 'mac', arch: 'arm64' }
    : { label: 'Intel Mac instead', platform: 'mac', arch: 'intel' }

  const macSubtitle = macArch === 'arm64'
    ? 'Apple Silicon detected · M1 / M2 / M3 / M4'
    : macArch === 'intel'
    ? 'Intel Mac detected'
    : 'Apple Silicon (M1–M4) or Intel'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Navigation />

      {/* ═══ ONE SCREEN: narrative + download, no void ═══ */}
      <section className="relative overflow-hidden border-b border-foreground/10">
        <GridBackground />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 lg:pt-28 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">

            {/* LEFT — the pitch, hard */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-5"
              >
                <span className="w-8 h-px bg-foreground/30" />
                Get the new resume
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight"
              >
                The resume is<br />
                <span className="text-muted-foreground">a story anyone</span><br />
                can fake.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 max-w-md text-lg lg:text-xl leading-relaxed"
                style={{ color: '#57554f' }}
              >
                Anyone can write anything. The best storyteller gets hired; the person who
                did the work gets skipped. OnlyWorks replaces the resume with proof built
                from your real work — the part you can&apos;t fake.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-5 text-sm font-mono text-muted-foreground"
              >
                Free for job seekers · macOS &amp; Windows · sign in with Google, LinkedIn or email
              </motion.p>
            </div>

            {/* RIGHT — the download box, the whole point */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-foreground/15"
            >
              <div className="px-6 py-3 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">OnlyWorks · desktop app</span>
                <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Free
                </span>
              </div>

              {/* macOS */}
              <div className="px-6 py-6 border-b border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <Apple className="w-5 h-5" />
                  <span className="font-display text-2xl">macOS</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{macSubtitle}</span>
                </div>

                {macArch === 'unknown' ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ShimmerButton
                      shimmerColor="#a78bfa"
                      background="rgba(139, 92, 246, 1)"
                      borderRadius="1.5rem"
                      onClick={() => handleDownload('mac', 'arm64')}
                      disabled={downloading !== null}
                      className="h-12 px-5 text-sm font-medium disabled:opacity-50 whitespace-nowrap flex-1"
                    >
                      {downloading === 'mac-arm64' ? 'Downloading…' : 'Apple Silicon (M1–M4)'}
                    </ShimmerButton>
                    <ShimmerButton
                      shimmerColor="#a78bfa"
                      background="rgba(139, 92, 246, 1)"
                      borderRadius="1.5rem"
                      onClick={() => handleDownload('mac', 'intel')}
                      disabled={downloading !== null}
                      className="h-12 px-5 text-sm font-medium disabled:opacity-50 whitespace-nowrap flex-1"
                    >
                      {downloading === 'mac-intel' ? 'Downloading…' : 'Intel Mac'}
                    </ShimmerButton>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <ShimmerButton
                      shimmerColor="#a78bfa"
                      background="rgba(139, 92, 246, 1)"
                      borderRadius="1.5rem"
                      onClick={() => handleDownload(macPrimary.platform, macPrimary.arch)}
                      disabled={downloading !== null}
                      className="h-12 px-6 text-sm font-medium disabled:opacity-50"
                    >
                      {downloading === `mac-${macPrimary.arch}` ? 'Downloading…' : macPrimary.label}
                      {downloading !== `mac-${macPrimary.arch}` && <ArrowRight className="w-4 h-4 ml-2" />}
                    </ShimmerButton>
                    <button
                      onClick={() => handleDownload(macSecondary.platform, macSecondary.arch)}
                      disabled={downloading !== null}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors disabled:opacity-50"
                    >
                      {macSecondary.label}
                    </button>
                  </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  macOS 10.15+. Not sure which chip? Apple menu → About This Mac.
                </p>
              </div>

              {/* Windows */}
              <div className="px-6 py-6 border-b border-foreground/10">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="w-5 h-5" />
                  <span className="font-display text-2xl">Windows</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">64-bit · Windows 10+</span>
                </div>
                <ShimmerButton
                  shimmerColor="#a78bfa"
                  background="rgba(139, 92, 246, 1)"
                  borderRadius="1.5rem"
                  onClick={() => handleDownload('windows', 'x64')}
                  disabled={downloading !== null}
                  className="h-12 px-6 text-sm font-medium disabled:opacity-50"
                >
                  {downloading === 'windows-x64' ? 'Downloading…' : 'Download for Windows'}
                  {downloading !== 'windows-x64' && <ArrowRight className="w-4 h-4 ml-2" />}
                </ShimmerButton>
              </div>

              {/* The one note that actually matters */}
              <div className="px-6 py-4">
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                  On first launch you&apos;ll grant Screen Recording &amp; Accessibility
                  permissions. Capture runs only during sessions you start and stop.
                </p>
              </div>
            </motion.div>
          </div>

          {/* tight footer row — uninstall + next step, no big CTA block */}
          <div className="mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/talent"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8b5cf6] hover:underline underline-offset-4"
            >
              See how proof beats a resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER/releases/download/v1/UninstallOnlyWorks.dmg"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Uninstaller (Mac)
              </a>
              <a
                href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER_WINDOWS/releases/download/v1/UninstallOnlyWorks-Windows.zip"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Uninstaller (Windows)
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
