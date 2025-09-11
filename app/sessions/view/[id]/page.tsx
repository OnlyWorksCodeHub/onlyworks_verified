'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { SessionFeedback } from '@/components/feedback/SessionFeedback'
import { ArrowLeft, Download, Share2, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function SessionViewPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchSessionData()
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const fetchSessionData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch session
    const { data: sessionData } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!sessionData) {
      router.push('/sessions')
      return
    }

    setSession(sessionData)

    // Fetch summary
    const { data: summaryData } = await supabase
      .from('session_summaries')
      .select('*')
      .eq('session_id', params.id)
      .single()

    setSummary(summaryData)

    // Fetch screenshots
    const { data: screenshotData } = await supabase
      .from('screenshots')
      .select('*')
      .eq('session_id', params.id)
      .order('sequence_number', { ascending: true })
      .limit(10)

    setScreenshots(screenshotData || [])
    setLoading(false)
  }

  const generateReport = async () => {
    toast.loading('Generating public report...')
    
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: params.id })
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Link
                href="/sessions"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sessions
              </Link>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {session.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {format(new Date(session.created_at), 'MMMM dd, yyyy - h:mm a')}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  {session.status === 'completed' && (
                    <button
                      onClick={generateReport}
                      className="btn-clean bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Report
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Session Metrics */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card-clean p-4">
                  <TrendingUp className="w-6 h-6 text-primary mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.avg_productivity_score}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Productivity
                  </p>
                </div>
                
                <div className="card-clean p-4">
                  <Clock className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.avg_focus_score}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Focus
                  </p>
                </div>
                
                <div className="card-clean p-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.avg_authenticity_score}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Authenticity
                  </p>
                </div>
                
                <div className="card-clean p-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.total_screenshots}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Actions
                  </p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Work Summary */}
                {summary && (
                  <div className="card-clean p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Work Summary
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {summary.work_narrative}
                    </p>
                    
                    {summary.accomplishments && summary.accomplishments.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          Accomplishments
                        </h3>
                        <ul className="space-y-1">
                          {summary.accomplishments.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Screenshot Timeline */}
                <div className="card-clean p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Activity Timeline
                  </h2>
                  <div className="space-y-3">
                    {screenshots.map((screenshot, index) => (
                      <div key={screenshot.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-sm">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {screenshot.sequence_number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {screenshot.trigger_type === 'click' ? 'Mouse Click' : 
                             screenshot.trigger_type === 'spacebar' ? 'Spacebar' : 'Enter Key'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(screenshot.created_at), 'h:mm:ss a')}
                            {screenshot.mouse_x && ` • Position: (${screenshot.mouse_x}, ${screenshot.mouse_y})`}
                          </p>
                        </div>
                        {screenshot.is_suspicious && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Panel */}
              <div>
                {summary && <SessionFeedback summary={summary} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
