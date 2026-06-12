'use client'

import { useEffect, useRef, useState } from 'react'

interface VerifiedCounterProps {
  label?: string
}

const POLL_MS = 60_000

// Real count from /api/hackathon/stats (the hackathon_registrations table).
// Shows a placeholder until the first fetch lands; pulses only when the
// number actually changes.
export function VerifiedCounter({
  label = 'Registered weird builders',
}: VerifiedCounterProps) {
  const [n, setN] = useState<number | null>(null)
  const [pulse, setPulse] = useState(false)
  const prev = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/hackathon/stats')
        const data = await res.json().catch(() => ({}))
        if (cancelled || typeof data.registered !== 'number') return
        setN(data.registered)
        if (prev.current !== null && data.registered !== prev.current) {
          setPulse(true)
          setTimeout(() => setPulse(false), 240)
        }
        prev.current = data.registered
      } catch {
        // keep last known value
      }
    }

    load()
    const id = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <div
      aria-live="polite"
      style={{
        border: '2px solid var(--ow-ink)',
        boxShadow: '5px 5px 0 0 var(--ow-ink)',
        padding: '20px 22px',
        background: 'var(--ow-paper)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 18,
        alignItems: 'center',
      }}
    >
      <span
        className="ow-bignum"
        style={{
          fontSize: 'clamp(3rem, 6vw, 4.5rem)',
          color: pulse ? 'var(--ow-red)' : 'var(--ow-ink)',
          transition: 'color 0.18s, transform 0.18s',
          transform: pulse ? 'translateY(-2px)' : 'none',
        }}
      >
        {n === null ? '···' : String(n).padStart(3, '0')}
      </span>
      <div>
        <div className="ow-label" style={{ marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--ow-ink-2)', lineHeight: 1.4 }}>
          Counted live from the registration ledger. The plural noun &ldquo;weirds&rdquo; is grammatically suspect and we are doing it anyway.
        </div>
      </div>
    </div>
  )
}
