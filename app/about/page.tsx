'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Cpu, Lock, Users, Target, Zap } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Proof, not promises.</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
              OnlyWorks exists because trust shouldn't be blind. In a world of remote work and AI automation, proving real work happened matters more than ever.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Image */}
      <section className="pb-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="demo-frame">
              <div className="demo-bar">
                <div className="demo-dot" />
                <div className="demo-dot" />
                <div className="demo-dot" />
              </div>
              <div className="relative aspect-[21/9]" style={{ background: 'var(--bg-alt)' }}>
                <Image
                  src="/images/AboutUs.png"
                  alt="About OnlyWorks"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6">Why we exist</h2>
              <div className="space-y-4">
                <p>
                  Most applications fail for reasons you never see. You've done the work, whether it's projects, coding, school assignments, or side hustles, but it often goes unnoticed. Hiring systems rely on résumés, job titles, and keywords instead of what you can actually do.
                </p>
                <p>
                  OnlyWorks changes that. We turn your real experience into verifiable proof. Projects, decisions, and results that anyone can trust make your skills and achievements visible early. You get recognized for what you've actually done, not just how well you sell yourself.
                </p>
                <p>
                  With an OnlyWorks profile, you can share trusted evidence of your work across jobs, internships, or projects. No fluff, no guessing, just proof that shows you're capable. At the same time, employers get real signals they can trust, making hiring faster and fairer for everyone.
                </p>
                <p style={{ fontWeight: 500 }}>
                  In short: your work finally speaks for itself.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '98%', label: 'Verification accuracy' },
                { value: '20+', label: 'Work patterns verified' },
                { value: 'E2E', label: 'Encryption' },
                { value: '5s', label: 'Report gen' }
              ].map((stat, i) => (
                <div key={i} className="card text-center">
                  <div className="stat-value mb-1" style={{ fontSize: '2.5rem' }}>{stat.value}</div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mb-4">What we believe</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The principles that guide everything we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'Your data is encrypted end-to-end. You control what gets verified and who sees your reports.' },
              { icon: Cpu, title: 'AI Powered', desc: 'Advanced AI helps you verify authentic work and build credible proof of your skills and productivity.' },
              { icon: Lock, title: 'Transparency', desc: 'You see everything that gets recorded. Complete control over what you share. Full visibility.' },
              { icon: Users, title: 'Trust', desc: 'Build trust through verification you control. Empower yourself to prove your value.' },
              { icon: Target, title: 'Accuracy', desc: '98% work verification accuracy. Precision that helps you stand out and prove your capabilities.' },
              { icon: Zap, title: 'Speed', desc: 'Generate verified reports in seconds, not hours. Time is valuable.' }
            ].map((value, i) => (
              <div key={i} className="card transition-all hover:shadow-lg hover:-translate-y-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#ede9fe' }}
                >
                  <value.icon className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="mb-2">{value.title}</h3>
                <p className="text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="mb-4">Built by people who care</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We're a small team passionate about building tools that create trust and transparency in the modern workplace.
            </p>
          </div>

          {/* Team Photo */}
          <div className="max-w-4xl mx-auto">
            <div className="demo-frame">
              <div className="demo-bar">
                <div className="demo-dot" />
                <div className="demo-dot" />
                <div className="demo-dot" />
              </div>
              <div className="relative aspect-[16/9]" style={{ background: 'var(--bg)' }}>
                <Image
                  src="/images/Engineers.png"
                  alt="OnlyWorks Engineering Team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Ready to start?</h2>
            <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of professionals who trust OnlyWorks.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/downloads" className="btn btn-primary">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
