'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Cpu, Eye, Lock } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GeometricPattern, PulsingRings, GridBackground } from '@/components/ui/grid-background'
import { FlipWords } from '@/components/ui/flip-words'
import { Marquee } from '@/components/ui/marquee'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { BinaryRain, CodeDecoration, WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

const stats = [
  { value: '10x', label: 'faster than resume screening' },
  { value: '98%', label: 'verification accuracy' },
  { value: '5s', label: 'report generation' },
  { value: '1,000+', label: 'verified profiles' },
]

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
  return (
    <div className="min-h-screen" style={{ background: '#fafaf9' }}>
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative flex flex-col justify-end pb-12 pt-32 lg:pt-40 px-6 md:px-12 lg:px-20 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-50" />
        <BinaryRain columns={8} />
        <CodeDecoration side="right" />
        <ScanLines />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
            style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.02em' }}
          >
            <span className="w-10 h-px" style={{ background: '#a3a19b' }} />
            The platform for verified work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight"
          >
            Verified proof
            <br />
            of your <FlipWords words={["work", "skills", "impact", "growth"]} className="inline-block" />
          </motion.h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md text-xl lg:text-2xl leading-relaxed"
              style={{ color: '#57554f' }}
            >
              Your toolkit to stop guessing and start proving. Build verified reports that show what you actually did.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Link href="/downloads" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: '#8b5cf6' }}>
                Download free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-colors" style={{ border: '1px solid #dad7d0', color: '#080503' }}>
                How it works
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scrolling stats ticker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 border-t pt-6" style={{ borderColor: '#dad7d0' }}>
          <Marquee pauseOnHover className="[--duration:30s]">
            {stats.map((s, i) => (
              <div key={i} className="flex items-baseline gap-3 shrink-0 mx-8">
                <span className="font-display text-3xl md:text-4xl" style={{ color: '#080503' }}>{s.value}</span>
                <span className="text-sm" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
              </div>
            ))}
          </Marquee>
        </motion.div>
      </section>

      {/* ═══ CAPABILITIES — numbered 01-04 ═══ */}
      <section className="relative px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <DotGrid className="right-0 top-0 w-[300px] h-full" />
        <DotGrid className="left-0 bottom-0 w-[200px] h-[400px]" />
        <WatermarkText text="VERIFY" />
        <ASCIIBlock variant="chart" className="absolute right-12 top-12" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="mb-8">
            <p className="text-sm mb-3" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>Capabilities</p>
            <h2 className="max-w-2xl text-4xl lg:text-6xl font-display tracking-tight">
              Everything you need.<br /><span style={{ color: '#a3a19b' }}>Nothing you don&apos;t.</span>
            </h2>
          </div>

          {[
            { num: '01', icon: Cpu, title: 'AI-Powered Analysis', desc: 'Our AI watches what you build — the apps, the focus, the output. It understands context, measures impact, and captures accomplishments automatically.' },
            { num: '02', icon: Shield, title: 'Verified Reports', desc: 'Generate tamper-proof reports showing skills, accomplishments, and real impact. Not self-reported. Not exaggerated. Verified by data.' },
            { num: '03', icon: Eye, title: 'OW Profile', desc: 'Your living portfolio that grows with every session. A single link that shows employers exactly what you can do — backed by proof.' },
            { num: '04', icon: Lock, title: 'Privacy First', desc: 'End-to-end encryption. You decide what gets captured, what goes into reports, and who can see them. Your data stays yours.' },
          ].map((item, i) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-6 py-8 md:py-12 border-t items-start" style={{ borderColor: '#dad7d0' }}>
              <div className="col-span-1">
                <span className="text-sm" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>{item.num}</span>
              </div>
              <div className="col-span-11 md:col-span-5">
                <h3 className="text-xl md:text-2xl font-medium mb-3" style={{ color: '#080503' }}>{item.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#57554f' }}>{item.desc}</p>
              </div>
              <div className="hidden md:flex col-span-6 justify-end">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#e7e4dd' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#57554f' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PROCESS — dark section ═══ */}
      <section id="how-it-works" className="relative px-6 md:px-12 lg:px-20 py-12 md:py-20 overflow-hidden" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <DiagonalHatch className="opacity-100" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="mb-8">
            <p className="text-sm mb-3" style={{ color: '#78766f', fontFamily: "'JetBrains Mono', monospace" }}>—— Process</p>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#78766f' }}>
              Three steps.<br /><span style={{ color: '#fafaf9' }}>Infinite possibilities.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { num: 'I', title: 'Start a session', desc: "OnlyWorks runs in the background. It captures what you're working on — apps, focus time, real output. You control everything." },
                { num: 'II', title: 'Generate a report', desc: 'AI analyzes your work and creates a verified report — skills, accomplishments, impact. Ready to share.' },
                { num: 'III', title: 'Share your proof', desc: 'Send your OW Profile or individual reports to employers, clients, anyone. Proof that speaks for itself.' },
              ].map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                  <div className="flex items-start gap-4">
                    <span className="font-display text-2xl mt-1" style={{ color: '#78766f' }}>{step.num}</span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium mb-2" style={{ color: i === 2 ? '#fafaf9' : '#78766f' }}>{step.title}</h3>
                      <p className="text-base leading-relaxed" style={{ color: '#78766f' }}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="rounded-xl overflow-hidden border" style={{ borderColor: '#44423d' }}>
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#292825', borderBottom: '1px solid #44423d' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#57554f' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#57554f' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#57554f' }} />
                <span className="ml-auto text-xs" style={{ color: '#78766f', fontFamily: "'JetBrains Mono', monospace" }}>overview.tsx</span>
              </div>
              <Image src="/images/overview.png" alt="OnlyWorks Dashboard" width={1920} height={1080} className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ METRICS — 2x2 grid ═══ */}
      <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <GridBackground className="opacity-50" />
        <ConnectionLines />
        <ASCIIBlock variant="verify" className="absolute left-12 bottom-12" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <p className="text-sm mb-3" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>—— Live metrics</p>
          <h2 className="mb-8 text-4xl lg:text-6xl font-display tracking-tight">
            Performance you<br /><span style={{ color: '#a3a19b' }}>can measure.</span>
          </h2>

          <div className="grid grid-cols-2 border-t border-l" style={{ borderColor: '#dad7d0' }}>
            {[
              { value: '50,000+', label: 'Reports generated' },
              { value: '98%', label: 'Verification accuracy' },
              { value: '<5s', label: 'Average generation time' },
              { value: '20+', label: 'Skills tracked per user' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-b border-r p-6 md:p-10" style={{ borderColor: '#dad7d0' }}>
                <div className="text-5xl lg:text-7xl font-display tracking-tight" style={{ lineHeight: 1, color: '#080503' }}>{m.value}</div>
                <p className="mt-2 text-sm" style={{ color: '#a3a19b' }}>{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-12 md:py-16 border-t" style={{ borderColor: '#dad7d0' }}>
        <DotGrid className="left-0 top-0 w-[200px] h-full" />
        <GeometricPattern className="right-0 bottom-0 w-[300px] h-[300px] opacity-30" />
        <WatermarkText text="PROOF" />
        <ConnectionLines className="opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <p className="text-sm mb-3" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>—— Testimonials</p>
          <h2 className="mb-10 text-4xl lg:text-6xl font-display tracking-tight">
            What people<br /><span style={{ color: '#a3a19b' }}>are saying.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative border p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1"
                style={{ borderColor: '#dad7d0', background: '#ffffff' }}
              >
                {/* Metric badge */}
                <div className="absolute top-6 right-6">
                  <span className="text-3xl font-display" style={{ color: '#e7e4dd' }}>{t.metric}</span>
                </div>

                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#080503' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid #e7e4dd' }}>
                  <p className="text-sm font-medium" style={{ color: '#080503' }}>{t.name}</p>
                  <p className="text-sm" style={{ color: '#a3a19b' }}>{t.role}</p>
                  <p className="mt-2 text-xs font-medium" style={{ color: '#8b5cf6', fontFamily: "'JetBrains Mono', monospace" }}>{t.result}</p>
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
      <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <DiagonalHatch />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="relative rounded-2xl p-10 md:p-16 overflow-hidden" style={{ background: '#f5f5f4', border: '1px solid #dad7d0' }}>
            <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-40" />
            <div className="relative z-10">
              <h2 className="max-w-3xl text-4xl lg:text-7xl font-display tracking-tight leading-[0.95]" style={{ color: '#a3a19b' }}>
                Ready to prove<br /><span style={{ color: '#080503' }}>your work?</span>
              </h2>
              <p className="mt-4 text-lg max-w-md" style={{ color: '#78766f' }}>Join thousands building verified portfolios. Start free, prove everything.</p>
              <div className="mt-6 flex items-center gap-3">
                <Link href="/downloads" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: '#8b5cf6' }}>
                  Start building free
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-colors" style={{ border: '1px solid #dad7d0', color: '#080503' }}>
                  Talk to sales
                </Link>
              </div>
              <p className="mt-3 text-xs" style={{ color: '#a3a19b' }}>No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
