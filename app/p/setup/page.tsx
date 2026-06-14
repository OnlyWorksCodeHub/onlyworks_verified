'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import { Loader2, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'

const TOTAL_STEPS = 3

export default function ProfileSetupPage() {
  const { user, backendToken, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Wait for the profile-completion check before rendering the setup form,
  // otherwise returning users see this page flash on screen before they get
  // redirected to /p/edit.
  const [checkingProfile, setCheckingProfile] = useState(true)

  // Form state
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
  const [privacySettings, setPrivacySettings] = useState({
    show_stats: true,
    show_apps: true,
    show_streak: true,
    show_reports: true,
    is_profile_public: true,
  })

  // If the user has already completed their profile, send them straight to
  // /p/edit. This catches the case where a returning user signs in and the
  // auth callback (or AuthProvider) couldn't already make the routing call
  // server-side.
  useEffect(() => {
    if (authLoading) return
    if (!backendToken) {
      setCheckingProfile(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        if (!res.ok) {
          if (!cancelled) setCheckingProfile(false)
          return
        }
        const data = await res.json()
        const profile = data?.data ?? data
        const alreadySetUp =
          profile?.profile_complete === true ||
          (typeof profile?.full_name === 'string' && profile.full_name.trim().length > 0 && profile?.ow_id)
        if (alreadySetUp && profile?.ow_id) {
          router.replace(`/p/${profile.ow_id}`)
          return
        }
        // Pre-fill any partial data the user already has so they don't re-enter from scratch
        if (!cancelled) {
          if (profile?.full_name) setFullName(profile.full_name)
          if (profile?.job_title) setJobTitle(profile.job_title)
          if (profile?.company) setCompany(profile.company)
          if (profile?.bio) setBio(profile.bio)
          setCheckingProfile(false)
        }
      } catch {
        if (!cancelled) setCheckingProfile(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authLoading, backendToken, router])

  const handleSubmit = async (skip?: boolean) => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/profiles/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendToken}`,
        },
        body: JSON.stringify(skip ? {} : {
          full_name: fullName || undefined,
          job_title: jobTitle || undefined,
          company: company || undefined,
          bio: bio || undefined,
          privacy_settings: privacySettings,
        }),
      })

      const data = await res.json()

      if (data.success && data.data?.ow_id) {
        router.push(`/p/${data.data.ow_id}`)
      } else {
        setError(data.error || 'Failed to set up profile. Please try again.')
        setSaving(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header (consistent with login) */}
      <header className="border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image src="/images/logo.png" alt="OnlyWorks" width={36} height={36} />
          </Link>
          <span className="text-sm font-mono text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[480px] mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight mb-2">
            Set up your profile
          </h1>
          <p className="text-base text-muted-foreground">
            This will create your public OnlyWorks profile and OW ID.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-colors ${i < step ? 'bg-[#8b5cf6]' : 'bg-foreground/10'}`}
            />
          ))}
        </div>

        {error && (
          <div className="px-4 py-3 mb-6 text-sm border border-[#e40014]/30 bg-[#e40014]/[0.04] text-[#e40014]">
            {error}
          </div>
        )}

        <div>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/40"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Job title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/40"
                  placeholder="e.g. Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/40"
                  placeholder="e.g. Acme Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#8b5cf6' }}
              >
                Continue
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>
            </div>
          )}

          {/* Step 2: Bio */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/40 min-h-[120px] resize-y"
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 280) {
                      setBio(e.target.value)
                    }
                  }}
                />
                <div className={`text-right text-xs mt-1 ${bio.length > 260 ? 'text-[#e40014]' : 'text-muted-foreground'}`}>
                  {bio.length}/280
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  <ArrowLeft className="w-[18px] h-[18px]" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#8b5cf6' }}
                >
                  Continue
                  <ArrowRight className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {step === 3 && (
            <div>
              <p className="text-base text-muted-foreground mb-6">
                Choose what appears on your public profile.
              </p>
              {[
                { key: 'is_profile_public', label: 'Make profile public' },
                { key: 'show_stats', label: 'Show productivity stats' },
                { key: 'show_apps', label: 'Show app breakdown' },
                { key: 'show_streak', label: 'Show work streaks' },
                { key: 'show_reports', label: 'Show public reports' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 py-3 border-b border-foreground/10 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={privacySettings[key as keyof typeof privacySettings]}
                    onChange={(e) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-[18px] h-[18px] accent-[#8b5cf6]"
                  />
                  <span className="text-sm text-foreground">
                    {label}
                  </span>
                </label>
              ))}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  <ArrowLeft className="w-[18px] h-[18px]" />
                  Back
                </button>
                <button
                  onClick={() => handleSubmit()}
                  disabled={saving}
                  className="flex-[2] inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#8b5cf6' }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Profile'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Skip option */}
          <div className="text-center mt-6">
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip for now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
