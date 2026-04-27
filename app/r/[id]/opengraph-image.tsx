import { ImageResponse } from 'next/og'
import { BACKEND_URL } from '@/lib/config'

export const runtime = 'edge'
export const alt = 'Work report on OnlyWorks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getReport(token: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reports/shared/${token}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function Image({ params }: { params: { id: string } }) {
  const report = await getReport(params.id)
  const title = (report && (report.report_name || report.title)) || 'Work Report'
  const summary = (report && report.executive_summary) ? String(report.executive_summary).slice(0, 220) : ''
  const dateRange = report && report.date_from && report.date_to
    ? `${formatDate(report.date_from)} – ${formatDate(report.date_to)}`
    : ''
  const duration = (report && report.total_duration_seconds) ? formatDuration(report.total_duration_seconds) : ''
  const sessions = (report && report.total_sessions) || 0
  const productivity = (report && report.productivity_metrics && report.productivity_metrics.productivity_score) || 0
  const accomplishmentsCount = report && Array.isArray(report.accomplishments) ? report.accomplishments.length : 0

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafaf9',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#080503',
              color: '#fafaf9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            ◆
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#080503', lineHeight: 1 }}>OnlyWorks</div>
            <div style={{ fontSize: 14, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 4 }}>
              Verified Work Report
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#080503',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            maxWidth: '92%',
          }}
        >
          {title}
        </div>

        {/* Date range + duration meta */}
        {(dateRange || duration) && (
          <div style={{ display: 'flex', gap: 24, fontSize: 22, color: '#a3a19b', marginBottom: 32 }}>
            {dateRange && <div style={{ display: 'flex' }}>{dateRange}</div>}
            {dateRange && duration && <div style={{ display: 'flex' }}>·</div>}
            {duration && <div style={{ display: 'flex' }}>{duration} logged</div>}
          </div>
        )}

        {/* Executive summary preview */}
        {summary && (
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#44423d',
              lineHeight: 1.45,
              marginBottom: 'auto',
              maxWidth: '88%',
            }}
          >
            {summary}{summary.length === 220 ? '…' : ''}
          </div>
        )}

        {/* Stats row */}
        {(productivity > 0 || sessions > 0 || accomplishmentsCount > 0) && (
          <div
            style={{
              display: 'flex',
              gap: 64,
              paddingTop: 32,
              borderTop: '2px solid #dad7d0',
              marginTop: 32,
            }}
          >
            {productivity > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{productivity}%</div>
                <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  Productivity
                </div>
              </div>
            )}
            {sessions > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{sessions}</div>
                <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  {sessions === 1 ? 'Session' : 'Sessions'}
                </div>
              </div>
            )}
            {accomplishmentsCount > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{accomplishmentsCount}</div>
                <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  Accomplishments
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
