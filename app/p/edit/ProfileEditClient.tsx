'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { Loader2, Save, ExternalLink, Copy, Check } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Main — pt clears the fixed Navigation header (~72px) plus breathing room */}
      <main className="max-w-[640px] mx-auto px-6 pt-28 lg:pt-32 pb-20">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">
            Edit Profile
          </h1>
          {owId && (
            <div className="flex gap-2">
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
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
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview
              </Link>
            </div>
          )}
        </div>

        {owId && (
          <div className="px-4 py-3 mb-6 flex items-center gap-3 border border-foreground/10 bg-background">
            <span className="text-sm text-muted-foreground">Your OW ID:</span>
            <span className="ow-id-display">{owId}</span>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 mb-6 text-sm border border-[#e40014]/30 bg-[#e40014]/[0.04] text-[#e40014]">
            {error}
          </div>
        )}

        {success && (
          <div className="px-4 py-3 mb-6 text-sm border border-green-600/30 bg-green-50 text-green-700">
            Profile saved successfully.
          </div>
        )}

        {/* Form */}
        <div className="border border-foreground/10 bg-background p-6 lg:p-8">
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

          <div className="mb-4">
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

          {/* Visibility */}
          <div className="pt-4 border-t border-foreground/10">
            <h3 className="text-base font-medium text-foreground mb-4">
              Profile Visibility
            </h3>

            <label className="flex items-center gap-3 py-3 border-b border-foreground/10 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-[18px] h-[18px] accent-[#8b5cf6]"
              />
              <span className="text-sm text-foreground">
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
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 w-full h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 mt-6"
          style={{ background: '#8b5cf6' }}
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
        </button>
      </main>

      <Footer />
    </div>
  )
}
