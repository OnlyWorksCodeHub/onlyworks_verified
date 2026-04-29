'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Save } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL } from '@/lib/config'

type TeamSize = '1-10' | '11-50' | '51-200' | '201-500' | '500+'

type HiringProfileForm = {
  company: string
  job_title: string
  logo_url: string
  website_url: string
  team_size: '' | TeamSize
  location: string
  contact_email: string
  bio: string
}

type FieldErrors = Partial<Record<keyof HiringProfileForm, string>>

type HiringProfileRecord = {
  company?: string | null
  job_title?: string | null
  logo_url?: string | null
  website_url?: string | null
  team_size?: TeamSize | null
  location?: string | null
  contact_email?: string | null
  bio?: string | null
}

type HiringGetMeResponse = {
  success?: boolean
  data?: HiringProfileRecord
  message?: string
}

type HiringPutMeResponse = HiringProfileRecord & {
  error?: string
  message?: string
  errors?: Partial<Record<keyof HiringProfileForm, string>>
}

const TEAM_SIZE_OPTIONS: TeamSize[] = ['1-10', '11-50', '51-200', '201-500', '500+']

const EMPTY_FORM: HiringProfileForm = {
  company: '',
  job_title: '',
  logo_url: '',
  website_url: '',
  team_size: '',
  location: '',
  contact_email: '',
  bio: '',
}

function normalizeProfileToForm(profile: HiringProfileRecord | null | undefined): HiringProfileForm {
  return {
    company: profile?.company ?? '',
    job_title: profile?.job_title ?? '',
    logo_url: profile?.logo_url ?? '',
    website_url: profile?.website_url ?? '',
    team_size: profile?.team_size ?? '',
    location: profile?.location ?? '',
    contact_email: profile?.contact_email ?? '',
    bio: profile?.bio ?? '',
  }
}

function extractFieldErrors(payload: unknown): FieldErrors {
  if (!payload || typeof payload !== 'object') return {}
  const data = payload as Record<string, unknown>
  const acceptedKeys: (keyof HiringProfileForm)[] = [
    'company',
    'job_title',
    'logo_url',
    'website_url',
    'team_size',
    'location',
    'contact_email',
    'bio',
  ]

  const fieldErrors: FieldErrors = {}

  const rawErrors = data.errors
  if (rawErrors && typeof rawErrors === 'object') {
    for (const key of acceptedKeys) {
      const value = (rawErrors as Record<string, unknown>)[key]
      if (typeof value === 'string' && value.trim()) {
        fieldErrors[key] = value
      }
    }
    return fieldErrors
  }

  // Current backend implementation returns { error: "Invalid website_url" } style payloads.
  const rawError = data.error
  if (typeof rawError === 'string' && rawError.trim()) {
    for (const key of acceptedKeys) {
      if (rawError.includes(key)) {
        fieldErrors[key] = rawError
      }
    }
  }

  return fieldErrors
}

function computeChangedFields(current: HiringProfileForm, initial: HiringProfileForm) {
  const payload: Partial<HiringProfileForm> = {}
  ;(Object.keys(current) as (keyof HiringProfileForm)[]).forEach((key) => {
    if (current[key] !== initial[key]) {
      ;(payload as Record<keyof HiringProfileForm, HiringProfileForm[keyof HiringProfileForm]>)[key] = current[key]
    }
  })
  return payload
}

export default function HiringProfilePage() {
  const router = useRouter()
  const { user, backendToken, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<HiringProfileForm>(EMPTY_FORM)
  const [initialForm, setInitialForm] = useState<HiringProfileForm>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const bioLength = form.bio.length
  const hasChanges = useMemo(
    () => Object.keys(computeChangedFields(form, initialForm)).length > 0,
    [form, initialForm]
  )

  useEffect(() => {
    if (authLoading) return

    // 1) No authenticated user => login
    if (!user) {
      router.replace('/login?next=/hiring/profile')
      return
    }

    // 2) User exists but backendToken may still be exchanging, keep waiting
    if (!backendToken) return

    async function loadProfile() {
      setLoading(true)
      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${backendToken}` },
        })

        // Issue #19 behavior: logged-in non-HM goes to /hiring
        if (res.status === 404) {
          router.replace('/hiring')
          return
        }

        const payload: HiringGetMeResponse = await res.json()
        if (!res.ok) {
          throw new Error(payload?.message || 'Failed to load hiring profile')
        }

        const nextForm = normalizeProfileToForm(payload?.data)
        setForm(nextForm)
        setInitialForm(nextForm)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [authLoading, user, backendToken, router])

  const onFieldChange = <K extends keyof HiringProfileForm>(key: K, value: HiringProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!backendToken) return

    const payload = computeChangedFields(form, initialForm)
    if (Object.keys(payload).length === 0) {
      toast('No changes to save')
      return
    }

    setSaving(true)
    setFieldErrors({})
    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backendToken}`,
        },
        body: JSON.stringify(payload),
      })

      const responsePayload: HiringPutMeResponse = await res.json()

      if (res.status === 400) {
        const inlineErrors = extractFieldErrors(responsePayload)
        if (Object.keys(inlineErrors).length > 0) {
          setFieldErrors(inlineErrors)
        }
        throw new Error(responsePayload?.error || responsePayload?.message || 'Validation failed')
      }

      // Logged-in user but still not HM row (Option A)
      if (res.status === 404) {
        router.replace('/hiring')
        return
      }

      if (!res.ok) {
        throw new Error(responsePayload?.error || responsePayload?.message || 'Failed to update profile')
      }

      const nextForm = normalizeProfileToForm(responsePayload)
      setForm(nextForm)
      setInitialForm(nextForm)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text)' }}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
            Hiring profile
          </span>
          <h1 className="mt-3">Edit your hiring profile</h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            Keep your company profile up to date so candidates can trust what they see.
          </p>
        </div>

        <form onSubmit={handleSave} className="border rounded-xl bg-white p-5 sm:p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Company *</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Enter your company or organization name.
              </p>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => onFieldChange('company', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.company && <p className="text-xs mt-1 text-red-600">{fieldErrors.company}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Job title</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Add your role if you want candidates to see it.
              </p>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => onFieldChange('job_title', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.job_title && <p className="text-xs mt-1 text-red-600">{fieldErrors.job_title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Logo URL</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Paste a public image link to your logo.
              </p>
              <input
                type="url"
                value={form.logo_url}
                onChange={(e) => onFieldChange('logo_url', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.logo_url && <p className="text-xs mt-1 text-red-600">{fieldErrors.logo_url}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Company website</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Use your official website URL.
              </p>
              <input
                type="url"
                value={form.website_url}
                onChange={(e) => onFieldChange('website_url', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.website_url && <p className="text-xs mt-1 text-red-600">{fieldErrors.website_url}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Team size</label>
              <select
                value={form.team_size}
                onChange={(e) => onFieldChange('team_size', e.target.value as HiringProfileForm['team_size'])}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 bg-white"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="">-</option>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {fieldErrors.team_size && <p className="text-xs mt-1 text-red-600">{fieldErrors.team_size}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Share the city or region your team is based in.
              </p>
              <input
                type="text"
                value={form.location}
                onChange={(e) => onFieldChange('location', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.location && <p className="text-xs mt-1 text-red-600">{fieldErrors.location}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Contact email</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Candidates can use this email to reach your team.
              </p>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => onFieldChange('contact_email', e.target.value)}
                className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              {fieldErrors.contact_email && <p className="text-xs mt-1 text-red-600">{fieldErrors.contact_email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Write a short intro about your company and hiring focus.
              </p>
              <textarea
                value={form.bio}
                onChange={(e) => onFieldChange('bio', e.target.value.slice(0, 500))}
                className="w-full min-h-[130px] rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)' }}
              />
              <div className="flex items-center justify-between mt-1">
                {fieldErrors.bio ? <p className="text-xs text-red-600">{fieldErrors.bio}</p> : <span />}
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {bioLength} / 500
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
            <Link href="/hiring" className="text-sm underline underline-offset-4" style={{ color: 'var(--text-secondary)' }}>
              Back to hiring
            </Link>

            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-sm font-medium text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--accent)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
