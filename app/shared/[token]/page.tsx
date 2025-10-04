'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Home, ExternalLink, Eye, Clock, Share2, Users, Calendar, Code, TrendingUp } from 'lucide-react'
import { getSharedReport } from '@/lib/supabase'
import ReportViewer from '@/components/ReportViewer'

const SharedReportPage = () => {
  const params = useParams()
  const [report, setReport] = useState<any>(null)
  const [shareInfo, setShareInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = params?.token as string

  useEffect(() => {
    if (token) {
      loadSharedReport()
    }
  }, [token])

  const loadSharedReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const { report, shareInfo, error } = await getSharedReport(token)

      if (error) {
        setError(error.message || 'Failed to load shared report')
        return
      }

      if (!report) {
        setError('Report not found or link has expired')
        return
      }

      setReport(report)
      setShareInfo(shareInfo)
    } catch (err: any) {
      console.error('Error loading shared report:', err)
      setError('Failed to load report. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Expires today'
    if (diffDays === 1) return 'Expires tomorrow'
    return `Expires in ${diffDays} days`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">OnlyWorks</h1>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to OnlyWorks
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error === 'Report not found or link has expired' ? 'Link Expired or Invalid' : 'Unable to Load Report'}
            </h2>
            <p className="text-gray-600 mb-6">
              {error === 'Report not found or link has expired'
                ? 'This share link has expired or is no longer valid. Please contact the person who shared this report for a new link.'
                : error || 'An error occurred while loading the shared report.'
              }
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to OnlyWorks
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">OnlyWorks</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                Shared Report
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Get OnlyWorks
            </Link>
          </div>
        </div>
      </div>

      {/* Share Info Banner */}
      {shareInfo && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-blue-800">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Shared with: {shareInfo.recipientEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {shareInfo.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeRemaining(shareInfo.expiresAt)}
                </span>
              </div>

              <div className="text-blue-600">
                Report Date: {formatDate(report.report_date)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Content - Preview Mode */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Basic Report Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">{report.title || 'Daily Work Report'}</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(report.report_date)}
              </span>
              {report.developer && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {report.developer}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats - Always Visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{report.lines_written || 0}</div>
              <div className="text-sm text-blue-700">Lines Written</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{report.files_modified_count || 0}</div>
              <div className="text-sm text-green-700">Files Modified</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{report.screenshot_count || 0}</div>
              <div className="text-sm text-purple-700">Screenshots</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{report.session_duration || 'N/A'}</div>
              <div className="text-sm text-orange-700">Session Time</div>
            </div>
          </div>

          {/* Executive Summary Preview */}
          {report.executive_summary && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {report.executive_summary.substring(0, 300)}
                  {report.executive_summary.length > 300 && '...'}
                </p>
              </div>
            </div>
          )}

          {/* Locked Content Teasers */}
          <div className="space-y-6">

            {/* Timeline Section - Locked */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">📅 Timeline & Activity Log</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1">
                  🔒 Login Required
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 relative">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Detailed timeline view available</p>
                    <p className="text-sm text-gray-500">See exactly when and what was worked on</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="bg-white p-3 rounded flex-1">
                        <div className="font-medium">Project initialization</div>
                        <div className="text-sm text-gray-500">09:30 AM - 10:15 AM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="bg-white p-3 rounded flex-1">
                        <div className="font-medium">Feature development</div>
                        <div className="text-sm text-gray-500">10:30 AM - 12:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details - Locked */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">⚡ Technical Details & Code Analysis</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1">
                  🔒 Login Required
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 relative">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Detailed code metrics & file changes</p>
                    <p className="text-sm text-gray-500">See which files were modified and how</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-green-600">+{report.lines_written || 0}</div>
                      <div className="text-sm">Lines Added</div>
                    </div>
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-red-600">-{report.lines_deleted || 0}</div>
                      <div className="text-sm">Lines Removed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots Section - Locked */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">📸 Screenshots & Visual Timeline</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1">
                  🔒 Login Required
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 relative">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">{report.screenshot_count || 0} screenshots captured</p>
                    <p className="text-sm text-gray-500">Visual timeline of work session</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="bg-white h-20 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">🔓 Unlock Full Report Details</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            You're seeing a preview of this productivity report. Create a free OnlyWorks account to see the complete timeline,
            technical details, all screenshots, and get access to your own productivity tracking.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              📈 Sign Up Free - See Full Report
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              🔑 Already have an account? Login
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            ✨ Free forever • No credit card required • Join {Math.floor(Math.random() * 5000) + 15000}+ developers
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl font-bold text-center mb-8">🚀 What You'll Get with OnlyWorks</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Productivity Analytics</h4>
              <p className="text-gray-600 text-sm">Track your coding patterns, focus time, and productivity trends over time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Time Tracking</h4>
              <p className="text-gray-600 text-sm">Automatic time tracking with detailed breakdowns of your work sessions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Team Sharing</h4>
              <p className="text-gray-600 text-sm">Share reports with team members and track team productivity metrics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">OnlyWorks</h4>
            <p className="text-gray-400 mb-4">Productivity tracking for developers</p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
              <Link href="/support" className="text-gray-400 hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SharedReportPage