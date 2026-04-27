'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/components/AuthProvider'
import { Loader2, Save, ExternalLink, Copy, Check } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'

export default function ProfileEditPage() {
  const { user, backendToken, owId, loading: authLoading } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form state
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [privacySettings, setPrivacySettings] = useState({
    show_stats: true,
    show_apps: true,
    show_streak: true,
    show_reports: true,
  })

  // Load profile data
  useEffect(() => {
    if (!backendToken) return

    async function loadProfile() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profiles/me`, {
          headers: { 'Authorization': `Bearer ${backendToken}` },
        })
        const data = await res.json()

        if (data.success && data.data) {
          const p = data.data
          setFullName(p.full_name || '')
          setJobTitle(p.job_title || '')
          setCompany(p.company || '')
          setBio(p.bio || '')
          setIsPublic(p.is_profile_public ?? true)
          if (p.privacy_settings) {
            setPrivacySettings({
              show_stats: p.privacy_settings.show_stats ?? true,
              show_apps: p.privacy_settings.show_apps ?? true,
              show_streak: p.privacy_settings.show_streak ?? true,
              show_reports: p.privacy_settings.show_reports ?? true,
            })
          }
        }
      } catch (err) {
        console.error('[ProfileEdit] Failed to load profile:', err instanceof Error ? err.message : err)
        setError('Failed to load profile. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [backendToken])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`${BACKEND_URL}/api/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendToken}`,
        },
        body: JSON.stringify({
          full_name: fullName || undefined,
          job_title: jobTitle || undefined,
          company: company || undefined,
          bio: bio || undefined,
          is_profile_public: isPublic,
          privacy_settings: privacySettings,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to save. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!owId) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${owId}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('[ProfileEdit] Clipboard not available:', err instanceof Error ? err.message : err)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main — pt clears the fixed Navigation header (~70px) plus breathing room */}
      <main className="max-w-[560px] mx-auto px-4 pt-28 lg:pt-32 pb-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Edit Profile
          </h1>
          {owId && (
            <div className="flex gap-2">
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center px-3 py-2 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors gap-1.5 h-9"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              <Link
                href={`/p/${owId}`}
                className="inline-flex items-center px-3 py-2 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors gap-1.5 h-9"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </Link>
            </div>
          )}
        </div>

        {owId && (
          <div className="px-4 py-3 rounded-xl bg-violet-50 mb-6 flex items-center gap-3">
            <span className="text-sm text-neutral-500">Your OW ID:</span>
            <span className="ow-id-display">{owId}</span>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-xl bg-green-50 text-green-800 text-sm mb-6">
            Profile saved successfully.
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
              Job title
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all"
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
              Company
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all"
              placeholder="e.g. Acme Inc"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
              Bio
            </label>
            <textarea
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 outline-none transition-all h-[100px] resize-y font-[inherit]"
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setBio(e.target.value)
                }
              }}
            />
            <div className={`text-right text-xs mt-1 ${bio.length > 260 ? 'text-red-600' : 'text-neutral-400'}`}>
              {bio.length}/280
            </div>
          </div>

          {/* Visibility */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-[0.9375rem] font-semibold text-neutral-900 mb-4">
              Profile Visibility
            </h3>

            <label className="flex items-center gap-3 py-2.5 cursor-pointer border-b border-neutral-200">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-[18px] h-[18px] accent-violet-600"
              />
              <span className="text-[0.9375rem] text-neutral-900">
                Make profile public
              </span>
            </label>

            {[
              { key: 'show_stats', label: 'Show productivity stats' },
              { key: 'show_apps', label: 'Show app breakdown' },
              { key: 'show_streak', label: 'Show work streaks' },
              { key: 'show_reports', label: 'Show public reports' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 py-2.5 cursor-pointer border-b border-neutral-200"
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
                  className="w-[18px] h-[18px] accent-violet-600"
                />
                <span className="text-[0.9375rem] text-neutral-900">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <ShimmerButton
          onClick={handleSave}
          disabled={saving}
          className={`w-full h-12 text-[0.9375rem] mt-6 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {saving ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-[18px] h-[18px]" />
              Save Changes
            </>
          )}
        </ShimmerButton>
      </main>
    </div>
  )
}
