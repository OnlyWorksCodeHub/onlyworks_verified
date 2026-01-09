'use client'

import Link from 'next/link'
import { Shield, Cpu, BarChart3, Lock, Zap, Globe } from 'lucide-react'
import { LogoCarousel } from '@/components/ui/logo-carousel'
import { Navigation } from '@/components/Navigation'
import { TypewriterText } from '@/components/TypewriterText'
import { AppShowcase } from '@/components/AppShowcase'

export default function HomePage() {
  const features = [
    { icon: Shield, title: 'Fraud Detection', desc: 'AI-powered detection of automation and fraudulent activity.' },
    { icon: Cpu, title: 'Smart Analysis', desc: 'Real-time analysis of work patterns and productivity.' },
    { icon: BarChart3, title: 'Detailed Reports', desc: 'Comprehensive, tamper-proof verification reports.' },
    { icon: Lock, title: 'Privacy First', desc: 'End-to-end encryption. Your data stays yours.' },
    { icon: Zap, title: 'Real-time Sync', desc: 'Instant updates across all your devices.' },
    { icon: Globe, title: 'Works Everywhere', desc: 'Cross-platform support for Mac and Windows.' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-xl mx-auto text-left">
          <h1 className="mb-2">
            Is it <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic' }}>REAL</span>?
          </h1>
          <h1 className="mb-6 md:mb-8">
            <TypewriterText />
          </h1>
          <p className="text-lg md:text-xl mb-8 md:mb-12" style={{ color: 'var(--text-secondary)' }}>
            We make sure of that.
          </p>
          <div className="text-center">
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* App Video */}
      <section className="pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden img-bordered">
            <video
              src="/images/filler.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-6 md:py-8" style={{ background: 'var(--bg-alt)' }}>
        <div className="text-center mb-4">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Trusted by teams at</p>
        </div>
        <LogoCarousel />
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="mb-4">Everything you need</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Powerful features to verify work and build trust.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card">
                <div className="icon-wrap mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="mb-4">See how it works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Explore the features that make OnlyWorks the trusted choice for work verification.
            </p>
          </div>
          <AppShowcase />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: 'var(--accent)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4 md:mb-6 text-white">Ready to make your work undeniable?</h2>
          <p className="mb-6 md:mb-8 text-white opacity-80">Join thousands of professionals who trust OnlyWorks.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/downloads" className="btn" style={{ background: 'white', color: 'var(--accent)' }}>
              Get Access
            </Link>
            <Link href="/contact" className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
