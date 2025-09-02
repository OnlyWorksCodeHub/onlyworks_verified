'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, TrendingUp, Brain, Target, Calendar } from 'lucide-react'

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
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (allSessions && allSessions.length > 0) {
        const sessionsWithData = await Promise.all(
          allSessions.map(async (session) => {
            const { data: screenshots } = await supabase
              .from('screenshots')
              .select('id')
              .eq('session_id', session.id)

            const { data: analyses } = await supabase
              .from('analyses')
              .select('productivity_score, activity_type, raw_analysis')
              .eq('user_id', userId)
              .limit(10)

            const avgProductivity = analyses && analyses.length > 0
              ? Math.round(analyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / analyses.length)
              : 0

            return {
              ...session,
              screenshots_count: screenshots?.length || 0,
              avg_productivity: avgProductivity,
              analyses: analyses || []
            }
          })
        )

        setSessions(sessionsWithData)
      }
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-light mb-4">Recent Activity</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
      <h2 className="text-lg font-semibold text-primary dark:text-primary-light tracking-tight mb-4">Recent Activity</h2>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start a session and record to see insights</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-sm p-3 hover:border-primary dark:hover:border-primary-light transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{session.name}</p>
                {session.avg_productivity > 0 && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-sm">
                    {session.avg_productivity}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {session.screenshots_count} screenshots • {new Date(session.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
