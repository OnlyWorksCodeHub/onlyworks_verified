import Link from 'next/link'
import { Zap, AlertCircle } from 'lucide-react'

interface UpgradePromptProps {
  previouslyVerified?: boolean
}

export default function UpgradePrompt({ previouslyVerified }: UpgradePromptProps) {
  return (
    <div className="profile-card" style={{
      padding: '2rem',
      textAlign: 'center',
      background: previouslyVerified ? 'var(--bg-alt)' : 'var(--card)',
    }}>
      {previouslyVerified ? (
        <>
          <AlertCircle style={{
            width: '32px',
            height: '32px',
            color: 'var(--text-muted)',
            margin: '0 auto 1rem',
          }} />
          <h3 className="font-display text-xl tracking-tight" style={{
            color: 'var(--text)',
            marginBottom: '0.5rem',
          }}>
            Your profile was previously verified
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            maxWidth: '360px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Re-activate your subscription to restore your verified badge and full profile stats.
          </p>
        </>
      ) : (
        <>
          <Zap style={{
            width: '32px',
            height: '32px',
            color: 'var(--accent)',
            margin: '0 auto 1rem',
          }} />
          <h3 className="font-display text-xl tracking-tight" style={{
            color: 'var(--text)',
            marginBottom: '0.5rem',
          }}>
            Unlock your full verified profile
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            maxWidth: '360px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Get a verified badge, detailed stats, app breakdowns, and more with OnlyWorks.
          </p>
        </>
      )}

      <Link href="/downloads" className="btn btn-primary">
        Get OnlyWorks
      </Link>
    </div>
  )
}
