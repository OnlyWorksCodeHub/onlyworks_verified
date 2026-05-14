'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, BarChart3, Shield, Users, ArrowRight, Check, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GridBackground, FloatingParticles, GeometricPattern, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BinaryRain, WatermarkText, ConnectionLines, CodeDecoration } from '@/components/ui/decorative-fills'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL } from '@/lib/config'

export default function HiringPage() {
  const { backendToken, user } = useAuth()
  const [formData, setFormData] = useState({ company: '', job_title: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!backendToken) {
      toast.error('Please sign in first to create a hiring manager account.')
      return
    }
    if (!formData.company.trim()) {
      toast.error('Company name is required.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${backendToken}` },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setIsRegistered(true)
      toast.success('Hiring manager account created!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const benefits = [
    { icon: CheckCircle, title: 'Verified history', desc: 'Real work output, not resume claims. See exactly what a candidate built and how they work.' },
    { icon: BarChart3, title: 'Work insights', desc: 'Tools used, focus patterns, quality metrics. Understand how someone works before they join.' },
    { icon: Shield, title: 'Tamper-proof', desc: 'Can\'t be faked or exaggerated. Cryptographic verification on every data point.' },
    { icon: Users, title: 'Team fit', desc: 'Work style compatibility signals. Find people who match your team culture.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <GridBackground />
        <BinaryRain />
        <ConnectionLines className="opacity-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <AnimatedGradientText className="text-sm font-mono">
              <span className="w-8 h-px bg-foreground/30 mr-3 inline-block" />
              For hiring teams
              <span className="w-8 h-px bg-foreground/30 ml-3 inline-block" />
            </AnimatedGradientText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-8"
          >
            Hire with<br />confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Search candidates with verified, work-proven skills. No more guessing if a resume is real.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-3 max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills — React, Python, Design..."
                className="w-full h-14 pl-12 pr-4 text-base rounded-full border border-foreground/15 bg-background focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-full font-medium text-white transition-all hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-25" />
        <FloatingParticles count={6} />
        <WatermarkText text="HIRE" />
        <CodeDecoration side="right" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Benefits
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Why OnlyWorks<br /><span className="text-muted-foreground">for hiring.</span>
            </motion.h2>
          </div>

          <div>
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
                  <div className="shrink-0">
                    <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">{b.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                      <div className="w-16 h-16 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                        <b.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              The problem
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Hiring is<br /><span className="text-muted-foreground">broken.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {[
              { value: '85%', label: 'of resumes contain exaggerations' },
              { value: '40%', label: 'of new hires fail within 18 months' },
              { value: '$15K', label: 'average cost of a bad hire' },
              { value: '23hrs', label: 'spent per hire on screening' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-12"
              >
                <div className="text-6xl lg:text-8xl font-display tracking-tight">{stat.value}</div>
                <div className="mt-4 text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REGISTRATION ═══ */}
      <section id="register" className="relative py-24 lg:py-32 overflow-hidden">
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Get started
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl lg:text-6xl font-display tracking-tight mb-8"
              >
                Start hiring<br />smarter.
              </motion.h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                Create a free hiring manager account to unlock full candidate profiles, shortlists, and verified work history.
              </p>

              <div className="space-y-4">
                {[
                  'Search verified candidates for free',
                  'View full profiles and work history',
                  'Save candidates to shortlists',
                  'Upgrade to post jobs and auto-match',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {isRegistered ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-foreground/10 p-12 text-center"
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-foreground/10 mx-auto mb-6">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display mb-3">You&apos;re all set!</h3>
                  <p className="text-muted-foreground mb-6">Your hiring manager account is ready.</p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-medium text-white hover:opacity-90 transition-all"
                    style={{ background: '#8b5cf6' }}
                  >
                    Search candidates
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  {!user ? (
                    <div className="border border-foreground/10 p-12 text-center">
                      <h3 className="text-xl font-display mb-3">Sign in to get started</h3>
                      <p className="text-muted-foreground mb-6">Sign in with your account to register as a hiring manager.</p>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-medium text-white hover:opacity-90 transition-all"
                        style={{ background: '#8b5cf6' }}
                      >
                        Sign in
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="border border-foreground/10 p-8 lg:p-10 space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-muted-foreground mb-2">Company *</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Inc."
                          required
                          className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-muted-foreground mb-2">Your title</label>
                        <input
                          type="text"
                          value={formData.job_title}
                          onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                          placeholder="Engineering Manager"
                          className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                        />
                      </div>
                      <ShimmerButton
                        shimmerColor="#a78bfa"
                        background="rgba(139, 92, 246, 1)"
                        borderRadius="1.75rem"
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 px-8 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Creating account...' : 'Create free account'}
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                      </ShimmerButton>
                      <p className="text-center text-xs text-muted-foreground font-mono">Free forever. Upgrade anytime for job posting.</p>
                    </form>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Cross-link: candidates */}
          <div className="mt-16 pt-8 border-t border-foreground/10 text-center">
            <p className="text-sm text-muted-foreground">
              Are you a candidate looking for jobs?{' '}
              <Link href="/talent" className="font-medium hover:underline underline-offset-4 text-foreground">
                Join the Talent Community →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
              <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                Stop guessing.<br />Start knowing.
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                Search verified candidates right now, or create a free account to unlock full profiles.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                  style={{ background: '#8b5cf6' }}
                >
                  Search candidates
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#register"
                  className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  Create free account
                </a>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
