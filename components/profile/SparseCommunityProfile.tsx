'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Calendar, Info } from 'lucide-react'
import VerificationPill from '@/components/ui/VerificationPill'
import type { ProfileData } from '@/lib/types/profile'

const AVATAR_SIZE: CSSProperties = { width: 80, height: 80, borderRadius: '50%', border: '3px solid white', flexShrink: 0 }
const HEADER_ROW: CSSProperties = { display: 'flex', alignItems: 'flex-end', gap: '1.25rem', position: 'relative', paddingTop: '0.5rem', flexWrap: 'wrap' }
const BODY_COPY: CSSProperties = { fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-secondary)' }
const MONO_LABEL: CSSProperties = { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }
const CHIP: CSSProperties = {
  display: 'inline-flex',
  padding: '0.375rem 0.75rem',
  fontSize: '0.875rem',
  borderRadius: '999px',
  border: '1px solid var(--border)',
  background: 'var(--bg-alt)',
  color: 'var(--text-secondary)',
}

export default function SparseCommunityProfile({ profile }: { profile: ProfileData }) {
  const name = profile.full_name || profile.name || 'Anonymous'
  const firstName = name.split(/\s+/)[0] || name
  const skills = profile.self_reported_skills ?? []
  const lookingFor = [...(profile.target_roles ?? []), ...(profile.target_locations ?? [])]
  const lookingForLine = lookingFor.length ? lookingFor.join(' · ') : null
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div style={{ marginBottom: '1rem' }}>
          <VerificationPill status="community" variant="onDark" />
        </div>
        <div style={HEADER_ROW}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={name} style={{ ...AVATAR_SIZE, objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                ...AVATAR_SIZE,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'white',
              }}
              aria-hidden
            >
              {initials}
            </div>
          )}
          <div style={{ color: 'white', paddingBottom: '4px', flex: 1, minWidth: 0 }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, margin: 0, color: 'white' }}>
              {name}
            </h1>
            {lookingForLine && (
              <p style={{ margin: '0.5rem 0 0', ...BODY_COPY, color: 'rgba(255,255,255,0.9)' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>Looking for: </span>
                {lookingForLine}
              </p>
            )}
            <div className="ow-id-display" style={{ color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
              {profile.ow_id}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.25rem 2rem 1.5rem' }}>
        {skills.length > 0 && (
          <div style={{ marginBottom: profile.member_since ? '1rem' : '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
            <p className="font-mono" style={{ ...MONO_LABEL, margin: '0 0 0.75rem' }}>Self-reported skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => (
                <span key={s} style={CHIP}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {profile.member_since && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <Calendar style={{ width: 14, height: 14 }} />
            Member since {new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        )}

        <div className="border border-foreground/10 p-8" style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-alt)' }}>
          <Info style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, color: 'var(--text-muted)' }} aria-hidden />
          <div>
            <p style={{ ...BODY_COPY, margin: '0 0 0.75rem' }}>This candidate hasn&apos;t connected verified work history yet.</p>
            <p style={{ ...BODY_COPY, margin: 0 }}>
              Are you {firstName}?{' '}
              <Link href="/downloads" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'underline' }}>
                Get the OnlyWorks desktop app
              </Link>{' '}
              to verify your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
