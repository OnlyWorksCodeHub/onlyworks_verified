'use client'

import { Calendar } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import CopyProfileLink from './CopyProfileLink'
import ExpressInterestButton from './ExpressInterestButton'
import type { ProfileData, BadgeStatus } from '@/lib/types/profile'

interface ProfileCardProps {
  profile: ProfileData
  badgeStatus: BadgeStatus
  /** Absolute or path URL used for the copy-link control. */
  shareUrl?: string
  /** When set, show Express Interest (HM outreach). */
  showExpressInterest?: boolean
}

export default function ProfileCard({
  profile,
  badgeStatus,
  shareUrl,
  showExpressInterest = false,
}: ProfileCardProps) {
  const displayName = profile.full_name || profile.name || 'Anonymous'
  const initials = displayName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const titleLine = [profile.job_title, profile.company].filter(Boolean).join(' · ')

  return (
    <div className="profile-card pp-header-card">
      <div className="profile-card-header pp-header">
        <div className="pp-header-main">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="pp-avatar"
            />
          ) : (
            <div className="pp-avatar pp-avatar-fallback" aria-hidden>
              {initials}
            </div>
          )}

          <div className="pp-info min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display tracking-tight pp-name">{displayName}</h1>
              <VerificationBadge status={badgeStatus} />
            </div>

            {titleLine && (
              <p className="pp-title">{titleLine}</p>
            )}

            <div className="pp-pills">
              {badgeStatus === 'verified' && (
                <span className="pp-pill pp-pill-verified">◆ Verified by OnlyWorks</span>
              )}
              {badgeStatus === 'trial' && (
                <span className="pp-pill pp-pill-trial">Trial verification</span>
              )}
              {profile.open_to_contact && (
                <span className="pp-pill">● Open to opportunities</span>
              )}
              {Array.isArray(profile.target_locations) && profile.target_locations.length > 0 && (
                <span className="pp-pill">{profile.target_locations.slice(0, 3).join(' · ')}</span>
              )}
              <span className="pp-pill pp-pill-id">{profile.ow_id}</span>
            </div>
          </div>
        </div>

        <div className="pp-actions">
          <div className="pp-ow-id">
            <span className="pp-ow-id-label">OnlyWorks ID</span>
            <strong className="ow-id-display">{profile.ow_id}</strong>
            {shareUrl && <CopyProfileLink url={shareUrl} />}
          </div>
          {showExpressInterest && (
            <div className="mt-3">
              <ExpressInterestButton owId={profile.ow_id} displayName={displayName} />
            </div>
          )}
        </div>
      </div>

      <div className="pp-body">
        {profile.bio && (
          <p className="pp-summary">{profile.bio}</p>
        )}

        {profile.member_since && (
          <div className="pp-meta">
            <Calendar style={{ width: '14px', height: '14px' }} />
            <span>Member since {profile.member_since}</span>
          </div>
        )}
      </div>
    </div>
  )
}
