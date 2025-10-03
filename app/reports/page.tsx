'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  FileText,
  Code,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  Clock,
  BarChart3,
  AlertTriangle
} from 'lucide-react'
import { getUserReports, deleteReport } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { exportReport } from '@/utils/exportService'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'
import toast from 'react-hot-toast'

const ReportsPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedReports, setSelectedReports] = useState([])

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    loadReports()
  }, [user, loading, router])

  const loadReports = async () => {
    try {
      setLoadingReports(true)
      const { reports, error } = await getUserReports(user.id, 100)
      if (error) {
        console.error('Failed to load reports:', error)
        // Don't show error toast for empty results
        if (error.code !== 'PGRST116') {
          toast.error('Failed to load reports: ' + error.message)
        }
      }
      setReports(reports || [])
    } catch (error) {
      console.error('Failed to load reports:', error)
      toast.error('Unable to connect to the database. Please check your connection.')
    } finally {
      setLoadingReports(false)
    }
  }

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await deleteReport(reportId, user.id)
      if (error) throw error

      setReports(reports.filter(report => report.id !== reportId))
      toast.success('Report deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete report')
    }
  }

  // Sharing functionality disabled - database missing required columns
  const handleShareReport = async (reportId) => {
    toast.error('Sharing is currently disabled. Contact admin to enable this feature.')
  }

  const handleUnshareReport = async (reportId) => {
    toast.error('Sharing is currently disabled. Contact admin to enable this feature.')
  }

  // Original sharing code (commented out):
  // const handleShareReport = async (reportId) => {
  //   try {
  //     const { shareToken, error } = await shareReport(reportId)
  //     if (error) throw error

  //     const shareUrl = `${window.location.origin}/shared/${shareToken}`
  //     await navigator.clipboard.writeText(shareUrl)

  //     // Update local state
  //     setReports(reports.map(report =>
  //       report.id === reportId
  //         ? { ...report, shared_at: new Date().toISOString() }
  //         : report
  //     ))

  //     toast.success('Share link created and copied to clipboard!')
  //   } catch (error) {
  //     console.error('Share error:', error)
  //     toast.error('Failed to share report')
  //   }
  // }

  // const handleUnshareReport = async (reportId) => {
  //   try {
  //     const { error } = await unshareReport(reportId)
  //     if (error) throw error

  //     // Update local state
  //     setReports(reports.map(report =>
  //       report.id === reportId
  //         ? { ...report, shared_at: null }
  //         : report
  //     ))

  //     toast.success('Report unshared successfully')
  //   } catch (error) {
  //     console.error('Unshare error:', error)
  //     toast.error('Failed to unshare report')
  //   }
  // }

  const handleExportReport = async (report, format = 'json') => {
    try {
      await exportReport(report, format)
      toast.success(`Report exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  const toggleReportSelection = (reportId) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const selectAllReports = () => {
    setSelectedReports(filteredReports.map(report => report.id))
  }

  const clearSelection = () => {
    setSelectedReports([])
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.developer?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterBy === 'all' ||
                         (filterBy === 'shared' && report.shared_at) ||
                         (filterBy === 'private' && !report.shared_at)

    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.report_date) - new Date(a.report_date)
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'lines':
        return (b.lines_written || 0) - (a.lines_written || 0)
      case 'views':
        return (b.view_count || 0) - (a.view_count || 0)
      default:
        return 0
    }
  })

  if (loading || loadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reports...</p>
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
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">{reports.length} total reports</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/analytics"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reports</option>
                  <option value="shared">Shared Only</option>
                  <option value="private">Private Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="lines">Sort by Lines</option>
                  <option value="views">Sort by Views</option>
                </select>
              </div>

              {selectedReports.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedReports.length} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedReports.length} reports? This cannot be undone.`)) {
                        // Bulk delete implementation would go here
                        toast.error('Bulk delete not implemented yet')
                      }
                    }}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredReports.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {loadingReports ? 'Loading reports...' : 'No reports found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterBy !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Reports from the OnlyWorks desktop app will appear here automatically when you start tracking your work.'
                }
              </p>
              {!searchTerm && filterBy === 'all' && !loadingReports && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Ready to start tracking your productivity?
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
            <>
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === filteredReports.length}
                    onChange={selectedReports.length === filteredReports.length ? clearSelection : selectAllReports}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
                    <div className="col-span-4">Report</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Lines</div>
                    <div className="col-span-1">Files</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Views</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleReportSelection(report.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        {/* Report Info */}
                        <div className="col-span-4">
                          <h3 className="font-medium text-gray-900 truncate">
                            {report.title || 'Daily Work Report'}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {report.developer || 'Unknown Developer'}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900">{formatDate(report.report_date)}</div>
                          <div className="text-xs text-gray-500">{formatTime(report.created_at)}</div>
                        </div>

                        {/* Lines */}
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-900">
                            {(report.lines_written || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Files */}
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-900">
                            {report.files_modified_count || 0}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          {report.shared_at ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              <Eye className="w-3 h-3" />
                              Shared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              <EyeOff className="w-3 h-3" />
                              Private
                            </span>
                          )}
                        </div>

                        {/* Views */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-600">
                            {report.view_count || 0}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/reports/${report.id}`}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              View
                            </Link>

                            <button
                              onClick={() => handleExportReport(report, 'json')}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Export"
                            >
                              <Download className="w-3 h-3" />
                            </button>

                            {report.shared_at ? (
                              <button
                                onClick={() => handleUnshareReport(report.id)}
                                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Stop sharing"
                              >
                                <EyeOff className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleShareReport(report.id)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Share"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsPage