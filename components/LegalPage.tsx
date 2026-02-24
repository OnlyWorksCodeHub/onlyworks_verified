'use client'

import { useState } from 'react'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {/* Simple header */}
      <header className="border-b" style={{ borderColor: '#e5e5e5', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium" style={{ color: '#0a0a0a' }}>
            &larr; Back to OnlyWorks
          </Link>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm"
              style={{
                color: activeLink === 'privacy' ? '#0064e0' : '#525252',
                fontWeight: activeLink === 'privacy' ? 500 : 400
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm"
              style={{
                color: activeLink === 'terms' ? '#0064e0' : '#525252',
                fontWeight: activeLink === 'terms' ? 500 : 400
              }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r sticky top-0 h-screen overflow-y-auto hidden lg:block" style={{ borderColor: '#e5e5e5' }}>
          <nav className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#525252' }}>
              {title}
            </h2>
            <ul className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      color: activeSection === section.id ? '#0064e0' : '#525252',
                      background: activeSection === section.id ? '#f0f7ff' : 'transparent',
                      fontWeight: activeSection === section.id ? 500 : 400
                    }}
                  >
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="mb-12">
              <h1 className="text-4xl font-semibold mb-4" style={{ color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                {title}
              </h1>
              <p className="text-sm" style={{ color: '#525252' }}>
                Effective Date: January 1, 2025 &middot; Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="space-y-16">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-8">
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#0a0a0a' }}>
                    {index + 1}. {section.title}
                  </h2>
                  <div
                    className="prose prose-sm"
                    style={{
                      color: '#374151',
                      lineHeight: 1.75,
                      fontSize: '0.9375rem'
                    }}
                  >
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 whitespace-pre-line">
                        {paragraph.split('**').map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t" style={{ borderColor: '#e5e5e5' }}>
              <p className="text-sm" style={{ color: '#525252' }}>
                &copy; {new Date().getFullYear()} OnlyWorks Inc. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
