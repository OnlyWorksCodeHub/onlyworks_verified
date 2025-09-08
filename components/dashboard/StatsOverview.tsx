'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsOverviewProps {
  userId: string
}

interface Stats {
  productivity: number
  productivityTrend: 'up' | 'down' | 'stable'
  focusTime: number
  focusTrend: 'up' | 'down' | 'stable'
  sessionsToday: number
  authenticityScore: number
}

export function StatsOverview({ userId }: StatsOverviewProps) {
  const [stats, setStats] = useState<Stats>({
    productivity: 0,
    productivityTrend: 'stable',
    focusTime: 0,
    focusTrend: 'stable',
    sessionsToday: 0,
    authenticityScore: 100
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get today's stats
    const { data: todayData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    // Get yesterday's stats for comparison
    const { data: yesterdayData } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', yesterday)
      .single()

    // Calculate trends
    const productivityTrend = calculateTrend(
      todayData?.avg_productivity || 0,
      yesterdayData?.avg_productivity || 0
    )
    
    const focusTrend = calculateTrend(
      todayData?.avg_focus || 0,
      yesterdayData?.avg_focus || 0
    )

    setStats({
      productivity: todayData?.avg_productivity || 0,
      productivityTrend,
      focusTime: todayData?.total_duration ? Math.round(todayData.total_duration / 60) : 0,
      focusTrend,
      sessionsToday: todayData?.total_sessions || 0,
      authenticityScore: 100
    })
    
    setLoading(false)
  }

  const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous + 5) return 'up'
    if (current < previous - 5) return 'down'
    return 'stable'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card-clean p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card-clean p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">Productivity</p>
          {getTrendIcon(stats.productivityTrend)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.productivity}%</p>
      </div>

      <div className="card-clean p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">Focus Time</p>
          {getTrendIcon(stats.focusTrend)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.focusTime} min</p>
      </div>

      <div className="card-clean p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions Today</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sessionsToday}</p>
      </div>

      <div className="card-clean p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trust Score</p>
        <p className="text-2xl font-bold text-green-600">{stats.authenticityScore}%</p>
      </div>
    </div>
  )
}
