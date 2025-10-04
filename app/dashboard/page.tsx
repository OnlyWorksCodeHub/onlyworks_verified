'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  FileText,
  TrendingUp,
  Code,
  AlertTriangle,
  BarChart3,
  Plus,
  Download,
  Share2,
  Eye,
  Clock,
  Users,
  Search,
  Filter,
  ChevronRight,
  Activity
} from 'lucide-react'
import { getUserReports, getProductivityTrends } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { exportReport } from '@/utils/exportService'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, loading } = useAuth() as any
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    loadReports()
    loadTrends()
  }, [user, loading, router])

  const loadReports = async () => {
    try {
      setLoadingReports(true)
      console.log('Loading reports for user:', user.id, user.email)
      const { reports, error } = await getUserReports(user.id, 50)
      console.log('Reports response:', { reports, error })
      if (error) {
        console.error('Failed to load reports:', error)
        // Don't show error toast for empty results
        if (error.code !== 'PGRST116') {
          toast.error('Failed to load reports: ' + error.message)
        }
      }
      console.log('Setting reports:', reports || [])
      console.log('Full report details:', JSON.stringify(reports, null, 2))
      setReports(reports || [])
    } catch (error) {
      console.error('Failed to load reports:', error)
      toast.error('Unable to connect to the database. Please check your connection.')
    } finally {
      setLoadingReports(false)
    }
  }

  const loadTrends = async () => {
    try {
      const { trends, error } = await getProductivityTrends(user.id, 30)
      if (error) throw error
      setTrends(trends || [])
    } catch (error) {
      console.error('Failed to load trends:', error)
    }
  }

  const handleExportReport = async (report: any, format = 'json') => {
    try {
      await exportReport(report, format)
      toast.success(`Report exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: any) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReports = reports.filter((report: any) =>
    report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.developer?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'lines':
        return (b.lines_written || 0) - (a.lines_written || 0)
      default:
        return 0
    }
  })

  // Calculate stats
  const totalReports = reports.length
  const totalLines = reports.reduce((sum, report) => sum + (report.lines_written || 0), 0)
  const totalFiles = reports.reduce((sum, report) => sum + (report.files_modified_count || 0), 0)
  const avgProductivity = totalReports > 0 ? Math.round(totalLines / totalReports) : 0

  if (loading || loadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />

      {/* Header */}
      <div className="pt-16 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/reports/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lines Written</p>
                <p className="text-2xl font-bold text-gray-900">{totalLines.toLocaleString()}</p>
              </div>
              <Code className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Files Modified</p>
                <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Lines/Report</p>
                <p className="text-2xl font-bold text-gray-900">{avgProductivity}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <Link
                href="/reports"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="lines">Sort by Lines</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {loadingReports ? 'Loading reports...' : 'No reports yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? 'Try adjusting your search terms.'
                    : 'Reports from the OnlyWorks desktop app will appear here automatically. Make sure the desktop app is running and connected to your account.'
                  }
                </p>
                {!searchTerm && !loadingReports && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Don't have the desktop app yet?
                    </p>
                    <Link
                      href="/downloads"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Desktop App
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              filteredReports.slice(0, 10).map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">
                          {report.title || 'Daily Work Report'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.report_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {report.session_duration || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          {report.lines_written || 0} lines
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {report.files_modified_count || 0} files
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExportReport(report, 'json')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Export report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/reports/${report.id}`}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard