'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Lock } from 'lucide-react'
import Link from 'next/link'

interface AppBreakdownProps {
  apps: Array<{ name: string; hours: number }>
  limited?: boolean
}

export default function AppBreakdown({ apps, limited }: AppBreakdownProps) {
  if (!apps || apps.length === 0) return null

  const displayApps = limited ? apps.slice(0, 3) : apps
  const data = displayApps.map((app) => ({
    name: app.name,
    hours: Math.round(app.hours * 10) / 10,
  }))

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: '1rem',
      }}>
        Top Applications
      </h3>

      <div style={{ width: '100%', height: data.length * 44 + 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={(v) => `${v}h`} fontSize={12} stroke="var(--text-muted)" />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              fontSize={12}
              stroke="var(--text-muted)"
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${value}h`, 'Hours']}
              contentStyle={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
              }}
            />
            <Bar dataKey="hours" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {limited && apps.length > 3 && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background: 'var(--bg-alt)',
          textAlign: 'center',
        }}>
          <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)', margin: '0 auto 6px' }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            {apps.length - 3} more apps hidden.{' '}
            <Link href="/downloads" style={{ color: 'var(--accent)', fontWeight: 500 }}>
              Download the app to see all
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
