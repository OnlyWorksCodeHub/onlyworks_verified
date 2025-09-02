'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { FileText, Download, Calendar, TrendingUp, Brain, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    setLoading(false)
  }

  const generateReport = async () => {
    setGenerating(true)
    try {
      const { data: sessions } = await supabase
        .from('workflow_sessions')
        .select(`
          *,
          screenshots:screenshots(count),
          analyses:analyses(
            productivity_score,
            focus_score,
            activity_type,
            work_category,
            applications_detected,
            distractions_detected,
            suggestions,
            estimated_task,
            raw_analysis
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59')
        .order('created_at', { ascending: false })

      const { count: totalScreenshots } = await supabase
        .from('screenshots')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59')

      let allAnalyses: any[] = []
      let sessionDetails: any[] = []
      
      if (sessions && sessions.length > 0) {
        sessions.forEach(session => {
          if (session.analyses && Array.isArray(session.analyses)) {
            allAnalyses = [...allAnalyses, ...session.analyses]
          }
          
          const sessionAnalyses = session.analyses || []
          const avgProductivity = sessionAnalyses.length > 0
            ? Math.round(sessionAnalyses.reduce((acc: number, a: any) => acc + (a.productivity_score || 0), 0) / sessionAnalyses.length)
            : 0
            
          sessionDetails.push({
            name: session.name,
            date: new Date(session.created_at).toLocaleString(),
            status: session.status,
            screenshots: session.screenshots?.[0]?.count || 0,
            productivity: avgProductivity,
            duration: session.screenshots?.[0]?.count ? Math.round((session.screenshots[0].count * 30) / 60) : 0
          })
        })
      }

      const avgProductivity = allAnalyses.length > 0
        ? Math.round(allAnalyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / allAnalyses.length)
        : 0

      const avgFocus = allAnalyses.length > 0
        ? Math.round(allAnalyses.reduce((acc, a) => acc + (a.focus_score || 0), 0) / allAnalyses.length)
        : 0

      const activityTypes: { [key: string]: number } = {}
      const workCategories: { [key: string]: number } = {}
      const allApps: { [key: string]: number } = {}
      const allDistractions: { [key: string]: number } = {}
      const allSuggestions: { [key: string]: number } = {}
      const allTasks: string[] = []

      allAnalyses.forEach(analysis => {
        if (analysis.activity_type) {
          activityTypes[analysis.activity_type] = (activityTypes[analysis.activity_type] || 0) + 1
        }
        
        if (analysis.work_category) {
          workCategories[analysis.work_category] = (workCategories[analysis.work_category] || 0) + 1
        }
        
        if (analysis.applications_detected) {
          analysis.applications_detected.forEach((app: string) => {
            allApps[app] = (allApps[app] || 0) + 1
          })
        }
        
        if (analysis.distractions_detected && analysis.distractions_detected.length > 0) {
          analysis.distractions_detected.forEach((distraction: string) => {
            allDistractions[distraction] = (allDistractions[distraction] || 0) + 1
          })
        }
        
        if (analysis.suggestions) {
          analysis.suggestions.forEach((suggestion: string) => {
            allSuggestions[suggestion] = (allSuggestions[suggestion] || 0) + 1
          })
        }
        
        if (analysis.estimated_task && !allTasks.includes(analysis.estimated_task)) {
          allTasks.push(analysis.estimated_task)
        }
      })

      const productivityByHour: { [key: number]: { total: number, count: number } } = {}
      allAnalyses.forEach(a => {
        if (a.raw_analysis?.created_at) {
          const hour = new Date(a.raw_analysis.created_at).getHours()
          if (!productivityByHour[hour]) productivityByHour[hour] = { total: 0, count: 0 }
          productivityByHour[hour].total += a.productivity_score || 0
          productivityByHour[hour].count++
        }
      })

      let peakHour = 'Not enough data'
      let peakProductivity = 0
      Object.entries(productivityByHour).forEach(([hour, data]) => {
        const avg = data.total / data.count
        if (avg > peakProductivity) {
          peakProductivity = avg
          const h = parseInt(hour)
          peakHour = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
        }
      })

      const strengths: string[] = []
      const weaknesses: string[] = []
      const recommendations: string[] = []

      if (avgProductivity >= 80) {
        strengths.push('Excellent overall productivity levels')
      } else if (avgProductivity >= 60) {
        strengths.push('Good productivity maintenance')
      }
      
      if (avgFocus >= 80) {
        strengths.push('Strong focus and concentration')
      }
      
      if (Object.keys(allDistractions).length === 0) {
        strengths.push('Minimal distractions detected')
      }
      
      const deepWorkCount = workCategories['deep work'] || 0
      if (deepWorkCount > (allAnalyses.length * 0.3)) {
        strengths.push('High percentage of deep work sessions')
      }

      if (avgProductivity < 60 && avgProductivity > 0) {
        weaknesses.push('Productivity below optimal levels')
        recommendations.push('Consider time-blocking for focused work sessions')
      }
      
      if (Object.keys(allDistractions).length > 3) {
        weaknesses.push('Multiple distractions detected')
        recommendations.push('Minimize browser tabs and notifications during work')
      }
      
      if (avgFocus < 60 && avgFocus > 0) {
        weaknesses.push('Focus score indicates frequent context switching')
        recommendations.push('Try the Pomodoro Technique for better focus')
      }
      
      const shallowWorkCount = workCategories['shallow work'] || 0
      if (shallowWorkCount > (allAnalyses.length * 0.5)) {
        weaknesses.push('High percentage of shallow work')
        recommendations.push('Schedule dedicated blocks for deep, focused work')
      }

      const topSuggestions = Object.entries(allSuggestions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([suggestion]) => suggestion)

      setReportData({
        period: `${dateRange.start} to ${dateRange.end}`,
        totalSessions: sessions?.length || 0,
        totalHours: Math.round((totalScreenshots || 0) * 30 / 3600 * 10) / 10,
        totalScreenshots: totalScreenshots || 0,
        avgProductivity,
        avgFocus,
        peakHour,
        peakProductivity: Math.round(peakProductivity),
        activityBreakdown: activityTypes,
        workCategories,
        topApplications: Object.entries(allApps)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([app, count]) => ({ app, count })),
        distractions: Object.keys(allDistractions),
        strengths,
        weaknesses,
        recommendations: [...recommendations, ...topSuggestions].filter((v, i, a) => a.indexOf(v) === i),
        sessions: sessionDetails,
        tasksWorkedOn: allTasks.slice(0, 10)
      })

      toast.success('Report generated successfully!')
    } catch (error) {
      console.error('Report generation error:', error)
      toast.error('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = () => {
    if (!reportData) return

    const reportText = `
PRODUCTIVITY REPORT - ONLYWORKS
================================
Generated: ${new Date().toLocaleString()}
Period: ${reportData.period}

EXECUTIVE SUMMARY
-----------------
Total Sessions: ${reportData.totalSessions}
Total Time Tracked: ${reportData.totalHours} hours
Total Data Points: ${reportData.totalScreenshots}
Average Productivity: ${reportData.avgProductivity}%
Average Focus Score: ${reportData.avgFocus}%
Peak Productivity Hour: ${reportData.peakHour} (${reportData.peakProductivity}% avg)

STRENGTHS
---------
${reportData.strengths.length > 0 ? reportData.strengths.map((s: string) => `✓ ${s}`).join('\n') : '• No significant strengths identified yet'}

AREAS FOR IMPROVEMENT
--------------------
${reportData.weaknesses.length > 0 ? reportData.weaknesses.map((w: string) => `• ${w}`).join('\n') : '• Continue tracking to identify patterns'}

RECOMMENDATIONS
---------------
${reportData.recommendations.length > 0 ? reportData.recommendations.map((r: string) => `→ ${r}`).join('\n') : '• Keep up the good work!'}

SESSION DETAILS
--------------
${reportData.sessions.map((s: any) => 
  `${s.name}
  Date: ${s.date}
  Duration: ${s.duration} minutes
  Productivity: ${s.productivity}%
  Status: ${s.status}`
).join('\n\n')}
    `

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onlyworks-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    
    toast.success('Report exported!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter mb-8">
              Productivity Reports
            </h1>
            
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Generate Report</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light"
                  />
                </div>
              </div>
              
              <button
                onClick={generateReport}
                disabled={generating}
                className="btn-clean btn-primary-clean flex items-center"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Analysis Report
                  </>
                )}
              </button>
            </div>
            
            {reportData && (
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Analysis Report</h2>
                  <button
                    onClick={exportReport}
                    className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-sm hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Productivity</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">{reportData.avgProductivity}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Score</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">{reportData.avgFocus}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Tracked</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">{reportData.totalHours}h</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peak Hour</p>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">{reportData.peakHour}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                        Strengths
                      </h3>
                      {reportData.strengths.length > 0 ? (
                        <ul className="space-y-2">
                          {reportData.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track more sessions to identify strengths</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
                        Areas for Improvement
                      </h3>
                      {reportData.weaknesses.length > 0 ? (
                        <ul className="space-y-2">
                          {reportData.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No significant issues detected</p>
                      )}
                    </div>
                  </div>
                  
                  {reportData.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {reportData.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-sm">
                            → {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
