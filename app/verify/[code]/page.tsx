'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/logo'
import { CheckCircle, Shield, TrendingUp, Clock, Award, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PublicReport {
  id: string
  verification_code: string
  company_name?: string
  project_name?: string
  work_duration: number
  productivity_score: number
  authenticity_verified: boolean
  work_summary: string
  key_metrics: {
    totalActions: number
    focusedWorkPercentage: number
    toolsUsed: string[]
    tasksCompleted: string[]
    efficiencyRating: string
  }
  created_at: string
}

export default function VerifyPage({ params }: { params: { code: string } }) {
  const [report, setReport] = useState<PublicReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchReport()
  }, [params.code])

  const fetchReport = async () => {
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .eq('verification_code', params.code)
      .eq('is_public', true)
      .single()

    if (error || !data) {
      setError(true)
    } else {
      setReport(data)
      
      // Increment view count
      await supabase
        .from('public_reports')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Report Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This verification code is invalid or has expired.
          </p>
        </div>
      </div>
    )
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Logo size={40} />
            <span className="text-2xl font-semibold tracking-tight text-primary dark:text-primary-light">
              OnlyWorks
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Work Verification Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This work has been verified and authenticated by OnlyWorks
          </p>
        </div>

        {/* Verification Badge */}
        <div className="card-clean p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Verification Code
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.verification_code}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generated
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {report.authenticity_verified ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="font-medium text-green-800 dark:text-green-400">
                  Authenticity Verified - No automation detected
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-sm p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <p className="font-medium text-amber-800 dark:text-amber-400">
                  Partial verification - Some automated behavior detected
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Work Details */}
        <div className="card-clean p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Work Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {report.company_name && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.company_name}
                </p>
              </div>
            )}
            {report.project_name && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Project</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.project_name}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDuration(report.work_duration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Actions</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {report.key_metrics.totalActions}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-clean p-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {report.productivity_score}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Productivity Score
            </p>
          </div>
          
          <div className="card-clean p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {report.key_metrics.focusedWorkPercentage}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Focus Score
            </p>
          </div>
          
          <div className="card-clean p-6 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {report.key_metrics.efficiencyRating}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Efficiency Rating
            </p>
          </div>
        </div>

        {/* Work Summary */}
        <div className="card-clean p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Work Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {report.work_summary}
          </p>
        </div>

        {/* Tasks & Tools */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card-clean p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Tasks Completed
            </h3>
            <ul className="space-y-2">
              {report.key_metrics.tasksCompleted.map((task, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{task}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card-clean p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Tools Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.key_metrics.toolsUsed.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>This report is publicly verifiable at:</p>
          <p className="font-mono text-primary">
            {process.env.NEXT_PUBLIC_APP_URL}/verify/{report.verification_code}
          </p>
        </div>
      </div>
    </div>
  )
}
