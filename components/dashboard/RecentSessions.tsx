'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentSessionsProps {
  userId: string
}

interface Session {
  id: string
  name: string
  status: string
  created_at: string
  total_duration?: number
  metadata?: {
    productivity_score?: number
    suspicious_activity?: boolean
  }
}

export function RecentSessions({ userId }: RecentSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSessions()
  }, [userId])

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setSessions(data)
    }
    setLoading(false)
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'In progress'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusIcon = (status: string, metadata?: any) => {
    if (metadata?.suspicious_activity) {
      return <AlertCircle className="w-4 h-4 text-amber-500" />
    }
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <Clock className="w-4 h-4 text-blue-500" />
  }

  if (loading) {
    return (
      <div className="card-clean p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-clean p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h3>
        <Link href="/sessions" className="text-sm text-primary hover:text-primary-dark">
          View all
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions yet</p>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-3">
                {getStatusIcon(session.status, session.metadata)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDuration(session.total_duration)}
                </span>
                <Link
                  href={`/sessions/view/${session.id}`}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
