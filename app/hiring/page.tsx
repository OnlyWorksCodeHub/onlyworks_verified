'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, BarChart3, Shield, ArrowRight, Check, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GridBackground, GeometricPattern, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BinaryRain, WatermarkText, ConnectionLines, CodeDecoration } from '@/components/ui/decorative-fills'

export default function HiringPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', job_title: '', team_size: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and work email are required.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/hiring-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to join the waitlist')
      setIsSubmitted(true)
      toast.success("You're on the list!")
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

  const oldWay = [
    '"Led a team of 8." — Says who? You take their word.',
    '"Shipped a 10x perf win." — No diff, no commit, no proof.',
    '"Expert in React." — Written by a stranger. Or by AI.',
    'The polished resume gets the interview. The real worker gets skipped.',
  ]

  const newWay = [
    { icon: CheckCircle, title: 'You read the work, not the claim.', desc: 'A profile is built from what the candidate actually did — drawn from real work sessions, not typed into a box.' },
    { icon: Shield, title: 'Skills come with receipts.', desc: 'Each skill is marked "Verified ×N" when an AI corroborates it against the candidate\'s own real work. They can\'t fake having done it.' },
    { icon: BarChart3, title: 'You hire on evidence.', desc: 'See the real output behind a skill before you interview. Screen on proof, not on who writes the best paragraph.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO — employer POV ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-12 lg:pb-16 overflow-hidden">
        <GridBackground />
        <BinaryRain />
        <ConnectionLines className="opacity-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              For people who hire
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight mb-6 max-w-5xl"
          >
            You&apos;re hiring<br />faked resumes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg lg:text-lg lg:text-xl text-muted-foreground leading-snug max-w-2xl mb-8"
          >
            A resume is a claim. Claims are easy to fake and hard to check. So you keep hiring the best storyteller, not the best worker — and you learn which one you got after they start. OnlyWorks is the new resume: proof built from real work. Screen on evidence.
          </motion.p>

          {/* Search bar — free to search */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search proven skills — React, Python, Design..."
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-3 text-sm font-mono text-muted-foreground"
          >
            Searching is free and open now.{' '}
            <a href="#register" className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors">
              Join the waitlist
            </a>{' '}
            for the full hiring toolkit — post jobs and auto-match proven candidates.
          </motion.p>
        </div>
      </section>

      {/* ═══ THE BROKEN SYSTEM → THE FIX (side by side) ═══ */}
      <section className="relative py-12 lg:py-16 overflow-hidden border-t border-foreground/10">
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-20" />
        <WatermarkText text="PROOF" />
        <CodeDecoration side="right" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-px bg-foreground/15 border border-foreground/15">
            {/* Old way */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#1c1b18] text-stone-100 p-8 lg:p-12"
            >
              <span className="inline-flex items-center gap-3 text-xs font-mono text-stone-400 mb-6">
                <span className="w-8 h-px bg-stone-500" />
                The resume
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight leading-[0.95] mb-8">
                Hiring on a story.
              </h2>
              <ul className="space-y-5">
                {oldWay.map((line, i) => (
                  <li key={i} className="flex gap-4 text-lg text-stone-300 leading-snug">
                    <X className="w-5 h-5 shrink-0 mt-1 text-stone-500" strokeWidth={2.5} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* New way */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-background p-8 lg:p-12"
            >
              <span className="inline-flex items-center gap-3 text-xs font-mono text-[#8b5cf6] mb-6">
                <span className="w-8 h-px bg-[#8b5cf6]" />
                The OnlyWorks profile
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight leading-[0.95] mb-8">
                Hiring on proof.
              </h2>
              <ul className="space-y-7">
                {newWay.map((b, i) => (
                  <li key={i} className="flex gap-4">
                    <b.icon className="w-6 h-6 shrink-0 mt-1 text-[#8b5cf6]" />
                    <div>
                      <h3 className="text-lg font-medium mb-1">{b.title}</h3>
                      <p className="text-muted-foreground leading-snug">{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WAITLIST ═══ */}
      <section id="register" className="relative py-12 lg:py-16 overflow-hidden">
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-5">
                <span className="w-8 h-px bg-foreground/30" />
                Early access
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl lg:text-6xl font-display tracking-tight mb-5"
              >
                Search today.<br />Hire on proof next.
              </motion.h2>
              <p className="text-lg text-muted-foreground leading-snug mb-8 max-w-md">
                Searching proven candidates and reading their full profiles is open and free right now. The full hiring toolkit — post jobs and let OnlyWorks auto-match the people who already proved the skill — is rolling out next. Join the waitlist and you&apos;re first in line.
              </p>

              <div className="space-y-3">
                {[
                  'Search verified candidates — open & free today',
                  'Read full profiles and real work history — free',
                  'Post jobs + auto-match — early access via the waitlist',
                  'Founding hiring managers hear from us first',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[15px]">
                    <Check className="w-4 h-4 shrink-0 text-[#8b5cf6]" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-foreground/10 p-8 lg:p-10 text-center"
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-foreground/10 mx-auto mb-5">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display mb-2">You&apos;re on the list.</h3>
                  <p className="text-muted-foreground mb-6">We&apos;ll email you the moment the full hiring toolkit opens up. In the meantime, candidate search is already free.</p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-medium text-white hover:opacity-90 transition-all"
                    style={{ background: '#8b5cf6' }}
                  >
                    Search candidates now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  onSubmit={handleWaitlist}
                  className="border border-foreground/10 p-8 lg:p-10 space-y-6"
                >
                  <div>
                    <label htmlFor="wl-name" className="block text-xs font-mono text-muted-foreground mb-2">Full name *</label>
                    <input
                      id="wl-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="wl-email" className="block text-xs font-mono text-muted-foreground mb-2">Work email *</label>
                    <input
                      id="wl-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@acme.com"
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="wl-company" className="block text-xs font-mono text-muted-foreground mb-2">Company</label>
                    <input
                      id="wl-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="wl-title" className="block text-xs font-mono text-muted-foreground mb-2">Your title</label>
                    <input
                      id="wl-title"
                      type="text"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="Engineering Manager"
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="wl-team-size" className="block text-xs font-mono text-muted-foreground mb-2">Team size</label>
                    <select
                      id="wl-team-size"
                      value={formData.team_size}
                      onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    >
                      <option value="">Select…</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-1000">201–1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <ShimmerButton
                    shimmerColor="#a78bfa"
                    background="rgba(139, 92, 246, 1)"
                    borderRadius="1.75rem"
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 px-8 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Joining…' : 'Join the waitlist'}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </ShimmerButton>
                  <p className="text-center text-xs text-muted-foreground font-mono">No spam. We&apos;ll only email you when hiring access is ready.</p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLOSING LINE — ROI, hiring-manager voice ═══ */}
      <section className="relative py-12 lg:py-16 overflow-hidden border-t border-foreground/10" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <BinaryRain />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-display tracking-tight leading-[0.95]"
            >
              A wrong hire costs you months.<br />Reading the work costs you a search.
            </motion.h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                Search proven candidates
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#register"
                className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: 'rgba(250,250,249,0.25)' }}
              >
                Join the waitlist
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
