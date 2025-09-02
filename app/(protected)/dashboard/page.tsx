'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ScreenRecorder } from '@/components/recorder/ScreenRecorder'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Clock, TrendingUp, Brain, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTime: '0h 0m',
    avgProductivity: 0,
    totalSessions: 0,
    currentStreak: 0,
  })
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || '',
        })
      }
      
      await loadStats(user.id)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (userId: string) => {
    try {
      const { data: screenshots } = await supabase
        .from('screenshots')
        .select('created_at, session_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      let totalMinutes = 0
      if (screenshots && screenshots.length > 0) {
        const sessionGroups: { [key: string]: any[] } = {}
        screenshots.forEach(s => {
          if (!sessionGroups[s.session_id]) {
            sessionGroups[s.session_id] = []
          }
          sessionGroups[s.session_id].push(s)
        })

        Object.values(sessionGroups).forEach(sessionScreenshots => {
          if (sessionScreenshots.length >= 2) {
            const times = sessionScreenshots.map(s => new Date(s.created_at).getTime())
            const duration = (Math.max(...times) - Math.min(...times)) / (1000 * 60)
            totalMinutes += duration
          } else {
            totalMinutes += 1
          }
        })
      }

      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.round(totalMinutes % 60)
      const totalTime = `${hours}h ${minutes}m`

      const { data: analyses } = await supabase
        .from('analyses')
        .select('productivity_score')
        .eq('user_id', userId)

      const avgProductivity = analyses && analyses.length > 0
        ? Math.round(analyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / analyses.length)
        : 0

      const { count: sessionCount } = await supabase
        .from('workflow_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const { data: sessions } = await supabase
        .from('workflow_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      let streak = 0
      if (sessions && sessions.length > 0) {
        const dates = sessions.map(s => new Date(s.created_at).toDateString())
        const uniqueDates = Array.from(new Set(dates))
        
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 24*60*60*1000).toDateString()
        
        if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
          streak = 1
          let checkDate = new Date()
          if (!uniqueDates.includes(today)) {
            checkDate.setDate(checkDate.getDate() - 1)
          }
          
          while (true) {
            checkDate.setDate(checkDate.getDate() - 1)
            if (!uniqueDates.includes(checkDate.toDateString())) break
            streak++
          }
        }
      }

      setStats({
        totalTime,
        avgProductivity,
        totalSessions: sessionCount || 0,
        currentStreak: streak,
      })
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  const startNewSession = async () => {
    if (!user) {
      toast.error('Please sign in first')
      return
    }

    try {
      const { data, error } = await supabase
        .from('workflow_sessions')
        .insert({
          user_id: user.id,
          name: `Session - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          status: 'active'
        })
        .select()
        .single()
      
      if (error) throw error
      
      if (data) {
        setCurrentSession(data.id)
        toast.success('Session started! You can now begin recording.')
        loadStats(user.id)
      }
    } catch (error: any) {
      console.error('Session error:', error)
      toast.error(`Error: ${error.message || 'Failed to start session'}`)
    }
  }

  const endSession = async () => {
    if (currentSession) {
      await supabase
        .from('workflow_sessions')
        .update({ status: 'completed' })
        .eq('id', currentSession)
    }
    setCurrentSession(null)
    toast.success('Session ended')
    loadStats(user.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Monitor your productivity patterns and improve your focus.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Time"
                value={stats.totalTime}
                icon={Clock}
                trend=""
                color="bg-blue-500"
              />
              <StatsCard
                title="Avg Productivity"
                value={stats.avgProductivity > 0 ? `${stats.avgProductivity}%` : 'N/A'}
                icon={TrendingUp}
                trend=""
                color="bg-green-500"
              />
              <StatsCard
                title="Sessions"
                value={stats.totalSessions.toString()}
                icon={Brain}
                trend=""
                color="bg-purple-600"
              />
              <StatsCard
                title="Current Streak"
                value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
                icon={Award}
                trend=""
                color="bg-yellow-500"
              />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {!currentSession ? (
                  <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                    <h2 className="text-lg font-semibold text-primary dark:text-primary-light mb-4 tracking-tight">
                      Ready to track your productivity?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start a new session to begin analyzing your workflow patterns.
                    </p>
                    <button
                      onClick={startNewSession}
                      className="btn-clean btn-primary-clean"
                    >
                      Start New Session
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-4 flex items-center justify-between">
                      <p className="text-green-800 dark:text-green-400 font-medium">Session active</p>
                      <button
                        onClick={endSession}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                      >
                        End Session
                      </button>
                    </div>
                    
                    <ScreenRecorder sessionId={currentSession} userId={user.id} />
                  </>
                )}
              </div>
              
              <div>
                <RecentActivity userId={user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
