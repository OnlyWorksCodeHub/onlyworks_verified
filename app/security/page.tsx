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
      <section className="relative py-32 lg:py-40 overflow-hidden">
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
            className="font-display tracking-tight text-[clamp(3.5rem,8vw,7rem)] leading-[0.9]"
          >
            Your data,<br />
            <span className="text-muted-foreground">your control.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-md text-xl lg:text-2xl text-muted-foreground leading-relaxed"
          >
            OnlyWorks is built around one principle: you own your data and you decide who sees it.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
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
            { num: '01', icon: Lock, title: 'End-to-End Encryption', desc: 'Your data is encrypted in transit and at rest. Screenshots never leave your device unencrypted.' },
            { num: '02', icon: Shield, title: 'Privacy by Design', desc: 'You choose what gets captured, what goes into reports, and what to exclude. Nothing is shared without your explicit permission.' },
            { num: '03', icon: Server, title: 'Secure Infrastructure', desc: 'Hosted on trusted cloud providers with automated monitoring. Your personal data is isolated and protected.' },
            { num: '04', icon: Key, title: 'Full Control', desc: 'Export or delete your data anytime. No lock-in, no hidden retention. When you say delete, we delete.' },
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
      <section className="relative py-16 lg:py-24 overflow-hidden">
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
