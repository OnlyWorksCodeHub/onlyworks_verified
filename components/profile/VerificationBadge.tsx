import { ShieldCheck } from 'lucide-react'
import type { BadgeStatus } from '@/lib/types/profile'

interface VerificationBadgeProps {
  status: BadgeStatus
}

export default function VerificationBadge({ status }: VerificationBadgeProps) {
  if (status === 'none') return null

  const config = {
    verified: {
      className: 'profile-badge verified',
      label: 'Verified',
      showIcon: true,
    },
    trial: {
      className: 'profile-badge trial',
      label: 'Trial',
      showIcon: false,
    },
    previously_verified: {
      className: 'profile-badge previously-verified',
      label: 'Previously Verified',
      showIcon: false,
    },
  }

  const { className, label, showIcon } = config[status]

  return (
    <span className={className}>
      {showIcon && <ShieldCheck style={{ width: '14px', height: '14px', flexShrink: 0 }} />}
      {label}
    </span>
  )
}
