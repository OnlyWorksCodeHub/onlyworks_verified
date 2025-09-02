'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, TrendingUp, Clock, Target, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalHours: 0,
    avgProductivity: 0,
    totalSessions: 0,
    totalScreenshots: 0,
    mostProductiveHour: 'N/A',
    mostUsedApps: [] as string[],
    dailyData: [] as any[],
    weeklyTrend: [] as any[]
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    await loadAnalytics(user.id)
  }

  const loadAnalytics = async (userId: string) => {
    try {
      // Get all analyses for the past 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { data: analyses } = await supabase
        .from('analyses')
        .select('*, screenshots(created_at)')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      const { count: sessionCount } = await supabase
        .from('workflow_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const { count: screenshotCount } = await supabase
        .from('screenshots')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (analyses && analyses.length > 0) {
        // Calculate average productivity
        const avgProd = analyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / analyses.length

        // Find most productive hour
        const hourCounts: { [key: number]: { total: number, count: number } } = {}
        analyses.forEach(a => {
          if (a.screenshots?.created_at) {
            const hour = new Date(a.screenshots.created_at).getHours()
            if (!hourCounts[hour]) hourCounts[hour] = { total: 0, count: 0 }
            hourCounts[hour].total += a.productivity_score || 0
            hourCounts[hour].count++
          }
        })

        let mostProductiveHour = 'N/A'
        let maxAvg = 0
        Object.entries(hourCounts).forEach(([hour, data]) => {
          const avg = data.total / data.count
          if (avg > maxAvg) {
            maxAvg = avg
            const h = parseInt(hour)
            mostProductiveHour = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
          }
        })

        // Extract most used applications
        const appCounts: { [key: string]: number } = {}
        analyses.forEach(a => {
          if (a.applications_detected) {
            a.applications_detected.forEach((app: string) => {
              appCounts[app] = (appCounts[app] || 0) + 1
            })
          }
        })
        const mostUsedApps = Object.entries(appCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([app]) => app)

        // Create daily data for the chart
        const dailyGroups: { [key: string]: { scores: number[], count: number } } = {}
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateKey = date.toLocaleDateString()
          dailyGroups[dateKey] = { scores: [], count: 0 }
        }

        analyses.forEach(a => {
          if (a.created_at) {
            const dateKey = new Date(a.created_at).toLocaleDateString()
            if (dailyGroups[dateKey]) {
              dailyGroups[dateKey].scores.push(a.productivity_score || 0)
              dailyGroups[dateKey].count++
            }
          }
        })

        const dailyData = Object.entries(dailyGroups).map(([date, data]) => ({
          date,
          productivity: data.scores.length > 0 
            ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
            : 0,
          screenshots: data.count
        }))

        // Create weekly trend (hourly averages)
        const weeklyTrend: any[] = []
        for (let hour = 0; hour < 24; hour++) {
          if (hourCounts[hour]) {
            weeklyTrend.push({
              hour: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
              productivity: Math.round(hourCounts[hour].total / hourCounts[hour].count)
            })
          } else {
            weeklyTrend.push({
              hour: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
              productivity: 0
            })
          }
        }

        setStats({
          totalHours: Math.round((screenshotCount || 0) * 30 / 3600),
          avgProductivity: Math.round(avgProd),
          totalSessions: sessionCount || 0,
          totalScreenshots: screenshotCount || 0,
          mostProductiveHour,
          mostUsedApps,
          dailyData,
          weeklyTrend
        })
      } else {
        // No data case
        const emptyDailyData = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          emptyDailyData.push({
            date: date.toLocaleDateString(),
            productivity: 0,
            screenshots: 0
          })
        }

        setStats({
          ...stats,
          totalSessions: sessionCount || 0,
          totalScreenshots: screenshotCount || 0,
          dailyData: emptyDailyData
        })
      }
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const maxProductivity = Math.max(...stats.dailyData.map(d => d.productivity), 1)
  const maxHourlyProductivity = Math.max(...stats.weeklyTrend.map(d => d.productivity), 1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter mb-8">
              Analytics & Insights
            </h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalHours}h</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours Tracked</p>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgProductivity}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Productivity</p>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.mostProductiveHour}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Peak Productivity</p>
              </div>
            </div>
            
            {/* Daily Productivity Chart */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Productivity Trend</h2>
              <div className="h-64">
                <div className="flex items-end justify-between h-full space-x-2">
                  {stats.dailyData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t flex-1 flex items-end relative group">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-500 relative"
                          style={{ height: `${maxProductivity > 0 ? (item.productivity / maxProductivity) * 100 : 0}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.productivity}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                        <div>{new Date(item.date).toLocaleDateString('en', { weekday: 'short' })}</div>
                        <div className="text-[10px]">{new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hourly Pattern Chart */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Hourly Productivity Pattern</h2>
              <div className="h-48 overflow-x-auto">
                <div className="flex items-end space-x-1 h-full min-w-[600px]">
                  {stats.weeklyTrend.slice(6, 22).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full">
                      <div className="w-8 bg-gray-100 dark:bg-gray-800 rounded-t flex-1 flex items-end relative group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
                          style={{ height: `${maxHourlyProductivity > 0 ? (item.productivity / maxHourlyProductivity) * 100 : 0}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white px-1 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.productivity}%
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                        {item.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Most Used Applications</h3>
                {stats.mostUsedApps.length > 0 ? (
                  <div className="space-y-3">
                    {stats.mostUsedApps.map((app, i) => (
                      <div key={app} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">{app}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">#{i + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No application data yet</p>
                )}
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Productivity Insights</h3>
                <div className="space-y-3 text-sm">
                  {stats.avgProductivity >= 80 && (
                    <p className="text-green-700 dark:text-green-400">🎯 Excellent productivity! You're in the top performer range.</p>
                  )}
                  {stats.avgProductivity >= 60 && stats.avgProductivity < 80 && (
                    <p className="text-yellow-700 dark:text-yellow-400">📈 Good productivity levels. Room for optimization exists.</p>
                  )}
                  {stats.avgProductivity < 60 && stats.avgProductivity > 0 && (
                    <p className="text-red-700 dark:text-red-400">⚠️ Productivity could be improved. Consider minimizing distractions.</p>
                  )}
                  {stats.mostProductiveHour !== 'N/A' && (
                    <p className="text-blue-700 dark:text-blue-400">⏰ You're most productive at {stats.mostProductiveHour}. Schedule important work then.</p>
                  )}
                  {stats.totalSessions > 5 && (
                    <p className="text-purple-700 dark:text-purple-400">🔥 Great consistency with {stats.totalSessions} sessions tracked!</p>
                  )}
                  {stats.totalSessions === 0 && (
                    <p className="text-gray-600 dark:text-gray-400">Start tracking your work sessions to see insights here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
