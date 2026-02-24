import type { StatsData } from '@/lib/types/profile'

interface ProfileStatsProps {
  stats: StatsData
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    {
      value: stats.total_verified_hours != null ? `${Math.round(stats.total_verified_hours)}h` : '--',
      label: 'Verified Hours',
    },
    {
      value: stats.total_sessions != null ? stats.total_sessions.toLocaleString() : '--',
      label: 'Sessions',
    },
    {
      value: stats.avg_productivity_score != null ? `${Math.round(stats.avg_productivity_score)}%` : '--',
      label: 'Avg Productivity',
    },
    {
      value: stats.avg_focus_score != null ? `${Math.round(stats.avg_focus_score)}%` : '--',
      label: 'Avg Focus',
    },
  ]

  return (
    <div className="profile-stats-grid">
      {items.map((item) => (
        <div key={item.label} className="profile-stat-card">
          <div className="profile-stat-value">{item.value}</div>
          <div className="profile-stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
