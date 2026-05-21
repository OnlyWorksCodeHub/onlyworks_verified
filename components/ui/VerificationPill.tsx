export type VerificationPillStatus = 'verified' | 'community'
export type VerificationPillVariant = 'default' | 'onDark'

const BASE = 'inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider'

import type { CSSProperties } from 'react'

const STYLE: Record<string, CSSProperties> = {
  verified: { background: '#dcfce7', color: '#166534', border: '1px solid #166534' },
  community: { background: 'rgba(8,5,3,0.04)', border: '1px solid rgba(8,5,3,0.15)' },
  onDark: { background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.45)' },
}

export default function VerificationPill({
  status,
  variant = 'default',
}: {
  status: VerificationPillStatus
  variant?: VerificationPillVariant
}) {
  const verified = status === 'verified'
  return (
    <span
      className={`${BASE}${!verified && variant === 'default' ? ' text-muted-foreground' : ''}`}
      style={verified ? STYLE.verified : variant === 'onDark' ? STYLE.onDark : STYLE.community}
    >
      <span aria-hidden="true">{verified ? '◆' : '○'}</span> {verified ? 'Verified' : 'In Community'}
    </span>
  )
}
