'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { TrendingUp, Clock, MousePointer, Keyboard, Calendar, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchAnalytics()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const fetchAnalytics = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch session analytics
    const { data: sessions } = await supabase
      .from('workflow_sessions')
      .select('*, session_summaries(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (sessions) {
      // Calculate analytics
      const totalSessions = sessions.length
      const completedSessions = sessions.filter(s => s.status === 'completed').length
      const totalHours = sessions.reduce((acc, s) => acc + (s.total_duration || 0), 0) / 3600
      const avgProductivity = sessions.reduce((acc, s) => {
        const score = s.session_summaries?.[0]?.avg_productivity_score || 0
        return acc + score
      }, 0) / (completedSessions || 1)

      setStats({
        totalSessions,
        completedSessions,
        totalHours: totalHours.toFixed(1),
        avgProductivity: Math.round(avgProductivity),
        weeklyTrend: calculateWeeklyTrend(sessions),
        topApplications: getTopApplications(sessions)
      })
    }
    
    setLoading(false)
  }

  const calculateWeeklyTrend = (sessions: any[]) => {
    // Group sessions by week and calculate trends
    const weeks: any = {}
    sessions.forEach(session => {
      const week = new Date(session.created_at).toISOString().slice(0, 10)
      if (!weeks[week]) weeks[week] = []
      weeks[week].push(session.session_summaries?.[0]?.avg_productivity_score || 0)
    })
    
    return Object.entries(weeks).map(([date, scores]: [string, any]) => ({
      date,
      productivity: Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
    })).slice(-7)
  }

  const getTopApplications = (sessions: any[]) => {
    // This would be populated from actual analysis data
    return [
      { name: 'VS Code', hours: 45, percentage: 35 },
      { name: 'Chrome', hours: 30, percentage: 25 },
      { name: 'Figma', hours: 20, percentage: 15 },
      { name: 'Slack', hours: 15, percentage: 10 },
      { name: 'Other', hours: 20, percentage: 15 }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E5CE6]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-gray-400 mt-1">Track your productivity trends and patterns</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-[#5E5CE6]" />
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalHours}h</p>
                <p className="text-sm text-gray-400">Hours Tracked</p>
              </div>

              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-gray-500">Average</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.avgProductivity}%</p>
                <p className="text-sm text-gray-400">Productivity Score</p>
              </div>

              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-blue-500" />
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.completedSessions}</p>
                <p className="text-sm text-gray-400">Sessions</p>
              </div>

              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-purple-500" />
                  <span className="text-xs text-gray-500">Current</span>
                </div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>

            {/* Weekly Trend Chart */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Weekly Productivity Trend</h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {stats.weeklyTrend?.length > 0 ? (
                  stats.weeklyTrend.map((day: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-800 rounded-t-lg relative">
                        <div 
                          className="bg-[#5E5CE6] rounded-t-lg transition-all"
                          style={{ height: `${day.productivity * 2}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No data available yet
                  </div>
                )}
              </div>
            </div>

            {/* Top Applications */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Application Usage</h2>
              <div className="space-y-4">
                {stats.topApplications?.map((app: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-[#5E5CE6]">
                          {app.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.hours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-[#5E5CE6] h-2 rounded-full"
                          style={{ width: `${app.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">
                        {app.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
