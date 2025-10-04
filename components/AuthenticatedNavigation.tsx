'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, FileText, BarChart3 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const AuthenticatedNavigation = () => {
  const { user, signOut } = useAuth() as any
  const router = useRouter()

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

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Logo size={32} />
              <span className="text-xl font-semibold text-gray-900">OnlyWorks</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/reports"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Reports
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AuthenticatedNavigation