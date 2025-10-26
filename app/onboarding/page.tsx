'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Users, User, ArrowRight, BarChart3, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserProfile, completeOnboarding, getRedirectPath } from '@/lib/utils/onboardingHelper'

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth() as any
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (!authLoading && user) {
      checkOnboardingStatus()
    }
  }, [user, authLoading, router])

  const checkOnboardingStatus = async () => {
    try {
      setCheckingStatus(true)
      const profile = await getUserProfile(user.id)

      // If user already has a role, redirect them
      if (profile && profile.user_role) {
        const redirectPath = getRedirectPath(profile)
        router.push(redirectPath)
        return
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleRoleSelection = async (role: 'manager' | 'member') => {
    setLoading(true)

    try {
      // Complete onboarding with the new helper
      const result = await completeOnboarding(user.id, role)

      if (!result.success) {
        throw result.error
      }

      toast.success(`Welcome! You're set up as a ${role}`)

      // Redirect based on role
      if (role === 'manager') {
        router.push('/workspace')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Error setting role:', error)
      toast.error('Failed to set role. Please try again.')
      setLoading(false)
    }
  }

  if (authLoading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5c5ce6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to OnlyWorks!
          </h1>
          <p className="text-lg text-gray-600">
            Let's get you set up. How will you be using OnlyWorks?
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Manager Card */}
          <button
            onClick={() => handleRoleSelection('manager')}
            disabled={loading}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#5c5ce6] hover:shadow-xl transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-[#5c5ce6] transition-colors">
              <Users className="w-6 h-6 text-[#5c5ce6] group-hover:text-white transition-colors" />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I manage a team</h2>
              <p className="text-gray-600 leading-relaxed">
                Create teams, invite members, and track productivity across your organization
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">View aggregated team metrics and analytics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Ensure work authenticity across your team</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Share verified reports with clients</p>
              </div>
            </div>

            <div className="flex items-center text-[#5c5ce6] font-medium group-hover:translate-x-1 transition-transform">
              Continue as Manager
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </button>

          {/* Member Card */}
          <button
            onClick={() => handleRoleSelection('member')}
            disabled={loading}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#5c5ce6] hover:shadow-xl transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-[#5c5ce6] transition-colors">
              <User className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm an individual contributor</h2>
              <p className="text-gray-600 leading-relaxed">
                Track your personal productivity and prove your work is real
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Track your personal productivity metrics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Generate tamper-proof work reports</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Join teams and collaborate securely</p>
              </div>
            </div>

            <div className="flex items-center text-[#5c5ce6] font-medium group-hover:translate-x-1 transition-transform">
              Continue as Member
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
