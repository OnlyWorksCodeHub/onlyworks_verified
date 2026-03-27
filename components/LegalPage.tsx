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
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-neutral-900">
            &larr; Back to OnlyWorks
          </Link>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className={`text-sm ${activeLink === 'privacy' ? 'text-violet-600 font-medium' : 'text-neutral-500'}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`text-sm ${activeLink === 'terms' ? 'text-violet-600 font-medium' : 'text-neutral-500'}`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-neutral-200 sticky top-0 h-screen overflow-y-auto hidden lg:block">
          <nav className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-neutral-500">
              {title}
            </h2>
            <ul className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'text-violet-600 bg-violet-50 font-medium'
                        : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
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
              <h1 className="text-4xl font-semibold mb-4 text-neutral-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-neutral-500">
                Effective Date: January 1, 2025 &middot; Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="space-y-16">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-neutral-900">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="prose prose-sm text-neutral-600 leading-7 text-[0.9375rem]">
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
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} OnlyWorks Inc. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
