'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Trophy, Star, Target, Zap, Clock, TrendingUp, Award, Lock } from 'lucide-react'

export default function AchievementsPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [achievements, setAchievements] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadAchievements()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const loadAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch user stats for achievements
    const { data: sessions } = await supabase
      .from('workflow_sessions')
      .select('*, session_summaries(*)')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    const totalSessions = sessions?.length || 0
    const totalHours = (sessions?.reduce((acc, s) => acc + (s.total_duration || 0), 0) || 0) / 3600
    const avgProductivity = sessions?.reduce((acc, s) => {
      return acc + (s.session_summaries?.[0]?.avg_productivity_score || 0)
    }, 0) / (totalSessions || 1)

    setStats({ totalSessions, totalHours, avgProductivity })

    // Define achievements
    const allAchievements = [
      {
        id: 1,
        name: 'First Steps',
        description: 'Complete your first work session',
        icon: Star,
        color: 'text-yellow-500',
        unlocked: totalSessions >= 1,
        progress: Math.min(100, totalSessions * 100)
      },
      {
        id: 2,
        name: 'Dedicated Worker',
        description: 'Complete 10 work sessions',
        icon: Trophy,
        color: 'text-purple-500',
        unlocked: totalSessions >= 10,
        progress: Math.min(100, (totalSessions / 10) * 100)
      },
      {
        id: 3,
        name: 'Time Master',
        description: 'Track 50 hours of work',
        icon: Clock,
        color: 'text-blue-500',
        unlocked: totalHours >= 50,
        progress: Math.min(100, (totalHours / 50) * 100)
      },
      {
        id: 4,
        name: 'High Performer',
        description: 'Maintain 80%+ average productivity',
        icon: TrendingUp,
        color: 'text-green-500',
        unlocked: avgProductivity >= 80,
        progress: Math.min(100, avgProductivity)
      },
      {
        id: 5,
        name: 'Consistency King',
        description: 'Work 7 days in a row',
        icon: Zap,
        color: 'text-orange-500',
        unlocked: false, // Would need streak calculation
        progress: 0
      },
      {
        id: 6,
        name: 'Elite Producer',
        description: 'Complete 100 work sessions',
        icon: Award,
        color: 'text-red-500',
        unlocked: totalSessions >= 100,
        progress: Math.min(100, (totalSessions / 100) * 100)
      }
    ]

    setAchievements(allAchievements)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Achievements</h1>
              <p className="text-gray-400 mt-1">Track your productivity milestones</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-white">{Math.round(stats.totalHours || 0)}</p>
                <p className="text-gray-400">Hours Tracked</p>
              </div>
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-white">{stats.totalSessions || 0}</p>
                <p className="text-gray-400">Sessions Completed</p>
              </div>
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-white">{Math.round(stats.avgProductivity || 0)}%</p>
                <p className="text-gray-400">Avg Productivity</p>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={achievement.id}
                    className={`bg-[#1A1A1A] border ${
                      achievement.unlocked ? 'border-[#5E5CE6]' : 'border-gray-800'
                    } rounded-lg p-6 relative overflow-hidden`}
                  >
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`w-10 h-10 ${achievement.color}`} />
                      {achievement.unlocked && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                          Unlocked
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {achievement.description}
                    </p>
                    
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-[#5E5CE6] h-2 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {achievement.progress}% Complete
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
