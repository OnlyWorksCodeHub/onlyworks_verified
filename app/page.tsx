'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Cpu, Eye, Lock, Users, Search, BarChart3, FileCheck, Check } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { AppShowcase } from '@/components/AppShowcase'
import { VideoBlock } from '@/components/ui/VideoBlock'
import { motion, AnimatePresence } from 'framer-motion'
import { GeometricPattern } from '@/components/ui/grid-background'
import { WatermarkText, ConnectionLines } from '@/components/ui/decorative-fills'

const whatBeats = [
  {
    n: '01',
    title: 'Hiring is broken right now',
    body: 'Anyone can write anything on a resume — and plenty do. Exaggerated, embellished, flat-out faked. The system rewards the best storyteller, not the best worker, and now AI writes the fiction by the thousand. If you actually did the work, you’re competing against made-up people who look just as good on paper.',
  },
  {
    n: '02',
    title: 'It’s an app you run while you work',
    body: 'Download it for macOS or Windows, sign in, and start a session when you sit down to work. It runs alongside you in VS Code, Figma, Chrome — whatever you already use. You start and stop each session.',
  },
  {
    n: '03',
    title: '"Verified" means it’s backed by your real work',
    body: 'OnlyWorks builds your report from what you actually did during your sessions, and an AI corroborates each skill against that work. That’s the difference between a claim and proof — it’s evidence-based, not a self-reported bullet. (It isn’t cryptographic or identity verification.)',
  },
  {
    n: '04',
    title: 'You get one link that grows',
    body: 'Your report lands on your OW Profile — one link that grows with every session. You choose what’s on it and who can open it. Send it to an employer or a client instead of a resume.',
  },
]

const howSteps = [
  { num: '01', title: 'Sign in and start a session', desc: 'Download the free app, sign in with Google, LinkedIn or email, and start a session when you begin working. It runs alongside you while you work — you start and stop it.' },
  { num: '02', title: 'Do your work', desc: 'Just do your normal work. When you end the session, OnlyWorks turns what you did into a verified report — your real skills, accomplishments and impact — written for you.' },
  { num: '03', title: 'Share one link', desc: 'Your report lands on your OW Profile. Send one link to an employer, a client, anyone. They see proof backed by real work, and you decide who can open it.' },
]

const reportSections = [
  { label: 'Executive summary', desc: 'What you got done this session, in a sentence or two.' },
  { label: 'Key accomplishments', desc: 'The concrete things you shipped, fixed or moved forward.' },
  { label: 'Skills used', desc: 'Each one tagged "Verified ×N" — corroborated across N of your sessions.' },
  { label: 'Strengths', desc: 'What you’re consistently good at, with the evidence behind it.' },
  { label: 'Growth areas', desc: 'Honest, specific suggestions — not filler.' },
  { label: 'Next steps', desc: 'Where you left off, so picking back up is easy.' },
]

/* Decorative diagonal hatching for light sections */
function DiagonalHatch({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #080503 30px, #080503 31px)`,
      }} />
    </div>
  )
}

/* Decorative dots grid */
function DotGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="w-full h-full opacity-[0.06]" style={{
        backgroundImage: `radial-gradient(circle, #080503 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
    </div>
  )
}

export default function HomePage() {
  const [audience, setAudience] = useState<'personal' | 'employer'>('personal')

  const heroContent = {
    personal: {
      eyebrow: 'The new resume · free for job seekers',
      heading: <>Anyone can fake a resume.<br /> You can&apos;t fake <span style={{ color: '#8b5cf6' }}>real work</span>.</>,
      subtitle: 'Hiring rewards whoever writes the best resume — not whoever did the best work. OnlyWorks is the new resume: a desktop app that turns your real work into proof, on one shareable link. Free for job seekers, on macOS and Windows.',
      cta: { label: 'Download free', href: '/downloads' },
      secondary: { label: 'See how it works', href: '#how-it-works' },
    },
    employer: {
      eyebrow: 'Hiring is broken',
      heading: <>Faked resumes<br /> <span className="text-muted-foreground">keep getting hired.</span></>,
      subtitle: 'Resumes are easy to fake and hard to check, so the best storyteller wins — not the best worker. OnlyWorks profiles are built from real work sessions, so you hire on proof, not promises.',
      cta: { label: 'Start hiring', href: '/hiring' },
      secondary: { label: 'See how it works', href: '#how-it-works' },
    },
  }

  const hero = heroContent[audience]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative pb-16 pt-24 lg:pt-28 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-30" />
        <DotGrid className="left-0 top-0 w-[280px] h-full" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-12">

          {/* ── Audience toggle ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full border border-foreground/20 p-1">
              <button
                onClick={() => setAudience('personal')}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  audience === 'personal'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                For job seekers
              </button>
              <button
                onClick={() => setAudience('employer')}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  audience === 'employer'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                For employers
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ── Left: words ── */}
            <div>
              <motion.div
                key={`eyebrow-${audience}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
                  <span className="w-8 h-px bg-foreground/30" />
                  {hero.eyebrow}
                </span>
              </motion.div>

              <motion.h1
                key={`heading-${audience}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display leading-[0.95] tracking-tight text-[clamp(2.5rem,5.5vw,5rem)]"
              >
                {hero.heading}
              </motion.h1>

              <motion.p
                key={`subtitle-${audience}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-7 max-w-xl text-lg lg:text-lg lg:text-xl text-muted-foreground leading-relaxed"
              >
                {hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  href={hero.cta.href}
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                  style={{ background: '#8b5cf6' }}
                >
                  {hero.cta.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={hero.secondary.href}
                  className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  {hero.secondary.label}
                </a>
              </motion.div>

              {audience === 'personal' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="mt-4"
                >
                  <Link href="/talent" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    or join the Talent Community
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )}

              {/* ── Employer skill search ── */}
              <AnimatePresence>
                {audience === 'employer' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 16, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const input = (e.target as HTMLFormElement).elements.namedItem('heroSearch') as HTMLInputElement
                        if (input?.value.trim()) {
                          window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
                        }
                      }}
                      className="flex gap-3 mt-6 max-w-xl"
                    >
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          name="heroSearch"
                          type="text"
                          placeholder="Search skills — React, Python, Figma…"
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
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: the product (swap in a real recording / Higgsfield brand clip) ── */}
            <motion.div
              id="demo"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="scroll-mt-32"
            >
              <VideoBlock
                poster="/images/overview.png"
                chrome="OnlyWorks"
                priority
                label="A look at the OnlyWorks app"
                caption="Run a session, get a report, share one link."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ THE FILM — the new résumé, in 30s ═══ */}
      <section className="relative overflow-hidden py-14 lg:py-20" style={{ background: '#1c1b18' }} aria-label="OnlyWorks film">
        <div className="relative z-10 max-w-[1080px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-7">
            <span className="inline-block font-mono text-xs tracking-[0.24em] uppercase" style={{ color: 'rgba(250,250,249,0.5)' }}>
              The new résumé · 30 seconds
            </span>
            <h2 className="mt-3 font-display tracking-tight leading-[0.98] text-[clamp(1.875rem,4vw,3.25rem)]" style={{ color: '#fafaf9' }}>
              Your work, <span style={{ color: '#8b5cf6' }}>becoming proof.</span>
            </h2>
          </div>
          <VideoBlock
            src="/videos/onlyworks-ad-wide.mp4"
            poster="/images/ad-poster.jpg"
            mode="autoplay"
            aspect={16 / 9}
            label="OnlyWorks — proof of real work, not résumés"
          />
        </div>
      </section>

      {/* ═══ WHAT IT ACTUALLY IS ═══ */}
      <section className="relative py-10 lg:py-14 overflow-hidden border-t border-foreground/10">
        <DotGrid className="left-0 top-0 w-[220px] h-full" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-5">
              <span className="w-8 h-px bg-foreground/30" />
              What it actually is
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight">
              A resume is a story you tell.<br />
              <span style={{ color: '#8b5cf6' }}>This is proof.</span>
            </h2>
            <p className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed">
              OnlyWorks is a desktop app you run while you work. It turns what you actually did into a verified report you can share.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* beats */}
            <div>
              {whatBeats.map((b, i) => (
                <motion.div
                  key={b.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-7 border-t border-foreground/10 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-sm text-muted-foreground shrink-0">{b.n}</span>
                    <div>
                      <h3 className="text-lg lg:text-xl font-medium mb-2.5">{b.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{b.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* the output: a real report on your profile */}
            <div className="lg:sticky lg:top-28">
              <VideoBlock
                poster="/images/shared-reports.png"
                chrome="OnlyWorks — your OW Profile"
                label="An OnlyWorks verified report on a shareable profile"
                caption="The report is the product. One link is how you send it."
              />
              <p className="mt-5 text-sm text-foreground/70">
                You decide what’s on your profile and who can open the link.{' '}
                <Link href="/security" className="underline underline-offset-4 hover:text-foreground">
                  How OnlyWorks handles your data →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES — numbered 01-04 ═══ */}
      <section className="relative py-10 lg:py-14 overflow-hidden border-t border-foreground/10">
        <DotGrid className="right-0 top-0 w-[300px] h-full" />
        <WatermarkText text="PROOF" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Why it works
            </span>
            <h2 className="max-w-2xl text-4xl lg:text-6xl font-display tracking-tight">
              Everything you need.<br /><span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </h2>
          </div>

          {(audience === 'personal' ? [
            { num: '01', icon: Cpu, title: 'Get past the AI-resume wall', desc: 'Hiring managers are drowning in AI-written resumes that all say the same thing. A verified report built from your real sessions is something they can actually check — so you get read, not skipped.' },
            { num: '02', icon: Shield, title: 'Stop telling employers what you did. Show them.', desc: 'Every report is built from real work sessions: actual skills, actual accomplishments, actual impact. Not bullet points you wrote about yourself.' },
            { num: '03', icon: Eye, title: 'One link, the full picture', desc: 'Your OW Profile is a single link that grows with every session. Share it with an employer or a client — it speaks for itself.' },
            { num: '04', icon: Lock, title: 'You’re in control of your proof', desc: 'Sessions only run when you start and stop them. You choose exactly what goes on your profile and who can open the link.' },
          ] : [
            { num: '01', icon: Search, title: 'Search skills people actually demonstrated', desc: 'Filter candidates by skills shown in real work sessions — not by who stuffed the right words into a resume.' },
            { num: '02', icon: FileCheck, title: 'Proof, not self-reporting', desc: 'Every OnlyWorks profile is built from real work sessions: real skills, real output, real impact you can read for yourself before you decide.' },
            { num: '03', icon: BarChart3, title: 'Screen with proof, not guesswork', desc: 'See what a candidate actually built before the first conversation, and spend your time on the people you already know can deliver.' },
            { num: '04', icon: Users, title: 'A shortlist that’s already proven', desc: 'Search is free and open today. Browse people whose skills are backed by real work and build a shortlist you can trust — proof-based reach-out is rolling out next.' },
          ]).map((item, i) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-6 py-8 md:py-12 border-t border-foreground/10 items-start">
              <div className="col-span-1">
                <span className="text-sm font-mono text-muted-foreground">{item.num}</span>
              </div>
              <div className="col-span-11 md:col-span-6">
                <h3 className="text-xl md:text-2xl font-medium mb-3">{item.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <div className="hidden md:flex col-span-5 justify-end">
                <div className="w-16 h-16 flex items-center justify-center border border-foreground/10">
                  <item.icon className="w-7 h-7 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS — dark section ═══ */}
      <section id="how-it-works" className="relative py-10 lg:py-14 overflow-hidden scroll-mt-28" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <DiagonalHatch className="opacity-100" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              How it works
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#fafaf9' }}>
              Three steps.<br /><span style={{ color: 'rgba(250,250,249,0.4)' }}>From your work session to a shareable link.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="space-y-0">
              {howSteps.map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="py-8 border-b transition-all duration-500 group"
                  style={{ borderColor: 'rgba(250,250,249,0.1)' }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl" style={{ color: 'rgba(250,250,249,0.3)' }}>{step.num}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#fafaf9' }}>{step.title}</h3>
                      <p className="leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* a look inside the app */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-28">
              <div className="rounded-xl p-4 lg:p-6" style={{ background: '#fafaf9', color: '#080503' }}>
                <AppShowcase />
              </div>
              <p className="mt-4 text-sm" style={{ color: 'rgba(250,250,249,0.55)' }}>
                A look inside the OnlyWorks app.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT'S IN A REPORT — replaces fabricated testimonials ═══ */}
      <section className="relative overflow-hidden py-10 lg:py-14 border-t border-foreground/10">
        <DotGrid className="left-0 top-0 w-[200px] h-full" />
        <ConnectionLines className="opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Inside a report
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight">
              Every session<br /><span className="text-muted-foreground">becomes a report.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              You don’t write it. When you end a session, OnlyWorks generates a report from your real work — here’s what’s in one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {reportSections.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-background p-7 lg:p-8"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                  <h3 className="text-lg font-medium">{r.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <div className="relative">
        <DotGrid className="right-0 top-0 w-[250px] h-full" />
        <FAQ />
      </div>

      {/* ═══ CTA ═══ */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <DiagonalHatch />
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
                  <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6 leading-[0.95]">
                    {audience === 'personal'
                      ? <>Send proof,<br /><span className="text-muted-foreground">not promises.</span></>
                      : <>Hire on what<br /><span className="text-muted-foreground">they actually built.</span></>
                    }
                  </h2>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    {audience === 'personal'
                      ? 'Install the app, run a session, and share your first verified report.'
                      : 'Filter by real, demonstrated skills. Read the proof before the call.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href={audience === 'personal' ? '/downloads' : '/hiring'}
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      {audience === 'personal' ? 'Download free' : 'Start hiring'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  {audience === 'personal' && (
                    <p className="mt-5 text-sm text-muted-foreground">
                      Free for job seekers. macOS and Windows.
                    </p>
                  )}
                </div>
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
