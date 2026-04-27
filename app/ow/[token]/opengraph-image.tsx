import { ImageResponse } from 'next/og'
import { BACKEND_URL } from '@/lib/config'
import { displayOwId } from '@/lib/skills'

export const runtime = 'edge'
export const alt = 'OW Profile on OnlyWorks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getProfile(token: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/ow-profile/shared/${token}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: { token: string } }) {
  const profile = await getProfile(params.token)
  const pi = (profile && profile.profile_info) || {}
  const owp = profile && profile.ow_profile
  const name = pi.full_name || 'Professional'
  const owId = pi.ow_id ? displayOwId(pi.ow_id) : ''
  const subtitle = [pi.job_title, pi.company].filter(Boolean).join(' at ')
  const skills = (owp && owp.summary && owp.summary.total_skills) || 0
  const reports = (owp && owp.summary && owp.summary.total_reports) || 0
  const advanced = (owp && owp.summary && owp.summary.top_proficiency_count) || 0

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
          position: 'relative',
        }}
      >
        {/* Header: brand + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
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
              Verified Skill Portfolio
            </div>
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            color: '#080503',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 16,
            maxWidth: '90%',
          }}
        >
          {name}
        </div>

        {/* OW ID */}
        {owId && (
          <div style={{ display: 'flex', fontSize: 22, color: '#a3a19b', fontFamily: 'monospace', letterSpacing: '0.08em', marginBottom: 16 }}>
            {owId}
          </div>
        )}

        {/* Job title @ company */}
        {subtitle && (
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: '#8b5cf6',
              fontWeight: 500,
              marginBottom: 'auto',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 64,
            paddingTop: 32,
            borderTop: '2px solid #dad7d0',
            marginTop: 32,
          }}
        >
          <Stat value={skills} label="Verified Skills" />
          {advanced > 0 && <Stat value={advanced} label="Advanced" />}
          <Stat value={reports} label={reports === 1 ? 'Report Analyzed' : 'Reports Analyzed'} />
        </div>
      </div>
    ),
    { ...size }
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 72, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
        {label}
      </div>
    </div>
  )
}
