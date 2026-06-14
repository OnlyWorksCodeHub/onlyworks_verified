import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import type { ReportData } from '@/lib/types/profile'

interface PublicReportsListProps {
  reports: ReportData[]
}

export default function PublicReportsList({ reports }: PublicReportsListProps) {
  if (!reports || reports.length === 0) return null

  return (
    <div className="profile-card" style={{ padding: '1.5rem' }}>
      <h3 className="font-display text-xl tracking-tight" style={{
        color: 'var(--text)',
        marginBottom: '1rem',
      }}>
        Public Reports
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/r/${report.share_token}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0',
              border: '1px solid var(--border)',
              transition: 'border-color 0.15s, background 0.15s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.background = 'var(--accent-light)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <FileText style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {report.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(report.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <ArrowRight style={{ width: '16px', height: '16px', color: 'var(--text-muted)', flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
