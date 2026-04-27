import { ImageResponse } from 'next/og'
import { BACKEND_URL } from '@/lib/config'

export const runtime = 'edge'
export const alt = 'Verified profile on OnlyWorks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getProfile(owId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

async function getStats(owId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}/ow-profile`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success && data.data && data.data.ow_profile && data.data.ow_profile.summary
      ? data.data.ow_profile.summary
      : null
  } catch {
    return null
  }
}

export default async function Image({ params }: { params: { owId: string } }) {
  const [profile, summary] = await Promise.all([
    getProfile(params.owId),
    getStats(params.owId),
  ])

  const name = (profile && (profile.full_name || profile.name)) || 'Professional'
  const owId = (profile && profile.ow_id) || ''
  const subtitle = [profile && profile.job_title, profile && profile.company].filter(Boolean).join(' at ')
  const isVerified = profile && profile.badge === 'verified'
  const skills = (summary && summary.total_skills) || 0
  const reports = (summary && summary.total_reports) || 0

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
              {isVerified ? 'Verified Profile' : 'Public Profile'}
            </div>
          </div>
          {/* Verified badge */}
          {isVerified && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: '#dcfce7',
                color: '#166534',
                fontSize: 18,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              ✓ Verified
            </div>
          )}
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
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: '#a3a19b',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
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
        {(skills > 0 || reports > 0) && (
          <div
            style={{
              display: 'flex',
              gap: 64,
              paddingTop: 32,
              borderTop: '2px solid #dad7d0',
              marginTop: 32,
            }}
          >
            {skills > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 72, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{skills}</div>
                <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  Verified Skills
                </div>
              </div>
            )}
            {reports > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 72, fontWeight: 700, color: '#8b5cf6', lineHeight: 1 }}>{reports}</div>
                <div style={{ fontSize: 18, color: '#a3a19b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  {reports === 1 ? 'Report' : 'Reports'}
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
