import Link from 'next/link'
import { FileX } from 'lucide-react'

export default function ReportNotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="OnlyWorks" className="h-8 w-8" />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'var(--bg-alt)' }}>
            <FileX className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Report Not Found
          </h1>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            This report may have expired, been deleted, or the link is invalid.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
            <Link
              href="/downloads"
              className="btn"
              style={{
                background: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border)'
              }}
            >
              Get OnlyWorks
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} OnlyWorks
        </p>
      </footer>
    </div>
  )
}
