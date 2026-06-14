'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-06-18T13:00:00Z') // 09:00 ET kickoff 18 Jun (UTC-4 in June)

function pad(n: number, w = 2) {
  return String(Math.max(0, Math.floor(n))).padStart(w, '0')
}

interface CountdownProps {
  target?: Date
  compact?: boolean
}

export function Countdown({ target = TARGET, compact = false }: CountdownProps) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) {
    // SSR / pre-hydrate placeholder
    if (compact) {
      return <span className="ow-serial" style={{ fontSize: '1rem', letterSpacing: '0.06em' }}>—— : —— : —— : ——</span>
    }
    return (
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
        {['D','H','M','S'].map(l => (
          <span key={l} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="ow-bignum" style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', color: 'var(--ow-ink-3)' }}>——</span>
            <span className="ow-label ow-label-mute">{l}</span>
          </span>
        ))}
      </div>
    )
  }

  const ms = target.getTime() - now.getTime()
  const past = ms <= 0
  const total = Math.abs(ms)
  const days  = total / 86_400_000
  const hours = (total / 3_600_000) % 24
  const mins  = (total / 60_000) % 60
  const secs  = (total / 1000) % 60

  if (compact) {
    return (
      <span className="ow-serial" style={{ fontSize: '1.125rem', letterSpacing: '0.04em' }}>
        {past ? '+' : '—'}{pad(days, 2)} : {pad(hours)} : {pad(mins)} : {pad(secs)}
      </span>
    )
  }

  const parts = [
    { v: days,  l: 'Days'    },
    { v: hours, l: 'Hours'   },
    { v: mins,  l: 'Minutes' },
    { v: secs,  l: 'Seconds' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      alignItems: 'flex-end',
      gap: 0,
    }}>
      {parts.map((p, i) => (
        <span
          key={p.l}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0 14px 0 0',
            borderRight: i < 3 ? '1px solid var(--ow-ink)' : 'none',
            paddingLeft: i > 0 ? 14 : 0,
          }}
        >
          <span
            className="ow-bignum"
            style={{
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
              color: past ? 'var(--ow-red)' : 'var(--ow-ink)',
              lineHeight: 0.9,
            }}
          >
            {pad(p.v, 2)}
          </span>
          <span className="ow-label ow-label-mute" style={{ marginTop: 6 }}>{p.l}</span>
        </span>
      ))}
    </div>
  )
}
