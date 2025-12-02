'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Calendar, Clock, Activity, TrendingUp, FileText } from 'lucide-react'

import { getCurrentUser, getUserSessions } from '@/lib/supabase'

interface WorkSession {
  id: string
  session_name: string
  goal_description: string
  started_at: string
  ended_at: string | null
  status: 'active' | 'completed' | 'paused'
  productivity_score: number | null
  focus_score: number | null
  created_at: string
}

export default function SessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<WorkSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { user, error: userError } = await getCurrentUser()
        if (userError || !user) {
          router.push('/auth/login')
          return
        }

        const { sessions: sessionData, error: sessionsError } = await getUserSessions(user.id, 100)

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
          setError('Failed to load sessions')
        } else {
          setSessions(sessionData || [])
        }
      } catch (err) {
        console.error('Exception fetching sessions:', err)
        setError('Failed to load sessions')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [router])

  const formatDuration = (startedAt: string, endedAt: string | null) => {
    const start = new Date(startedAt)
    const end = endedAt ? new Date(endedAt) : new Date()
    const durationMs = end.getTime() - start.getTime()
    const durationMinutes = Math.round(durationMs / (1000 * 60))

    if (durationMinutes < 60) {
      return `${durationMinutes}m`
    }

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'paused':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your work sessions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Sessions</h1>
              <p className="text-gray-600">
                View all your work sessions and their comprehensive AI-generated reports
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-6">
              Start your first work session using the OnlyWorks desktop app to see it here.
            </p>
            <Link
              href="/downloads"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Desktop App
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {session.session_name}
                      </h3>
                      <span className={getStatusBadge(session.status)}>
                        {session.status}
                      </span>
                    </div>
                  </div>

                  {session.goal_description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {session.goal_description}
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(session.started_at)}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatDuration(session.started_at, session.ended_at)}
                    </div>

                    {session.productivity_score !== null && (
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600 mr-2">Productivity:</span>
                        <span className={`font-medium ${getScoreColor(session.productivity_score)}`}>
                          {Math.round((session.productivity_score || 0) * 100)}%
                        </span>
                      </div>
                    )}

                    {session.focus_score !== null && (
                      <div className="flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600 mr-2">Focus:</span>
                        <span className={`font-medium ${getScoreColor(session.focus_score)}`}>
                          {Math.round((session.focus_score || 0) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href={`/sessions/${session.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}