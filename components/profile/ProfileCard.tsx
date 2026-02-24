'use client'

import { Calendar } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import type { ProfileData, BadgeStatus } from '@/lib/types/profile'

interface ProfileCardProps {
  profile: ProfileData
  badgeStatus: BadgeStatus
}

export default function ProfileCard({ profile, badgeStatus }: ProfileCardProps) {
  const displayName = profile.full_name || profile.name || 'Anonymous'
  const initials = displayName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1.25rem',
          position: 'relative',
          paddingTop: '0.5rem',
        }}>
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px solid white',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '3px solid white',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>
              {initials}
            </div>
          )}
          <div style={{ color: 'white', paddingBottom: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              flexWrap: 'wrap',
            }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                color: 'white',
              }}>
                {displayName}
              </h1>
              <VerificationBadge status={badgeStatus} />
            </div>
            <div className="ow-id-display" style={{ color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
              {profile.ow_id}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.25rem 2rem 1.5rem' }}>
        {(profile.job_title || profile.company) && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            margin: '0 0 0.75rem 0',
          }}>
            {profile.job_title}{profile.job_title && profile.company && ' @ '}{profile.company}
          </p>
        )}

        {profile.bio && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            margin: '0 0 1rem 0',
          }}>
            {profile.bio}
          </p>
        )}

        {profile.member_since && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}>
            <Calendar style={{ width: '14px', height: '14px' }} />
            Member since {new Date(profile.member_since).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        )}
      </div>
    </div>
  )
}
