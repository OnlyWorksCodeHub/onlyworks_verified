'use client'

import Link from 'next/link'
import { MapPin, Clock, Briefcase, ArrowRight, Users, Globe, Heart } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { FloatingParticles, PulsingRings } from '@/components/ui/grid-background'
import { jobs } from '@/lib/data/jobs'
import { Button } from '@/components/ui/moving-border'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { BinaryRain, WatermarkText, ConnectionLines, ASCIIBlock } from '@/components/ui/decorative-fills'

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

const perks = [
  { icon: Globe, title: 'Fully remote', desc: 'Work from anywhere in the world. We care about output, not office hours.' },
  { icon: Heart, title: 'Health & wellness', desc: 'Comprehensive benefits. Mental health days. No questions asked.' },
  { icon: Users, title: 'Small team, big impact', desc: 'Every person shapes the product. No bureaucracy, no politics.' },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO — v0 hero pattern ═══ */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <GridLines />
        <FloatingParticles count={10} />
        <BinaryRain columns={5} />
        <ConnectionLines className="opacity-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
                <span className="w-8 h-px bg-foreground/30" />
                Careers
              </span>
              <AnimatedGradientText className="text-xs font-mono">
                We&apos;re hiring
              </AnimatedGradientText>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-12"
          >
            <span className="block">Join our</span>
            <span className="block text-muted-foreground">team</span>
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Join a small, fast team making real impact. We care about what you can do, not where you went to school.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                href="#positions"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                View open positions
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom marquee stats like v0 hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="absolute bottom-12 left-0 right-0"
        >
          <div className="flex gap-16 max-w-[1400px] mx-auto px-6 lg:px-12">
            {[
              { value: '100%', label: 'Remote' },
              { value: '10+', label: 'Countries' },
              { value: '∞', label: 'PTO' },
              { value: '<20', label: 'Team size' },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-4">
                <span className="text-4xl lg:text-5xl font-display">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ PERKS — v0 Capabilities pattern (numbered, border-t dividers) ═══ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <FloatingParticles count={6} />
        <WatermarkText text="JOIN" />
        <ASCIIBlock variant="chart" className="absolute right-12 top-16" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Why join us
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Work that<br /><span className="text-muted-foreground">matters.</span>
            </motion.h2>
          </div>

          <div>
            {perks.map((perk, i) => (
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
                      <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">{perk.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{perk.desc}</p>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                      <div className="w-16 h-16 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                        <perk.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OPEN POSITIONS — v0 Capabilities numbered list (full-width, 12-col grid) ═══ */}
      <section id="positions" className="relative py-24 lg:py-32 overflow-hidden">
        <PulsingRings className="right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-30" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Open positions
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Current<br /><span className="text-muted-foreground">openings.</span>
            </motion.h2>
          </div>

          {jobs.length === 0 && (
            <div className="py-16 border-t border-foreground/10">
              <p className="text-xl text-muted-foreground">No open positions right now. Check back soon!</p>
            </div>
          )}

          <div>
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                <Link href={`/careers/apply/${job.id}`}>
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
                    <div className="shrink-0">
                      <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{job.type}</span>
                        </div>
                      </div>
                      <div className="flex justify-start lg:justify-end">
                        <Button
                          borderRadius="1.75rem"
                          containerClassName="h-12 w-auto"
                          className="bg-slate-900/[0.8] border-slate-800 text-white text-sm font-medium px-6"
                          borderClassName="bg-[radial-gradient(#8b5cf6_40%,transparent_60%)]"
                        >
                          Apply now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — v0 CTA pattern ═══ */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                  <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                    Don&apos;t see<br />a fit?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                    We&apos;re always looking for great people. Send us your resume and we&apos;ll keep you in mind.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      Get in touch
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                    >
                      Back to home
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
