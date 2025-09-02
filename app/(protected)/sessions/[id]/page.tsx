'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useRouter, useParams } from 'next/navigation'
import { Clock, TrendingUp, Brain, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SessionDetailPage() {
  const [session, setSession] = useState<any>(null)
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    loadSessionDetails()
  }, [params.id])

  const loadSessionDetails = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data: sessionData } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (sessionData) {
      setSession(sessionData)
      
      const { data: analysesData } = await supabase
        .from('analyses')
        .select('*')
        .eq('session_id', params.id)
        .order('created_at', { ascending: false })

      setAnalyses(analysesData || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={user} />
          <main className="flex-1 p-6">
            <p className="text-gray-600 dark:text-gray-400">Session not found</p>
          </main>
        </div>
      </div>
    )
  }

  const avgProductivity = analyses.length > 0
    ? Math.round(analyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / analyses.length)
    : 0

  const duration = analyses.length * 30 / 60 // Assuming 30 seconds per capture

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <Link href="/sessions" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Link>
            
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2">{session.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {new Date(session.created_at).toLocaleString()}
            </p>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-dark-card p-4 rounded-sm border border-gray-200 dark:border-dark-border">
                <Clock className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(duration)}m</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              </div>
              <div className="bg-white dark:bg-dark-card p-4 rounded-sm border border-gray-200 dark:border-dark-border">
                <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgProductivity}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Productivity</p>
              </div>
              <div className="bg-white dark:bg-dark-card p-4 rounded-sm border border-gray-200 dark:border-dark-border">
                <Brain className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyses.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Captures</p>
              </div>
              <div className="bg-white dark:bg-dark-card p-4 rounded-sm border border-gray-200 dark:border-dark-border">
                <Calendar className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{session.status}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Activity Timeline</h2>
              
              {analyses.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No activity recorded in this session</p>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <div key={analysis.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(analysis.created_at).toLocaleTimeString()}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {analysis.activity_type || 'Working'}
                          </p>
                          {analysis.estimated_task && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Task: {analysis.estimated_task}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary dark:text-primary-light">
                            {analysis.productivity_score || 0}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Productivity</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
