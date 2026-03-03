'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, User, LogOut, ChevronDown, CreditCard } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, session, owId, loading, signOut } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
    await signOut()
    window.location.href = '/'
  }

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'

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
            <Link href="/support" className="nav-link">Support</Link>
          </div>

          {/* Desktop Right Section */}
          <div style={{ display: 'none' }} id="desktop-access">
            {!loading && session ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text)',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {userInitial}
                  </div>
                  <ChevronDown style={{
                    width: '14px',
                    height: '14px',
                    color: 'var(--text-muted)',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s',
                  }} />
                </button>

                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '6px',
                    width: '200px',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    zIndex: 200,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user?.email}
                    </div>
                    <Link
                      href="/p/edit"
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        color: 'var(--text)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <User style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                      My Profile
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        color: 'var(--text)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-alt)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <CreditCard style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        color: '#dc2626',
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={loading ? '#' : '/login'} className="btn btn-primary">
                Login
              </Link>
            )}
          </div>

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
              <Link
                href="/support"
                className="text-lg font-medium py-2"
                style={{ color: 'var(--text)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {!loading && session ? (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                      padding: '8px 0',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>
                        {userInitial}
                      </div>
                      <span style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px',
                      }}>
                        {user?.email}
                      </span>
                    </div>
                    <Link
                      href="/p/edit"
                      className="btn btn-secondary w-full justify-center"
                      style={{ marginBottom: '8px' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/account"
                      className="btn btn-secondary w-full justify-center"
                      style={{ marginBottom: '8px' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#dc2626',
                        background: 'none',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
