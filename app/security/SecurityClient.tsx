'use client'

import { Shield, Lock, Server, Key } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { motion } from 'framer-motion'
import { GeometricPattern, FloatingParticles, PulsingRings } from '@/components/ui/grid-background'
import { BinaryRain, WatermarkText, ASCIIBlock, ScanLines, ConnectionLines } from '@/components/ui/decorative-fills'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-28 pb-12 lg:pb-20 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <BinaryRain />
        <ScanLines />
        <ASCIIBlock variant="verify" className="absolute right-12 top-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Security &amp; Privacy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display tracking-tight text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95]"
          >
            Your data,<br />
            <span className="text-muted-foreground">your control.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-md text-lg lg:text-lg lg:text-xl text-muted-foreground leading-relaxed"
          >
OnlyWorks turns your captured work into a report — and you decide who sees it. Here’s exactly what we collect, who processes it, and how to delete it.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <FloatingParticles count={8} />
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <WatermarkText text="SECURE" />
        <ConnectionLines className="opacity-30" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              How we protect you
            </span>
            <h2 className="max-w-2xl text-4xl lg:text-6xl font-display tracking-tight">
              Built secure<br /><span className="text-muted-foreground">from day one.</span>
            </h2>
          </div>

          {[
            { num: '01', icon: Lock, title: 'Encrypted in transit and at rest', desc: 'Your data is encrypted in transit (HTTPS/TLS) and at rest on our providers’ infrastructure. OnlyWorks is not end-to-end encrypted: to generate your reports, screenshots and OCR text are uploaded to our backend and processed by Google Gemini.' },
            { num: '02', icon: Shield, title: 'Session-based capture', desc: 'Capture only runs during sessions you start and stop — it is not always-on. During a session, OnlyWorks captures screenshots, on-screen text (OCR), active app and window titles, and click/keystroke counts (we record the counts only, never the content of what you type), then sends them to OnlyWorks and our sub-processors to produce your report. Screenshots may also be used to improve our AI.' },
            { num: '03', icon: Server, title: 'Sub-processors', desc: 'Your data is processed by a small set of providers: Google Gemini (AI report generation), Supabase (database and storage), Render (backend hosting), and Resend (email). Each handles only the data needed for its function.' },
            { num: '04', icon: Key, title: 'Deletion and retention', desc: 'You can purge the screenshots used to train our AI at any time, and delete your account from the app. There is no automatic time-based deletion: after account deletion, account data is removed within 30 days, session data is kept up to 90 days, and full deletion can take up to 90 days due to backups. Aggregated, de-identified analytics may be retained indefinitely.' },
          ].map((item, i) => (
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

      {/* Report Vulnerability */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-25" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-12 lg:py-16">
              <h2 className="max-w-3xl text-4xl lg:text-6xl font-display tracking-tight">
                Found a vulnerability?<br /><span className="text-muted-foreground">Let us know.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                Report security issues responsibly and we&apos;ll work with you to resolve them quickly.
              </p>
              <div className="mt-8">
                <a href="mailto:security@only-works.com">
                  <ShimmerButton>
                    security@only-works.com
                  </ShimmerButton>
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
