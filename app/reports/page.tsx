'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileText, Download, Share2, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchReports()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const fetchReports = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch completed sessions with summaries
    const { data } = await supabase
      .from('workflow_sessions')
      .select(`
        *,
        session_summaries (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (data) {
      setReports(data.filter(s => s.session_summaries?.length > 0))
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
            </div>

            {reports.length === 0 ? (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Reports Yet</h2>
                <p className="text-gray-400 mb-6">Complete a work session to generate your first report</p>
                <Link href="/dashboard" className="px-6 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
                  Start Session
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {reports.map((report) => (
                  <div key={report.id} className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(report.created_at), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {report.session_summaries[0]?.avg_productivity_score}% Productivity
                          </span>
                          {report.session_summaries[0]?.authenticity_verified && (
                            <span className="flex items-center text-green-500">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
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
                      </div>
                    </div>
                    
                    {report.session_summaries[0]?.work_narrative && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {report.session_summaries[0].work_narrative}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
