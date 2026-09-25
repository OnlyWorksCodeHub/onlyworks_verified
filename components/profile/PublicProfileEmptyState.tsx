import Link from 'next/link'

/** Shown when a public profile has no verified OW data yet. */
export default function PublicProfileEmptyState() {
  return (
    <div className="profile-card p-6 sm:p-8 text-center mb-4">
      <span className="inline-flex items-center gap-2 text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
        Verified skills
      </span>
      <h2 className="font-display text-2xl tracking-tight mb-2" style={{ color: 'var(--text)' }}>
        No verified work published yet
      </h2>
      <p className="text-sm max-w-md mx-auto mb-5" style={{ color: 'var(--text-secondary)' }}>
        This profile is public, but there are no OnlyWorks capture reports to prove skills yet.
        Capture sessions in the desktop app to fill this page.
      </p>
      <Link
        href="/downloads"
        className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
        style={{ background: '#8b5cf6' }}
      >
        Get OnlyWorks Desktop
      </Link>
    </div>
  )
}
