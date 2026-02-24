'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <Loader2 style={{ width: '24px', height: '24px', color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/images/logo.png" alt="OnlyWorks" style={{ height: '32px', width: '32px', filter: 'grayscale(100%) brightness(0)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {user?.email}
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '3rem 1rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Set up your profile
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
          }}>
            This will create your public OnlyWorks profile and OW ID.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="profile-step-indicator">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`profile-step ${i < step ? 'active' : ''}`}
            />
          ))}
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#fef2f2',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        <div className="profile-setup-form">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginBottom: '6px',
                }}>
                  Full name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginBottom: '6px',
                }}>
                  Job title
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginBottom: '6px',
                }}>
                  Company
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Acme Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ width: '100%', height: '48px', fontSize: '0.9375rem' }}
              >
                Continue
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          )}

          {/* Step 2: Bio */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginBottom: '6px',
                }}>
                  Bio
                </label>
                <textarea
                  className="input"
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 280) {
                      setBio(e.target.value)
                    }
                  }}
                  style={{
                    height: '120px',
                    padding: '12px 16px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  color: bio.length > 260 ? '#dc2626' : 'var(--text-muted)',
                  marginTop: '4px',
                }}>
                  {bio.length}/280
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ height: '48px', flex: 1 }}
                >
                  <ArrowLeft style={{ width: '18px', height: '18px' }} />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  style={{ height: '48px', flex: 2 }}
                >
                  Continue
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {step === 3 && (
            <div>
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
              }}>
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                  }}
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
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--accent)',
                    }}
                  />
                  <span style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text)',
                  }}>
                    {label}
                  </span>
                </label>
              ))}

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setStep(2)}
                  className="btn btn-secondary"
                  style={{ height: '48px', flex: 1 }}
                >
                  <ArrowLeft style={{ width: '18px', height: '18px' }} />
                  Back
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="btn btn-primary"
                  disabled={saving}
                  style={{
                    height: '48px',
                    flex: 2,
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
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
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                padding: '4px 8px',
              }}
            >
              <SkipForward style={{ width: '14px', height: '14px' }} />
              Skip for now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
