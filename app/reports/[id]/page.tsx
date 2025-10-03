'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Download, AlertTriangle } from 'lucide-react'
import { getReport } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { exportReport } from '@/utils/exportService'
import ReportViewer from '@/components/ReportViewer'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'
import toast from 'react-hot-toast'

const ReportDetailPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const reportId = params?.id

  const [report, setReport] = useState(null)
  const [loadingReport, setLoadingReport] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!reportId) {
      setError('Invalid report ID')
      setLoadingReport(false)
      return
    }

    loadReport()
  }, [user, loading, router, reportId])

  const loadReport = async () => {
    try {
      setLoadingReport(true)
      setError(null)

      const { report, error } = await getReport(reportId, user.id)
      if (error) {
        if (error.code === 'PGRST116') {
          setError('Report not found or you don\'t have permission to view it')
        } else {
          throw error
        }
        return
      }

      setReport(report)
    } catch (error) {
      console.error('Failed to load report:', error)
      setError('Failed to load report: ' + error.message)
    } finally {
      setLoadingReport(false)
    }
  }

  const handleExportReport = async (format = 'json') => {
    if (!report) return

    try {
      await exportReport(report, format)
      toast.success(`Report exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  if (loading || loadingReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/reports"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Report</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load report</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/reports"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Reports
              </Link>
              <button
                onClick={loadReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />

      {/* Header */}
      <div className="pt-16 bg-white shadow-sm border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/reports"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {report?.title || 'Daily Work Report'}
                </h1>
                <p className="text-sm text-gray-600">
                  {report?.developer} • {new Date(report?.report_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                  <div className="py-2">
                    <button
                      onClick={() => handleExportReport('json')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => handleExportReport('csv')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExportReport('html')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as HTML
                    </button>
                  </div>
                </div>
              </div>

              <Link
                href={`/reports/${reportId}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="py-8">
        <ReportViewer report={report} isShared={false} />
      </div>
    </div>
  )
}

export default ReportDetailPage