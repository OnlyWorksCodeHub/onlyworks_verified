'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Clock, Code, FileText, Camera, AlertTriangle, LogIn, Eye, Lock, Zap } from 'lucide-react'
import Image from 'next/image'

export default function TestSharedReportPage() {
  const { user } = useAuth() as any

  // Using the actual report data from your system
  const report = {
    id: "e6f5036a-32a8-4ad3-a376-bd89850e4842",
    report_date: "2025-10-03",
    title: "Last 24 Hours Report",
    developer: "Developer",
    session_duration: "Approximately 13 minutes and 0 seconds based on the timestamp from the first activity in the Outlook email and the last screenshot.",
    executive_summary: "The developer's session primarily involves managing a LinkedIn company page for OnlyWorks. They are observed inviting connections, particularly focusing on individuals with ties to Stony Brook University. There's evidence of video editing using Veed.io and email management through Outlook. Supabase login attempts and a brief ChatGPT consultation on Git commands are also present, suggesting some level of software development involvement.",
    lines_written: 0,
    lines_deleted: 0,
    files_modified_count: 0,
    errors_encountered_count: 2,
    screenshot_count: 341,
    processing_time_ms: 164041
  }

  const shareInfo = {
    recipientEmail: "recipient@example.com",
    expiresAt: "2025-11-03T04:31:59.230Z",
    viewCount: 1
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (duration: string | number) => {
    if (!duration) return 'N/A'
    if (typeof duration === 'string') return duration
    return `${duration} minutes`
  }

  const isAuthenticated = !!user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/onlyworks-logo.png"
                alt="OnlyWorks"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Share Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-blue-800 font-medium">
                This report was shared with you at {shareInfo.recipientEmail}
              </p>
              <p className="text-blue-600 text-sm">
                Expires: {formatDate(shareInfo.expiresAt)} •
                Views: {shareInfo.viewCount}
              </p>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Report Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {report.title}
                </h1>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(report.report_date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(report.session_duration)}
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Preview Mode
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Code className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{report.lines_written}</div>
                <div className="text-sm text-gray-600">Lines Written</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{report.files_modified_count}</div>
                <div className="text-sm text-gray-600">Files Modified</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Camera className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{report.screenshot_count}</div>
                <div className="text-sm text-gray-600">Screenshots</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{report.errors_encountered_count}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h2>
            <div className="prose max-w-none text-gray-700">
              {isAuthenticated ? (
                <p>{report.executive_summary}</p>
              ) : (
                <div>
                  <p>{report.executive_summary.substring(0, 300)}...</p>
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-blue-800 font-medium">Want to see the full summary?</p>
                        <p className="text-blue-600 text-sm">Sign in to OnlyWorks for complete access</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Features Preview */}
          {!isAuthenticated && (
            <div className="px-6 py-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🔓 Unlock Complete Access
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">What you're missing:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Complete timeline & activity log
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      All {report.screenshot_count} screenshots & visual timeline
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Technical details & code analysis
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Full executive summary & insights
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Your own productivity tracking
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Zap className="w-6 h-6 mr-2" />
                    <h3 className="font-semibold">Get OnlyWorks Free</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-4">
                    Track your own productivity and share detailed reports with your team.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/auth/register"
                      className="block w-full bg-white text-blue-600 text-center py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                    >
                      Sign Up Free
                    </Link>
                    <Link
                      href="/auth/login"
                      className="block w-full border border-white/30 text-white text-center py-2 rounded-md font-medium hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authenticated User - Full Access */}
          {isAuthenticated && (
            <div className="px-6 py-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">Full Access Unlocked!</p>
                    <p className="text-green-600 text-sm">
                      You can see all details because you're signed in to OnlyWorks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Your Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              OnlyWorks
            </Link>
            {' '}- Productivity Tracking Made Simple
          </p>
        </footer>
      </div>
    </div>
  )
}