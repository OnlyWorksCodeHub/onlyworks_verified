'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, TrendingUp, Brain, CheckCircle, Play } from 'lucide-react'
import Link from 'next/link'

interface RecentActivityProps {
  userId: string
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (userId) {
      loadRecentActivity()
    }
  }, [userId])

  const loadRecentActivity = async () => {
    try {
      const { data: allSessions } = await supabase
        .from('workflow_sessions')
        .select(`
          *,
          analyses!analyses_session_id_fkey(
            productivity_score,
            activity_type,
            estimated_task,
            work_category
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (allSessions && allSessions.length > 0) {
        const sessionsWithSummary = allSessions.map(session => {
          const analyses = session.analyses || []
          
          // Get unique tasks/activities
          const tasks = [...new Set(analyses
            .map((a: any) => a.estimated_task)
            .filter((t: string) => t && t.length > 0)
          )]
          
          const activities = [...new Set(analyses
            .map((a: any) => a.activity_type)
            .filter((t: string) => t && t.length > 0)
          )]
          
          const avgProductivity = analyses.length > 0
            ? Math.round(analyses.reduce((acc: number, a: any) => acc + (a.productivity_score || 0), 0) / analyses.length)
            : 0

          // Generate summary
          let summary = ''
          if (tasks.length > 0) {
            summary = `Worked on: ${tasks.slice(0, 2).join(', ')}`
          } else if (activities.length > 0) {
            summary = `Activities: ${activities.slice(0, 3).join(', ')}`
          } else if (session.comments) {
            summary = session.comments
          } else {
            summary = 'Work session recorded'
          }

          // Calculate duration
          const duration = Math.round(analyses.length * 0.5) // 30 seconds per capture

          return {
            ...session,
            summary,
            avgProductivity,
            duration,
            analysisCount: analyses.length
          }
        })

        setSessions(sessionsWithSummary)
      }
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (date: string) => {
    const d = new Date(date)
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-light mb-4">Recent Sessions</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-light tracking-tight">Recent Sessions</h2>
        <Link href="/sessions" className="text-sm text-primary hover:text-primary-dark">
          View all
        </Link>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No sessions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start a session to track your work</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const { date, time } = formatDateTime(session.created_at)
            return (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-3 hover:border-primary dark:hover:border-primary-light transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {session.status === 'active' ? (
                          <Play className="w-3 h-3 text-green-500" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {session.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {session.summary}
                      </p>
                    </div>
                    {session.avgProductivity > 0 && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-sm ml-2">
                        {session.avgProductivity}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{date} at {time}</span>
                      {session.duration > 0 && (
                        <>
                          <span>•</span>
                          <span>{session.duration}m</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
