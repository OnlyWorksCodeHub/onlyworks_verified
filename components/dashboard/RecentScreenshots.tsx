'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, Eye, TrendingUp, AlertCircle, Target } from 'lucide-react'

interface Screenshot {
  id: string
  image_url: string
  created_at: string
  analyses?: {
    productivity_score: number
    activity_type: string
    raw_analysis: any
  }[]
}

interface RecentScreenshotsProps {
  userId: string
  sessionId?: string | null
}

export function RecentScreenshots({ userId, sessionId }: RecentScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadScreenshots()
    
    const subscription = supabase
      .channel('screenshots')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'screenshots',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setScreenshots(prev => [payload.new as Screenshot, ...prev])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [sessionId])

  const loadScreenshots = async () => {
    try {
      let query = supabase
        .from('screenshots')
        .select('*, analyses(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12)

      if (sessionId) {
        query = query.eq('session_id', sessionId)
      }

      const { data, error } = await query

      if (error) throw error
      setScreenshots(data || [])
    } catch (error) {
      console.error('Error loading screenshots:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100'
    if (score >= 60) return 'text-yellow-700 bg-yellow-100'
    return 'text-red-700 bg-red-100'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="animate-pulse grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-video bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity {screenshots.length > 0 && `(${screenshots.length})`}
          </h2>
          {screenshots.length > 0 && (
            <div className="text-sm text-gray-600">
              Avg Score: {Math.round(
                screenshots.reduce((acc, s) => acc + (s.analyses?.[0]?.productivity_score || 0), 0) / screenshots.length
              )}%
            </div>
          )}
        </div>
        
        {screenshots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No activity captured yet. Start a recording session to begin tracking.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((screenshot) => {
              const analysis = screenshot.analyses?.[0]
              const rawAnalysis = analysis?.raw_analysis
              
              return (
                <div key={screenshot.id} className="group relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                    <img
                      src={screenshot.image_url}
                      alt="Screenshot"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <button 
                          onClick={() => setSelectedScreenshot(screenshot)}
                          className="w-full bg-white text-gray-900 px-3 py-1 rounded text-sm flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(screenshot.created_at).toLocaleTimeString()}
                    </p>
                    {analysis && (
                      <>
                        <div className="flex items-center space-x-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getProductivityColor(analysis.productivity_score)}`}>
                            {analysis.productivity_score}%
                          </span>
                          <span className="text-xs text-gray-600 truncate">
                            {analysis.activity_type}
                          </span>
                        </div>
                        {rawAnalysis?.work_category && (
                          <p className="text-xs text-gray-500 capitalize">
                            {rawAnalysis.work_category}
                          </p>
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

      {/* Detail Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedScreenshot(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Activity Details</h3>
                <button 
                  onClick={() => setSelectedScreenshot(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedScreenshot.image_url} 
                    alt="Screenshot"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(selectedScreenshot.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {selectedScreenshot.analyses?.[0]?.raw_analysis ? (
                    <>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Productivity Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600">Productivity</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {selectedScreenshot.analyses[0].productivity_score}%
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600">Focus</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {selectedScreenshot.analyses[0].raw_analysis.focus_score || 'N/A'}%
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Activity Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Type:</span> {selectedScreenshot.analyses[0].activity_type}</p>
                          <p><span className="font-medium">Category:</span> {selectedScreenshot.analyses[0].raw_analysis.work_category}</p>
                          <p><span className="font-medium">Task:</span> {selectedScreenshot.analyses[0].raw_analysis.estimated_task}</p>
                          <p><span className="font-medium">Apps:</span> {selectedScreenshot.analyses[0].raw_analysis.applications?.join(', ')}</p>
                        </div>
                      </div>
                      
                      {selectedScreenshot.analyses[0].raw_analysis.suggestions && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Suggestions</h4>
                          <ul className="space-y-1">
                            {selectedScreenshot.analyses[0].raw_analysis.suggestions.map((suggestion: string, i: number) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start">
                                <Target className="w-4 h-4 mr-2 mt-0.5 text-purple-500" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedScreenshot.analyses[0].raw_analysis.distractions_detected?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Distractions Detected</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedScreenshot.analyses[0].raw_analysis.distractions_detected.map((distraction: string, i: number) => (
                              <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                {distraction}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">No analysis available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
