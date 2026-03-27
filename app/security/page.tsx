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
    <div className="min-h-screen" style={{ background: '#fafaf9' }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-32 lg:py-40 px-6 md:px-12 lg:px-20 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <BinaryRain columns={8} />
        <ScanLines />
        <ASCIIBlock variant="verify" className="absolute right-12 top-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
            style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.02em' }}
          >
            <span className="w-10 h-px" style={{ background: '#a3a19b' }} />
            Security &amp; Privacy
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display tracking-tight text-[clamp(3.5rem,8vw,7rem)]"
            style={{ lineHeight: 0.9, color: '#080503' }}
          >
            Enterprise-grade<br />
            <span style={{ color: '#a3a19b' }}>security.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-md text-xl lg:text-2xl leading-relaxed"
            style={{ color: '#57554f' }}
          >
            Your work data is protected with the same standards trusted by Fortune 500 companies.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 md:px-12 lg:px-20 py-24 lg:py-32 overflow-hidden">
        <FloatingParticles count={8} />
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <WatermarkText text="SECURE" />
        <ConnectionLines className="opacity-30" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="mb-16">
            <p className="text-sm mb-3" style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace" }}>Capabilities</p>
            <h2 className="max-w-2xl text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#080503' }}>
              Built secure<br /><span style={{ color: '#a3a19b' }}>from day one.</span>
            </h2>
          </div>

          {[
            { num: '01', icon: Lock, title: 'End-to-End Encryption', desc: 'AES-256 at rest. TLS in transit. Zero-knowledge architecture. Your data is encrypted before it leaves your device.' },
            { num: '02', icon: Shield, title: 'Compliance', desc: 'GDPR, CCPA, SOC 2 Type II compliant. Regular third-party audits ensure we meet the highest standards.' },
            { num: '03', icon: Server, title: 'Infrastructure', desc: 'Multi-factor authentication. Network isolation. 24/7 monitoring with automated threat detection.' },
            { num: '04', icon: Key, title: 'Your Control', desc: 'Granular privacy settings. Export or delete your data anytime. You decide what gets captured and who sees it.' },
          ].map((item, i) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-6 py-10 md:py-16 border-t items-start" style={{ borderColor: '#dad7d0' }}>
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

      {/* Report Vulnerability */}
      <section className="relative px-6 md:px-12 lg:px-20 py-24 lg:py-32 overflow-hidden" style={{ background: '#f5f5f4' }}>
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-25" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="relative rounded-2xl p-12 md:p-20 overflow-hidden" style={{ background: '#fafaf9', border: '1px solid #dad7d0' }}>
            <h2 className="max-w-3xl text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#a3a19b' }}>
              Found a vulnerability?<br /><span style={{ color: '#080503' }}>We take it seriously.</span>
            </h2>
            <p className="mt-6 text-lg max-w-md" style={{ color: '#78766f' }}>
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
