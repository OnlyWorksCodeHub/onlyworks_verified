'use client'

import { useEffect, useRef, useState } from 'react'

interface VerifiedCounterProps {
  base?: number
  label?: string
}

export function VerifiedCounter({
  base = 273,
  label = 'Registered weird builders',
}: VerifiedCounterProps) {
  const [n, setN] = useState(base)
  const [pulse, setPulse] = useState(false)
  const t = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    t.current = setInterval(() => {
      setN(prev => Math.max(base, prev + (Math.random() > 0.6 ? 1 : 0)))
      setPulse(true)
      setTimeout(() => setPulse(false), 240)
    }, 4400)
    return () => {
      if (t.current) clearInterval(t.current)
    }
  }, [base])

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
        {String(n).padStart(3, '0')}
      </span>
      <div>
        <div className="ow-label" style={{ marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--ow-ink-2)', lineHeight: 1.4 }}>
          Updated every few seconds. The plural noun &ldquo;weirds&rdquo; is grammatically suspect and we are doing it anyway.
        </div>
      </div>
    </div>
  )
}
