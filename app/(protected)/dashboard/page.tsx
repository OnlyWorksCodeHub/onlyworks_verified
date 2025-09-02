'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ScreenRecorder } from '@/components/recorder/ScreenRecorder'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentScreenshots } from '@/components/dashboard/RecentScreenshots'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Clock, TrendingUp, Camera, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalHours: 0,
    avgProductivity: 0,
    totalScreenshots: 0,
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
      
      // Ensure profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || '',
          })
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
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
      // Get screenshot count
      const { count: screenshotCount } = await supabase
        .from('screenshots')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Get sessions count for streak
      const { count: sessionCount } = await supabase
        .from('workflow_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      setStats({
        totalHours: Math.round((screenshotCount || 0) / 120), // Rough estimate
        avgProductivity: 75,
        totalScreenshots: screenshotCount || 0,
        currentStreak: sessionCount || 0,
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
      
      if (error) {
        console.error('Session creation error:', error)
        toast.error(`Failed to start session: ${error.message}`)
        return
      }
      
      if (data) {
        setCurrentSession(data.id)
        toast.success('Session started! You can now begin recording.')
        loadStats(user.id) // Refresh stats
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
    loadStats(user.id) // Refresh stats
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}!
            </h1>
            <p className="text-gray-600 mb-8">Track your productivity and improve your focus.</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Hours"
                value={`${stats.totalHours}h`}
                icon={Clock}
                trend="+12%"
                color="bg-blue-500"
              />
              <StatsCard
                title="Avg Productivity"
                value={`${stats.avgProductivity}%`}
                icon={TrendingUp}
                trend="+5%"
                color="bg-green-500"
              />
              <StatsCard
                title="Screenshots"
                value={stats.totalScreenshots.toString()}
                icon={Camera}
                trend=""
                color="bg-purple-500"
              />
              <StatsCard
                title="Sessions"
                value={`${stats.currentStreak}`}
                icon={Award}
                trend=""
                color="bg-yellow-500"
              />
            </div>
            
            {/* Session Control */}
            {!currentSession ? (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ready to track your productivity?
                </h2>
                <p className="text-gray-600 mb-4">
                  Start a new session to begin capturing screenshots and analyzing your workflow.
                </p>
                <button
                  onClick={startNewSession}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Start New Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-green-800">
                    Session active
                  </p>
                  <button
                    onClick={endSession}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    End Session
                  </button>
                </div>
                
                <ScreenRecorder    
                  sessionId={currentSession}
                  userId={user.id}
                />
              </div>
            )}
            
            {/* Screenshots Grid */}
            <div className="mt-8">
              <RecentScreenshots userId={user.id} sessionId={currentSession} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
