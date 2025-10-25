'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut, User, FileText, BarChart3, Brain, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const AuthenticatedNavigation = () => {
  const { user, signOut } = useAuth() as any
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

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

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/insights', icon: Brain, label: 'AI Insights' },
  ]

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/images/onlyworks-logo.png"
                  alt="OnlyWorks"
                  width={128}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop user email */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>

              {/* Desktop sign out */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* Mobile hamburger */}
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
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 md:hidden overflow-y-auto">
            <div className="px-6 py-8 space-y-1">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-500">Signed in</p>
                </div>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-lg font-medium">{item.label}</span>
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="h-px bg-gray-200 my-6" />

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  handleSignOut()
                  closeMenu()
                }}
                className="flex items-center gap-3 px-4 py-4 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AuthenticatedNavigation