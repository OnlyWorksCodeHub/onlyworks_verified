'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Cpu, Eye, Lock, Users, Search, BarChart3, FileCheck } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { GeometricPattern, PulsingRings, GridBackground } from '@/components/ui/grid-background'
import { FlipWords } from '@/components/ui/flip-words'
import { BinaryRain, CodeDecoration, WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

const testimonials = [
  { quote: "Finally something that shows what I actually did, not just a bullet on a resume.", name: "Sarah K.", role: "CS Student", result: "3 interviews in 2 weeks", metric: "3x" },
  { quote: "Clients love seeing verified proof instead of trusting my word.", name: "Marcus R.", role: "Freelance Dev", result: "40% more client conversions", metric: "40%" },
  { quote: "Got my first offer after sharing my OW Profile. They said it was the most honest portfolio they'd seen.", name: "Priya T.", role: "Junior Engineer", result: "First job in 3 weeks", metric: "3wk" },
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
      tagline: 'The platform for verified work',
      heading: <>Verified proof<br />of your <FlipWords words={["work", "skills", "impact", "growth"]} className="inline-block" /></>,
      subtitle: 'Your toolkit to stop guessing and start proving. Build verified reports that show what you actually did.',
      cta: { label: 'Download', href: '/downloads' },
      secondary: { label: 'How it works', href: '#how-it-works' },
    },
    employer: {
      tagline: 'The platform for verified talent',
      heading: <>Find people<br />who can <FlipWords words={["deliver", "build", "ship", "perform"]} className="inline-block" /></>,
      subtitle: 'AI resumes waste your time. OnlyWorks gives you verified proof of real work so you hire the right people, faster.',
      cta: { label: 'Start hiring', href: '/hiring' },
      secondary: { label: 'How it works', href: '#how-it-works' },
    },
  }

  const hero = heroContent[audience]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative flex flex-col justify-end pb-12 pt-32 lg:pt-40 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-50" />
        <BinaryRain />
        <CodeDecoration side="right" />
        <ScanLines />

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
                Personal
              </button>
              <button
                onClick={() => setAudience('employer')}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  audience === 'employer'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Employer
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              {hero.tagline}
            </span>
          </motion.div>

          <motion.h1
            key={audience}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight"
          >
            {hero.heading}
          </motion.h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.p
              key={`subtitle-${audience}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="max-w-md text-xl lg:text-2xl text-muted-foreground leading-relaxed"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={hero.cta.href}
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                {hero.cta.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              {audience === 'personal' && (
                <Link
                  href="/talent"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium transition-all hover:bg-[#8b5cf6]/10 group"
                  style={{ border: '1.5px solid #8b5cf6', color: '#8b5cf6' }}
                >
                  Join Talent Community
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {audience === 'employer' && (
                <Link
                  href={hero.secondary.href}
                  className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  {hero.secondary.label}
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── Employer search bar ── */}
        <AnimatePresence>
          {audience === 'employer' && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-12 overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = (e.target as HTMLFormElement).elements.namedItem('heroSearch') as HTMLInputElement
                  if (input?.value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
                  }
                }}
                className="flex gap-3 mt-8 max-w-2xl"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    name="heroSearch"
                    type="text"
                    placeholder="Search by skills — React, Python, Design..."
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

      </section>

      {/* ═══ CAPABILITIES — numbered 01-04 ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <DotGrid className="right-0 top-0 w-[300px] h-full" />
        <DotGrid className="left-0 bottom-0 w-[200px] h-[400px]" />
        <WatermarkText text="VERIFY" />
        <ASCIIBlock variant="chart" className="absolute right-12 top-12" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Capabilities
            </span>
            <h2 className="max-w-2xl text-4xl lg:text-6xl font-display tracking-tight">
              Everything you need.<br /><span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </h2>
          </div>

          {(audience === 'personal' ? [
            { num: '01', icon: Cpu, title: 'Get noticed faster', desc: 'Hiring managers are drowning in AI-generated resumes. OnlyWorks gives you verified proof of real work so you stand out and actually get reviewed.' },
            { num: '02', icon: Shield, title: 'Prove what you can do', desc: 'Stop telling employers what you did. Show them. Verified reports with real skills, real accomplishments and real impact.' },
            { num: '03', icon: Eye, title: 'One link, full picture', desc: 'Share your OW Profile with employers, clients, anyone. A single link that grows with every session and speaks for itself.' },
            { num: '04', icon: Lock, title: 'Your data, your rules', desc: 'End-to-end encryption. You decide what gets captured, what goes into reports and who can see them.' },
          ] : [
            { num: '01', icon: Search, title: 'Cut through the noise', desc: 'AI-generated resumes are wasting your team\'s time. OnlyWorks shows you verified proof of what candidates actually built, so you review the right people.' },
            { num: '02', icon: FileCheck, title: 'Verified over self-reported', desc: 'No more guessing if a resume is real. Every OnlyWorks profile is backed by verified work sessions, real skills and measurable output.' },
            { num: '03', icon: BarChart3, title: 'Faster, better hires', desc: 'Skip the screening calls. See exactly what a candidate can do before you ever talk to them. Save time and hire with confidence.' },
            { num: '04', icon: Users, title: 'Access verified talent', desc: 'Browse candidates who have already proven their skills. Filter by verified experience, not keyword-stuffed resumes.' },
          ]).map((item, i) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-6 py-8 md:py-12 border-t border-foreground/10 items-start">
              <div className="col-span-1">
                <span className="text-sm font-mono text-muted-foreground">{item.num}</span>
              </div>
              <div className="col-span-11 md:col-span-5">
                <h3 className="text-xl md:text-2xl font-medium mb-3">{item.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <div className="hidden md:flex col-span-6 justify-end">
                <div className="w-16 h-16 flex items-center justify-center border border-foreground/10">
                  <item.icon className="w-7 h-7 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS — dark section ═══ */}
      <section id="how-it-works" className="relative py-16 lg:py-24 overflow-hidden" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <DiagonalHatch className="opacity-100" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Process
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#fafaf9' }}>
              Three steps.<br /><span style={{ color: 'rgba(250,250,249,0.4)' }}>Infinite possibilities.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-0">
              {[
                { num: 'I', title: 'Start a session', desc: "OnlyWorks runs in the background. It verifies what you're working on, your focus time and real output. You control everything." },
                { num: 'II', title: 'Generate a report', desc: 'OnlyWorks analyzes your work and creates a verified report with your skills, accomplishments and impact. Ready to share.' },
                { num: 'III', title: 'Share your proof', desc: 'Send your OW Profile or individual reports to employers, clients, anyone. Proof that speaks for itself.' },
              ].map((step, i) => (
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

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="overflow-hidden border" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#292825', borderBottom: '1px solid rgba(250,250,249,0.1)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                <span className="ml-auto text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>overview.tsx</span>
              </div>
              <Image src="/images/overview.png" alt="OnlyWorks Dashboard" width={1920} height={1080} className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ METRICS — 2x2 grid ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <GridBackground className="opacity-50" />
        <ConnectionLines />
        <ASCIIBlock variant="verify" className="absolute left-12 bottom-12" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              By the numbers
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Performance you<br /><span className="text-muted-foreground">can measure.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {[
              { value: 'E2E', label: 'Encrypted' },
              { value: '<5s', label: 'Report generation' },
              { value: '20+', label: 'Skills verified' },
              { value: 'Free', label: 'To start' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-10">
                <div className="text-6xl lg:text-8xl font-display tracking-tight" style={{ lineHeight: 1 }}>{m.value}</div>
                <div className="mt-3 text-lg text-muted-foreground">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-t border-foreground/10">
        <DotGrid className="left-0 top-0 w-[200px] h-full" />
        <GeometricPattern className="right-0 bottom-0 w-[300px] h-[300px] opacity-30" />
        <WatermarkText text="PROOF" />
        <ConnectionLines className="opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Testimonials
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight">
              What people<br /><span className="text-muted-foreground">are saying.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative border border-foreground/10 bg-background p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1"
              >
                {/* Metric badge */}
                <div className="absolute top-6 right-6">
                  <span className="text-3xl font-display text-foreground/10">{t.metric}</span>
                </div>

                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 border-t border-foreground/10">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                  <p className="mt-2 text-xs font-medium font-mono" style={{ color: '#8b5cf6' }}>{t.result}</p>
                </div>
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
      <section className="relative py-16 lg:py-24 overflow-hidden">
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
                  <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-6 leading-[0.95]">
                    {audience === 'personal'
                      ? <>Ready to prove<br /><span className="text-muted-foreground">your work?</span></>
                      : <>Ready to hire<br /><span className="text-muted-foreground">with proof?</span></>
                    }
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    {audience === 'personal'
                      ? 'Start building your verified portfolio today.'
                      : 'Stop wasting time on unverified resumes. Find proven talent.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href={audience === 'personal' ? '/downloads' : '/hiring'}
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      {audience === 'personal' ? 'Download' : 'Start hiring'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
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
