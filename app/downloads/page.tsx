'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Apple, Monitor, Download, CheckCircle, Shield, Zap, RefreshCw } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GridBackground, GeometricPattern, FloatingParticles, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BinaryRain, CodeDecoration, WatermarkText, ASCIIBlock, ScanLines, ConnectionLines } from '@/components/ui/decorative-fills'

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

  const platforms = [
    {
      num: '01',
      icon: Apple,
      title: 'macOS',
      subtitle: 'Apple Silicon & Intel',
      requirement: 'macOS 10.15+',
      primary: { label: 'Download for Mac', platform: 'mac', arch: 'arm64' },
      links: [
        { label: 'Apple Silicon', platform: 'mac', arch: 'arm64' },
        { label: 'Intel', platform: 'mac', arch: 'intel' },
      ],
    },
    {
      num: '02',
      icon: Monitor,
      title: 'Windows',
      subtitle: '64-bit',
      requirement: 'Windows 10+',
      primary: { label: 'Download for Windows', platform: 'windows', arch: 'x64' },
      links: [],
    },
  ]

  const features = [
    { icon: Shield, title: 'Privacy-first', desc: 'You control what gets captured. End-to-end encrypted.' },
    { icon: Zap, title: 'AI reports locally', desc: 'Reports generated on-device. Your data stays yours.' },
    { icon: RefreshCw, title: 'Auto-updates', desc: 'Always on the latest version. Zero effort.' },
    { icon: CheckCircle, title: 'Free forever', desc: 'No account required to start. Basic plan is free.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <GridBackground />
        <BinaryRain columns={6} />
        <CodeDecoration side="right" />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <AnimatedGradientText className="text-sm font-mono">
              <span className="w-8 h-px bg-foreground/30 mr-3 inline-block" />
              Download
            </AnimatedGradientText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-8"
          >
            <span className="block">Get</span>
            <span className="block">OnlyWorks</span>
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-md text-xl lg:text-2xl leading-relaxed"
              style={{ color: '#57554f' }}
            >
              Available for macOS and Windows. Set up in under a minute. Start proving your work today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <ShimmerButton
                shimmerColor="#a78bfa"
                background="rgba(139, 92, 246, 1)"
                borderRadius="1.75rem"
                onClick={() => handleDownload('mac', 'arm64')}
                disabled={downloading !== null}
                className="h-14 px-8 text-base font-medium disabled:opacity-50"
              >
                Download free
                <ArrowRight className="w-4 h-4 ml-2" />
              </ShimmerButton>
              <Link
                href="/support"
                className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
              >
                View setup guide
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS ═══ */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <GeometricPattern className="right-0 top-0 w-[400px] h-[400px] opacity-30" />
        <FloatingParticles count={6} />
        <WatermarkText text="DOWNLOAD" />
        <ASCIIBlock variant="logo" className="absolute right-12 top-16" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Platforms
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Choose your<br /><span className="text-muted-foreground">platform.</span>
            </motion.h2>
          </div>

          <div>
            {platforms.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-10 lg:py-14 border-b border-foreground/10">
                  <div className="shrink-0">
                    <span className="font-mono text-sm text-muted-foreground">{p.num}</span>
                  </div>
                  <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                          <p.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-display group-hover:translate-x-2 transition-transform duration-500">{p.title}</h3>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-1">{p.subtitle}</p>
                      <p className="text-sm font-mono text-muted-foreground">{p.requirement}</p>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-4">
                      <ShimmerButton
                        shimmerColor="#a78bfa"
                        background="rgba(139, 92, 246, 1)"
                        borderRadius="1.75rem"
                        onClick={() => handleDownload(p.primary.platform, p.primary.arch)}
                        disabled={downloading !== null}
                        className="h-14 px-8 text-base font-medium disabled:opacity-50"
                      >
                        {downloading === `${p.primary.platform}-${p.primary.arch}` ? 'Downloading...' : p.primary.label}
                        {downloading !== `${p.primary.platform}-${p.primary.arch}` && (
                          <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                      </ShimmerButton>
                      {p.links.length > 0 && (
                        <div className="flex gap-4 text-sm">
                          {p.links.map((link) => (
                            <button
                              key={link.arch}
                              onClick={() => handleDownload(link.platform, link.arch)}
                              className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                            >
                              {link.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES — 2x2 grid ═══ */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true" style={{ backgroundImage: `radial-gradient(circle, #080503 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <PulsingRings className="right-0 bottom-0 w-[350px] h-[350px] opacity-20" />
        <ConnectionLines className="opacity-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              What you get
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Built for<br /><span className="text-muted-foreground">privacy.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-10 group"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-foreground/10 mb-4 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-display tracking-tight mb-2">{f.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DARK SECTION — System requirements ═══ */}
      <section className="relative py-16 lg:py-24" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)` }} />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Requirements
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
              style={{ color: '#fafaf9' }}
            >
              System<br /><span style={{ color: 'rgba(250,250,249,0.5)' }}>requirements.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-0">
              {[
                { num: 'I', title: 'macOS', items: ['macOS 10.15 (Catalina) or later', 'Apple Silicon or Intel processor', '200MB disk space', 'Screen Recording & Accessibility permissions'] },
                { num: 'II', title: 'Windows', items: ['Windows 10 or later', '64-bit processor', '200MB disk space', 'Administrator access for installation'] },
              ].map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="py-6 border-b transition-all duration-500 group"
                  style={{ borderColor: 'rgba(250,250,249,0.1)' }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl" style={{ color: 'rgba(250,250,249,0.3)' }}>{req.num}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#fafaf9' }}>{req.title}</h3>
                      <ul className="space-y-1.5">
                        {req.items.map((item, j) => (
                          <li key={j} className="text-base leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div className="border overflow-hidden" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>quick-start.sh</span>
                </div>
                <div className="p-6 font-mono text-sm" style={{ color: 'rgba(250,250,249,0.7)' }}>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>1 </span>
                    # Download and install
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>2 </span>
                    open OnlyWorks.dmg
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>3 </span>
                    &nbsp;
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>4 </span>
                    # Grant permissions
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>5 </span>
                    # Screen Recording + Accessibility
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>6 </span>
                    &nbsp;
                  </div>
                  <div className="leading-loose">
                    <span style={{ color: 'rgba(250,250,249,0.2)' }}>7 </span>
                    # Start working. That&apos;s it.
                  </div>
                </div>
                <div className="px-6 py-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden="true" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #080503 30px, #080503 31px)` }} />
        <GeometricPattern className="left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-30" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-6 leading-[0.95]">
                    Ready to prove<br />your work?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    Download OnlyWorks free. No account required to start.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <button
                      onClick={() => handleDownload('mac', 'arm64')}
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      Download free
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                    >
                      Back to home
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 font-mono">No credit card required</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
          </motion.div>

          {/* Uninstall link */}
          <div className="mt-8 text-center">
            <p className="text-xs font-mono text-muted-foreground mb-2">Need a fresh start?</p>
            <a
              href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER/releases/download/v1/UninstallOnlyWorks.dmg"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4"
            >
              <Download className="w-3.5 h-3.5" /> Download Uninstaller (Mac)
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
