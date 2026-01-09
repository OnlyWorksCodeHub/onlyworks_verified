'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/">
            <Image src="/images/logo.png" alt="OnlyWorks" width={32} height={32} className="logo-icon" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
          </div>

          {/* Desktop Access Button - hidden on mobile */}
          <Link href="/downloads" className="btn btn-primary" style={{ display: 'none' }} id="desktop-access">
            Access
          </Link>

          {/* Mobile Hamburger - hidden on desktop */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle menu"
            id="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--text)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--text)' }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className="absolute top-0 right-0 w-64 h-full p-6 pt-20"
            style={{ background: 'var(--bg)' }}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5 p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" style={{ color: 'var(--text)' }} />
            </button>

            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-lg font-medium py-2"
                style={{ color: 'var(--text)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-lg font-medium py-2"
                style={{ color: 'var(--text)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/careers"
                className="text-lg font-medium py-2"
                style={{ color: 'var(--text)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link
                  href="/downloads"
                  className="btn btn-primary w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
