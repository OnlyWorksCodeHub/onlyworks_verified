'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface MobileNavigationProps {
  currentPage?: string
}

export function MobileNavigation({ currentPage }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth() as any

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/teams', label: 'Teams' },
    { href: '/careers', label: 'Careers' },
    { href: '/updates', label: 'Updates' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/onlyworks-logo.png"
                alt="OnlyWorks"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base ${
                    currentPage === item.href
                      ? 'text-primary hover:text-primary-dark font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-base"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 text-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-base"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 -mr-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed top-20 left-0 right-0 bottom-0 bg-white z-40 md:hidden overflow-y-auto">
            <div className="px-6 py-8 space-y-1">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block px-4 py-4 text-lg rounded-lg transition-colors ${
                    currentPage === item.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px bg-gray-200 my-6" />

              {/* Auth Buttons */}
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="block w-full px-4 py-4 bg-primary text-white text-center text-lg font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block w-full px-4 py-4 text-gray-700 text-center text-lg font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block w-full px-4 py-4 bg-primary text-white text-center text-lg font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
