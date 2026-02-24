import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container flex justify-between items-center">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} OnlyWorks
        </span>
        <div className="flex gap-6">
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <Link href="/terms" className="footer-link">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
