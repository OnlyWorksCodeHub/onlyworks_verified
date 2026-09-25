import Link from 'next/link'

interface Props {
  displayName: string
}

/** Bottom hiring CTA shared by /p/[owId] and /ow/[token]. */
export default function PublicProfileCta({ displayName }: Props) {
  return (
    <div className="pp-express-bar">
      <div className="pp-express-copy">
        <h3 className="font-display text-xl tracking-tight" style={{ color: 'var(--text)' }}>
          Hiring for skills like {displayName}&apos;s?
        </h3>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Search proven candidates for free today. Join the hiring waitlist to get notified when
          Express Interest and job posting open.
        </p>
      </div>
      <Link
        href="/hiring#register"
        className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white hover:opacity-90 transition-all shrink-0"
        style={{ background: '#8b5cf6' }}
      >
        Start hiring →
      </Link>
    </div>
  )
}
