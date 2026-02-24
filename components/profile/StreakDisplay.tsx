import { Flame } from 'lucide-react'

interface StreakDisplayProps {
  current: number
  longest: number
}

export default function StreakDisplay({ current, longest }: StreakDisplayProps) {
  return (
    <div className="card" style={{
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        background: current > 0 ? '#fff7ed' : 'var(--bg-alt)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Flame style={{
          width: '24px',
          height: '24px',
          color: current > 0 ? '#f97316' : 'var(--text-muted)',
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.2,
        }}>
          {current} day{current !== 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Current streak
        </div>
      </div>
      <div style={{
        textAlign: 'right',
        paddingLeft: '1rem',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          lineHeight: 1.2,
        }}>
          {longest}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Longest
        </div>
      </div>
    </div>
  )
}
