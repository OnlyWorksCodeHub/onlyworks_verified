'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { ScreenRecorder } from '@/components/recorder/ScreenRecorder'
import { TrendingUp, Clock, Target, Activity, Play, Square, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    todayProductivity: 0,
    weekProductivity: 0,
    totalHours: 0,
    activeSessions: 0
  })
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      await loadStats(user.id)
      await checkActiveSession(user.id)
    } catch (error) {
      console.error('Error loading user:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (userId: string) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { data: todayData } = await supabase
        .from('analyses')
        .select('productivity_score')
        .eq('user_id', userId)
        .gte('created_at', today.toISOString())
      
      const { data: weekData } = await supabase
        .from('analyses')
        .select('productivity_score')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
      
      const { count: sessionCount } = await supabase
        .from('workflow_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active')
      
      const todayAvg = todayData && todayData.length > 0 
        ? Math.round(todayData.reduce((acc, d) => acc + d.productivity_score, 0) / todayData.length)
        : 0
        
      const weekAvg = weekData && weekData.length > 0
        ? Math.round(weekData.reduce((acc, d) => acc + d.productivity_score, 0) / weekData.length)
        : 0
      
      setStats({
        todayProductivity: todayAvg,
        weekProductivity: weekAvg,
        totalHours: Math.round((weekData?.length || 0) * 0.5 / 60 * 10) / 10,
        activeSessions: sessionCount || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const checkActiveSession = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('workflow_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()
      
      if (data) {
        setCurrentSession(data.id)
      }
    } catch (error) {
      console.error('Error checking active session:', error)
    }
  }

  const startSession = async () => {
    if (isStarting || !user) return
    
    setIsStarting(true)
    
    try {
      await supabase
        .from('workflow_sessions')
        .update({ 
          status: 'completed', 
          ended_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('status', 'active')
      
      const { data, error } = await supabase
        .from('workflow_sessions')
        .insert({
          user_id: user.id,
          name: `Session ${new Date().toLocaleString()}`,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      
      setCurrentSession(data.id)
      toast.success('Session started! Now start recording to capture screenshots.')
      await loadStats(user.id)
    } catch (error) {
      console.error('Error starting session:', error)
      toast.error('Failed to start session. Please try again.')
    } finally {
      setIsStarting(false)
    }
  }

  const stopSession = async () => {
    if (!currentSession || isStopping) return
    
    setIsStopping(true)
    
    try {
      const { error } = await supabase
        .from('workflow_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', currentSession)
      
      if (error) throw error
      
      setCurrentSession(null)
      toast.success('Session ended successfully')
      await loadStats(user.id)
    } catch (error) {
      console.error('Error stopping session:', error)
      toast.error('Failed to stop session')
    } finally {
      setIsStopping(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Not authenticated</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter">
                Dashboard
              </h1>
              
              {!currentSession ? (
                <button
                  onClick={startSession}
                  disabled={isStarting}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isStarting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Session
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={stopSession}
                  disabled={isStopping}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isStopping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Session
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Today's Productivity"
                value={`${stats.todayProductivity}%`}
                icon={TrendingUp}
                color="primary"
              />
              
              <StatsCard
                title="Week Average"
                value={`${stats.weekProductivity}%`}
                icon={Activity}
                color="blue"
              />
              
              <StatsCard
                title="Hours Tracked"
                value={`${stats.totalHours}h`}
                icon={Clock}
                color="green"
              />
              
              <StatsCard
                title="Active Sessions"
                value={stats.activeSessions.toString()}
                icon={Target}
                color="purple"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {currentSession ? (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                        <p className="text-green-800 dark:text-green-300 font-medium">
                          Session Active - Ready to record
                        </p>
                      </div>
                    </div>
                    
                    <ScreenRecorder sessionId={currentSession} />
                  </>
                ) : (
                  <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-12 text-center">
                    <Activity className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-primary dark:text-primary-light mb-2">
                      No Active Session
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start a new session to begin tracking your productivity
                    </p>
                    <button
                      onClick={startSession}
                      disabled={isStarting}
                      className="btn-clean btn-primary-clean"
                    >
                      {isStarting ? 'Starting...' : 'Start Tracking'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <RecentActivity userId={user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
