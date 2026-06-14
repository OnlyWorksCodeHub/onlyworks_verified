'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

interface Section {
  id: string
  title: string
  content: string
}

interface LegalPageProps {
  title: string
  lastUpdated: string
  sections: Section[]
  activeLink: 'privacy' | 'terms'
}

export function LegalPage({ title, lastUpdated, sections, activeLink }: LegalPageProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const tabs: { href: string; label: string; key: 'privacy' | 'terms' }[] = [
    { href: '/privacy', label: 'Privacy Policy', key: 'privacy' },
    { href: '/terms', label: 'Terms of Service', key: 'terms' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-8 lg:pb-10 overflow-hidden border-b border-foreground/10">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-5">
            <span className="w-8 h-px bg-foreground/30" />
            Legal
          </span>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display leading-[0.95] tracking-tight">
            {title}
          </h1>

          <p className="mt-5 text-sm font-mono text-muted-foreground">
            Effective Date: January 1, 2025 · Last Updated: {lastUpdated}
          </p>

          {/* privacy / terms switch */}
          <div className="mt-7 inline-flex items-center rounded-full border border-foreground/20 p-1">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeLink === tab.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BODY — TOC + content ═══ */}
      <section className="relative py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* Sidebar TOC — sticky below the fixed nav */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-4 text-muted-foreground">
              On this page
            </h2>
            <ul className="space-y-1 border-l border-foreground/10">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left -ml-px pl-4 py-1.5 border-l text-sm transition-colors ${
                      activeSection === section.id
                        ? 'border-[#8b5cf6] text-foreground font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className="min-w-0 max-w-3xl">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-2xl lg:text-3xl tracking-tight mb-4">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="text-[0.9375rem] text-muted-foreground leading-7">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 whitespace-pre-line">
                        {paragraph.split('**').map((part, j) =>
                          j % 2 === 1 ? (
                            <strong key={j} className="text-foreground font-medium">{part}</strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-foreground/10">
              <p className="text-sm font-mono text-muted-foreground">
                © {new Date().getFullYear()} OnlyWorks Inc. All rights reserved.
              </p>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  )
}
