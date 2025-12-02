'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Activity, TrendingUp, FileText, Download, Share2, AlertCircle } from 'lucide-react'

import { getCurrentUser, getSession, getSessionReport } from '@/lib/supabase'

interface WorkSession {
  id: string
  session_name: string
  goal_description: string
  started_at: string
  ended_at: string | null
  status: string
  productivity_score: number | null
  focus_score: number | null
}

interface SessionReport {
  id: string
  session_id: string
  report_date: string
  title: string
  comprehensive_report: any
  executive_summary: string
  productivity_score: number | null
  focus_score: number | null
  session_duration_minutes: number | null
  screenshot_count: number
  created_at: string
  updated_at: string
}

export default function SessionReportPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  const [session, setSession] = useState<WorkSession | null>(null)
  const [report, setReport] = useState<SessionReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const fetchData = async () => {
      try {
        const { user, error: userError } = await getCurrentUser()
        if (userError || !user) {
          router.push('/auth/login')
          return
        }

        // Fetch session details
        const { session: sessionData, error: sessionError } = await getSession(sessionId, user.id)
        if (sessionError) {
          console.error('Error fetching session:', sessionError)
          setError('Session not found')
          return
        }
        setSession(sessionData)

        // Fetch session report
        const { report: reportData, error: reportError } = await getSessionReport(sessionId, user.id)
        if (reportError) {
          console.error('Error fetching report:', reportError)
          setError('Report not found for this session')
        } else {
          setReport(reportData)
        }
      } catch (err) {
        console.error('Exception fetching data:', err)
        setError('Failed to load session data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, router])

  const formatDuration = (startedAt: string, endedAt: string | null) => {
    const start = new Date(startedAt)
    const end = endedAt ? new Date(endedAt) : new Date()
    const durationMs = end.getTime() - start.getTime()
    const durationMinutes = Math.round(durationMs / (1000 * 60))

    if (durationMinutes < 60) {
      return `${durationMinutes} minutes`
    }

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderInsights = (insights: string[] | undefined) => {
    if (!insights || insights.length === 0) {
      return <p className="text-gray-500 italic">No insights available</p>
    }

    return (
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{insight}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderRecommendations = (recommendations: string[] | undefined) => {
    if (!recommendations || recommendations.length === 0) {
      return <p className="text-gray-500 italic">No recommendations available</p>
    }

    return (
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start">
            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/sessions" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sessions
          </Link>

          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const comprehensiveReport = report?.comprehensive_report

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/sessions" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sessions
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {session?.session_name || 'Session Report'}
              </h1>
              <p className="text-gray-600">
                Comprehensive AI analysis of your work session
              </p>
            </div>

            <div className="flex items-center space-x-3 ml-6">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Session Overview */}
        {session && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Started
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(session.started_at)}
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration
                </div>
                <p className="font-medium text-gray-900">
                  {formatDuration(session.started_at, session.ended_at)}
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Productivity
                </div>
                <p className={`font-medium ${getScoreColor(session.productivity_score)}`}>
                  {session.productivity_score ? `${Math.round(session.productivity_score * 100)}%` : 'N/A'}
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Activity className="h-4 w-4 mr-2" />
                  Focus
                </div>
                <p className={`font-medium ${getScoreColor(session.focus_score)}`}>
                  {session.focus_score ? `${Math.round(session.focus_score * 100)}%` : 'N/A'}
                </p>
              </div>
            </div>

            {session.goal_description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Session Goal</h3>
                <p className="text-gray-700">{session.goal_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Report Content */}
        {report ? (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {report.executive_summary || comprehensiveReport?.summary || 'No summary available'}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            {comprehensiveReport?.sessionMetrics && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {report.screenshot_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">Screenshots Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {comprehensiveReport.sessionMetrics.totalBatches || 0}
                    </div>
                    <div className="text-sm text-gray-600">Analysis Batches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {comprehensiveReport.sessionMetrics.duration || report.session_duration_minutes || 0}m
                    </div>
                    <div className="text-sm text-gray-600">Session Duration</div>
                  </div>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
              {renderInsights(comprehensiveReport?.insights)}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
              {renderRecommendations(comprehensiveReport?.recommendations)}
            </div>

            {/* Detailed Analysis */}
            {comprehensiveReport?.batchAnalysis && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Total Screenshots</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {comprehensiveReport.batchAnalysis.totalScreenshots}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Average Productivity</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((comprehensiveReport.batchAnalysis.averageProductivity || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Available</h3>
            <p className="text-gray-600 mb-6">
              This session doesn't have a comprehensive report yet. Reports are generated automatically when sessions end.
            </p>
            <Link
              href="/sessions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Sessions
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}