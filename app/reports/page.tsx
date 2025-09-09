'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileText, Download, Share2, Calendar, TrendingUp, CheckCircle, Clock, BarChart3, Plus } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [sessionReports, setSessionReports] = useState<any[]>([])
  const [userReports, setUserReports] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'session' | 'daily' | 'weekly' | 'hourly'>('session')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchAllReports()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const fetchAllReports = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch completed sessions with summaries
    const { data: sessionData } = await supabase
      .from('workflow_sessions')
      .select(`
        *,
        session_summaries (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (sessionData) {
      setSessionReports(sessionData.filter(s => s.session_summaries?.length > 0))
    }

    // Fetch user reports (daily, weekly, hourly)
    const { data: userReportData } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })

    if (userReportData) {
      setUserReports(userReportData)
    }

    setLoading(false)
  }

  const generatePublicReport = async (sessionId: string) => {
    toast.loading('Generating public report...')
    
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })

    if (response.ok) {
      const { report } = await response.json()
      toast.dismiss()
      toast.success('Report generated!')
      window.open(report.publicUrl, '_blank')
    } else {
      toast.dismiss()
      toast.error('Failed to generate report')
    }
  }

  const generateTimeBasedReport = async (reportType: 'daily' | 'weekly' | 'hourly', targetDate?: Date) => {
    setGenerating(reportType)
    toast.loading(`Generating ${reportType} report...`)
    
    const response = await fetch(`/api/reports/generate-${reportType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        targetDate: targetDate?.toISOString() || new Date().toISOString()
      })
    })

    if (response.ok) {
      const result = await response.json()
      toast.dismiss()
      if (result.message?.includes('already exists')) {
        toast.success('Report already exists for this period!')
      } else {
        toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated!`)
      }
      fetchAllReports() // Refresh the reports list
    } else {
      toast.dismiss()
      toast.error(`Failed to generate ${reportType} report`)
    }
    setGenerating(null)
  }

  const getFilteredReports = () => {
    if (activeTab === 'session') {
      return sessionReports
    } else {
      return userReports.filter(report => report.report_type === activeTab)
    }
  }

  const formatReportDate = (report: any) => {
    if (report.report_type) {
      // User report
      return format(new Date(report.period_start), 'MMM dd, yyyy')
    } else {
      // Session report
      return format(new Date(report.created_at), 'MMM dd, yyyy')
    }
  }

  const getReportTitle = (report: any) => {
    if (report.report_type) {
      // User report
      const date = format(new Date(report.period_start), 'MMM dd, yyyy')
      return `${report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} Report - ${date}`
    } else {
      // Session report
      return report.name
    }
  }

  const getReportMetrics = (report: any) => {
    if (report.report_type) {
      // User report
      const hours = Math.round((report.total_duration || 0) / 3600 * 100) / 100
      return {
        duration: `${hours}h`,
        productivity: `${Math.round(report.avg_productivity_score || 0)}%`,
        sessions: report.total_sessions || 0
      }
    } else {
      // Session report
      return {
        duration: report.total_duration ? `${Math.round(report.total_duration / 60)}min` : '0min',
        productivity: `${report.session_summaries[0]?.avg_productivity_score || 0}%`,
        sessions: 1
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E5CE6]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="text-gray-400 mt-1">View and share your productivity reports</p>
              
              {/* Report Generation Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => generateTimeBasedReport('daily')}
                  disabled={generating === 'daily'}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {generating === 'daily' ? 'Generating...' : 'Generate Daily Report'}
                </button>
                <button
                  onClick={() => generateTimeBasedReport('weekly')}
                  disabled={generating === 'weekly'}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {generating === 'weekly' ? 'Generating...' : 'Generate Weekly Report'}
                </button>
                <button
                  onClick={() => generateTimeBasedReport('hourly')}
                  disabled={generating === 'hourly'}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {generating === 'hourly' ? 'Generating...' : 'Generate Hourly Report'}
                </button>
              </div>
              
              {/* Report Type Tabs */}
              <div className="mt-6 border-b border-gray-800">
                <div className="flex space-x-8">
                  {[
                    { key: 'session', label: 'Session Reports', icon: FileText },
                    { key: 'daily', label: 'Daily Reports', icon: Calendar },
                    { key: 'weekly', label: 'Weekly Reports', icon: BarChart3 },
                    { key: 'hourly', label: 'Hourly Reports', icon: Clock }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm transition ${
                        activeTab === key
                          ? 'border-blue-500 text-blue-500'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                      <span className="ml-2 px-2 py-1 bg-gray-800 text-xs rounded-full">
                        {key === 'session' ? sessionReports.length : userReports.filter(r => r.report_type === key).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {getFilteredReports().length === 0 ? (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No {activeTab === 'session' ? 'Session' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} Reports Yet</h2>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'session' 
                    ? 'Complete a work session to generate your first report'
                    : `Generate your first ${activeTab} report using the buttons above`}
                </p>
                {activeTab === 'session' && (
                  <Link href="/dashboard" className="px-6 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
                    Start Session
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {getFilteredReports().map((report) => {
                  const metrics = getReportMetrics(report)
                  return (
                    <div key={report.id} className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{getReportTitle(report)}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatReportDate(report)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {metrics.duration}
                            </span>
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {metrics.productivity} Productivity
                            </span>
                            {report.report_type && (
                              <span className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {metrics.sessions} session{metrics.sessions !== 1 ? 's' : ''}
                              </span>
                            )}
                            {(report.avg_authenticity_score >= 80 || 
                              (report.session_summaries?.[0]?.avg_authenticity_score >= 80)) && (
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {activeTab === 'session' ? (
                            <>
                              <button
                                onClick={() => generatePublicReport(report.id)}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </button>
                              <Link
                                href={`/sessions/view/${report.id}`}
                                className="px-4 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition"
                              >
                                View Details
                              </Link>
                            </>
                          ) : (
                            <>
                              {report.verification_code && (
                                <button
                                  onClick={() => window.open(`/verify/${report.verification_code}`, '_blank')}
                                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  View Report
                                </button>
                              )}
                              <button
                                className="px-4 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition flex items-center"
                                onClick={() => {
                                  // Could implement detailed view for time-based reports
                                  toast('Detailed view coming soon!')
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Details
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-gray-400 text-sm">
                        {activeTab === 'session' ? (
                          report.session_summaries?.[0]?.work_narrative && (
                            <p className="line-clamp-2">
                              {report.session_summaries[0].work_narrative}
                            </p>
                          )
                        ) : (
                          <>
                            {report.work_narrative && (
                              <p className="line-clamp-2 mb-2">{report.work_narrative}</p>
                            )}
                            {report.key_insights && report.key_insights.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-500">Key Insights: </span>
                                <span className="text-xs">{report.key_insights[0]}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
