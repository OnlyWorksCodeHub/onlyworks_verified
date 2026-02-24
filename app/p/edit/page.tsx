'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
        maxWidth: '560px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            Edit Profile
          </h1>
          {owId && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCopyUrl}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', height: '36px', padding: '0 12px' }}
              >
                {copied ? (
                  <Check style={{ width: '14px', height: '14px', color: '#16a34a' }} />
                ) : (
                  <Copy style={{ width: '14px', height: '14px' }} />
                )}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              <Link
                href={`/p/${owId}`}
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', height: '36px', padding: '0 12px' }}
              >
                <ExternalLink style={{ width: '14px', height: '14px' }} />
                Preview
              </Link>
            </div>
          )}
        </div>

        {owId && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'var(--accent-light)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Your OW ID:</span>
            <span className="ow-id-display">{owId}</span>
          </div>
        )}

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

        {success && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#dcfce7',
            color: '#166534',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            Profile saved successfully.
          </div>
        )}

        {/* Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
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

          <div style={{ marginBottom: '1rem' }}>
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
                height: '100px',
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

          {/* Visibility */}
          <div style={{
            padding: '1rem 0',
            borderTop: '1px solid var(--border)',
          }}>
            <h3 style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '1rem',
            }}>
              Profile Visibility
            </h3>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
            }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--accent)',
                }}
              />
              <span style={{ fontSize: '0.9375rem', color: 'var(--text)' }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
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
                <span style={{ fontSize: '0.9375rem', color: 'var(--text)' }}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={saving}
          style={{
            width: '100%',
            height: '48px',
            fontSize: '0.9375rem',
            marginTop: '1.5rem',
            opacity: saving ? 0.6 : 1,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? (
            <>
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              Saving...
            </>
          ) : (
            <>
              <Save style={{ width: '18px', height: '18px' }} />
              Save Changes
            </>
          )}
        </button>
      </main>
    </div>
  )
}
