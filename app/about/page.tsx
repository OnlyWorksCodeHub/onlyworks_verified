'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GeometricPattern, PulsingRings, GridBackground, FloatingParticles } from '@/components/ui/grid-background'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { BinaryRain, CodeDecoration, WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((t) => (
        <div key={`h-${t}`} className="absolute h-px bg-foreground/10" style={{ top: `${t}%`, left: 0, right: 0 }} />
      ))}
      {[8.33, 16.66, 24.99, 33.32, 41.65, 49.98, 58.31, 66.64, 74.97, 83.3, 91.63, 99.96].map((l) => (
        <div key={`v-${l}`} className="absolute w-px bg-foreground/10" style={{ left: `${l}%`, top: 0, bottom: 0 }} />
      ))}
    </div>
  )
}

const values = [
  { title: 'Privacy first', desc: 'End-to-end encrypted. You control what gets verified and who sees it.' },
  { title: 'AI that serves you', desc: 'AI builds your proof, not surveillance. You own every report.' },
  { title: 'Full transparency', desc: 'See everything captured. Delete anything, anytime.' },
  { title: 'Trust through proof', desc: 'Not through promises. Verified work builds real credibility.' },
  { title: 'Precision matters', desc: '98% accuracy. Your skills deserve correct representation.' },
  { title: 'Speed', desc: 'Reports in seconds. Your time is too valuable to waste.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <GridLines />
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <BinaryRain columns={5} />
        <CodeDecoration side="right" />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              About
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-8"
          >
            <span className="block">Proof, not</span>
            <span className="block text-muted-foreground">promises</span>
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
            >
              In a world of remote work and AI automation, proving real work happened matters more than ever.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                Download free
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
              >
                Get in touch
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MISSION IMAGE ═══ */}
      <section className="py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-foreground/10 overflow-hidden"
          >
            <Image src="/images/AboutUs.png" alt="About OnlyWorks" width={1920} height={800} className="w-full h-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY WE EXIST ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <FloatingParticles count={8} />
        <WatermarkText text="MISSION" />
        <ConnectionLines className="opacity-40" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                Our mission
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
                Why we<br />exist.
              </h2>
              <div className="mb-8">
                <TextGenerateEffect
                  words="Most applications fail for reasons you never see. You've done the work — projects, coding, assignments, side hustles — but it goes unnoticed. OnlyWorks changes that. We turn your real experience into verifiable proof."
                  className="text-xl !font-normal leading-relaxed [&_div]:!text-xl [&_span]:!text-muted-foreground"
                  duration={0.3}
                />
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '98%', label: 'Accuracy' },
                  { value: '<5s', label: 'Report gen' },
                  { value: 'E2E', label: 'Encrypted' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-4xl lg:text-5xl font-display mb-2">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="border border-foreground/10">
                <div className="px-6 py-3 border-b border-foreground/10 flex items-center justify-between">
                  <span className="text-sm font-mono text-muted-foreground">Key Numbers</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <div>
                  {[
                    { label: 'Verification accuracy', value: '98%' },
                    { label: 'Work patterns detected', value: '20+' },
                    { label: 'Report generation', value: '<5 seconds' },
                    { label: 'Data encryption', value: 'End-to-end' },
                    { label: 'Privacy model', value: 'User-controlled' },
                    { label: 'Cost to start', value: 'Free' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`px-6 py-4 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${i === 0 ? 'bg-foreground/[0.02]' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === 0 ? 'bg-foreground' : 'bg-foreground/20'}`} />
                        <div className="font-medium">{row.label}</div>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ METRICS — 2x2 grid ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <GridBackground className="opacity-50" />
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
              Impact you<br /><span className="text-muted-foreground">can measure.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {[
              { value: '98%', label: 'Verification accuracy rate' },
              { value: '20+', label: 'Work patterns detected' },
              { value: '<5s', label: 'Average report generation' },
              { value: '1,000+', label: 'Verified profiles created' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-10"
              >
                <div className="text-6xl lg:text-8xl font-display tracking-tight">{stat.value}</div>
                <div className="mt-3 text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUES — DARK SECTION ═══ */}
      <section className="relative py-16 lg:py-24" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)` }} />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Our values
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
              style={{ color: '#fafaf9' }}
            >
              What we<br /><span style={{ color: 'rgba(250,250,249,0.4)' }}>believe.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-0">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-6 border-b transition-all duration-500 group"
                  style={{ borderColor: 'rgba(250,250,249,0.1)' }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl" style={{ color: 'rgba(250,250,249,0.3)' }}>
                      {['I', 'II', 'III', 'IV', 'V', 'VI'][i]}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-display mb-2 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#fafaf9' }}>{v.title}</h3>
                      <p className="leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{v.desc}</p>
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
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>manifest.json</span>
                </div>
                <div className="p-6 font-mono text-sm" style={{ color: 'rgba(250,250,249,0.7)' }}>
                  <div className="leading-loose">{'{'}</div>
                  <div className="leading-loose pl-4">&quot;mission&quot;: &quot;make work visible&quot;,</div>
                  <div className="leading-loose pl-4">&quot;privacy&quot;: &quot;user-controlled&quot;,</div>
                  <div className="leading-loose pl-4">&quot;encryption&quot;: &quot;end-to-end&quot;,</div>
                  <div className="leading-loose pl-4">&quot;accuracy&quot;: &quot;98%&quot;,</div>
                  <div className="leading-loose pl-4">&quot;cost&quot;: &quot;free to start&quot;,</div>
                  <div className="leading-loose pl-4">&quot;surveillance&quot;: false</div>
                  <div className="leading-loose">{'}'}</div>
                </div>
                <div className="px-6 py-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <GeometricPattern className="left-0 top-0 w-[400px] h-[400px] opacity-30" />
        <GeometricPattern className="right-0 bottom-0 w-[300px] h-[300px] opacity-20" />
        <ASCIIBlock variant="logo" className="absolute right-12 top-16" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Our team
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight mb-4"
            >
              Built by people<br /><span className="text-muted-foreground">who care.</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              A small team passionate about making work visible and verifiable.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-foreground/10 overflow-hidden"
          >
            <Image src="/images/Engineers.png" alt="OnlyWorks team" width={1920} height={1080} className="w-full h-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden="true" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #080503 30px, #080503 31px)` }} />
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
                    Ready to<br />start?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    Your work deserves to be seen. Start proving it today.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href="/downloads"
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      Download free
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                    >
                      Contact us
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 font-mono">No credit card required</p>
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
