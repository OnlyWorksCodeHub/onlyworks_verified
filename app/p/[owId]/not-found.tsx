import Link from 'next/link'
import { UserX } from 'lucide-react'

export default function ProfileNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/images/logo.png" alt="OnlyWorks" style={{ height: '32px', width: '32px', filter: 'grayscale(100%) brightness(0)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-alt)',
            marginBottom: '1.5rem',
          }}>
            <UserX style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '0.75rem',
          }}>
            Profile Not Found
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
          }}>
            This profile doesn&apos;t exist or the OW ID is incorrect.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'center',
          }}>
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
            <Link href="/downloads" className="btn btn-secondary">
              Get OnlyWorks
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 0',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}>
          &copy; {new Date().getFullYear()} OnlyWorks
        </p>
      </footer>
    </div>
  )
}
