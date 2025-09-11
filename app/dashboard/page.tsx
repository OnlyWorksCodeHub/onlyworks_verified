'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ScreenRecorder } from '@/components/recorder/ScreenRecorder'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import { ProductivityChart } from '@/components/dashboard/ProductivityChart'
import { Play, TrendingUp, Clock, Award, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [stats, setStats] = useState({
    todayHours: 0,
    weekProductivity: 0,
    totalSessions: 0,
    authenticityScore: 100,
    currentStreak: 0
  })
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchStats()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch today's stats
    const today = new Date().toISOString().split('T')[0]
    const { data: todayStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    // Fetch week stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: weekSessions } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo)

    // Fetch total sessions
    const { count } = await supabase
      .from('workflow_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    setStats({
      todayHours: todayStats?.total_duration ? Math.round(todayStats.total_duration / 3600) : 0,
      weekProductivity: todayStats?.avg_productivity || 0,
      totalSessions: count || 0,
      authenticityScore: 100,
      currentStreak: calculateStreak(weekSessions || [])
    })
  }

  const calculateStreak = (sessions: any[]) => {
    if (!sessions.length) return 0
    const dates = sessions.map(s => new Date(s.created_at).toDateString())
    const uniqueDates = Array.from(new Set(dates))
    return uniqueDates.length
  }

  const startNewSession = async () => {
    const { data, error } = await supabase
      .from('workflow_sessions')
      .insert({
        user_id: user.id,
        name: `Work Session - ${new Date().toLocaleString()}`,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to start session')
    } else {
      setCurrentSession(data.id)
      toast.success('Session started! Your actions are being tracked.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your productivity and prove your work is real
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="card-clean p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayHours}h</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours Tracked</p>
              </div>

              <div className="card-clean p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-gray-500">This Week</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.weekProductivity}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Productivity</p>
              </div>

              <div className="card-clean p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-purple-500" />
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
              </div>

              <div className="card-clean p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <span className="text-xs text-gray-500">Trust</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.authenticityScore}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Authenticity</p>
              </div>

              <div className="card-clean p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Streak</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
              </div>
            </div>

            {/* Main content area */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Session control */}
                {!currentSession ? (
                  <div className="card-clean p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ready to start tracking?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Begin a new session to track your clicks, keystrokes, and productivity.
                    </p>
                    <button
                      onClick={startNewSession}
                      className="btn-clean btn-primary-clean flex items-center"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start New Session
                    </button>
                  </div>
                ) : (
                  <ScreenRecorder 
                    sessionId={currentSession} 
                    userId={user.id}
                    onSessionEnd={() => {
                      setCurrentSession(null)
                      fetchStats()
                    }}
                  />
                )}

                {/* Productivity Chart */}
                <ProductivityChart userId={user.id} />
              </div>

              {/* Recent Sessions */}
              <div>
                <RecentSessions userId={user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
