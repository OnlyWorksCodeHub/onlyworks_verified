'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, TrendingUp } from 'lucide-react'

interface RecentSessionsProps {
  userId?: string
}

export function RecentSessions({ userId }: RecentSessionsProps) {
  const [sessions, setSessions] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (userId) {
      loadSessions()
    }
  }, [userId])

  const loadSessions = async () => {
    const { data } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setSessions(data)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-medium text-gray-900">{session.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {session.total_screenshots || 0}
              </div>
              {session.average_productivity && (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {Math.round(session.average_productivity)}%
                </div>
              )}
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && (
          <p className="text-center text-gray-500 py-4">No sessions yet</p>
        )}
      </div>
    </div>
  )
}