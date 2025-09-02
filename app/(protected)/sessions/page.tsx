'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Clock, Camera, TrendingUp, Calendar, Play, CheckCircle, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Session {
  id: string
  name: string
  status: string
  created_at: string
  screenshots: any[]
  analyses: any[]
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = sessions.filter(session => 
        session.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSessions(filtered)
    } else {
      setFilteredSessions(sessions)
    }
  }, [searchTerm, sessions])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    await loadSessions(user.id)
  }

  const loadSessions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workflow_sessions')
        .select(`
          *,
          screenshots!screenshots_session_id_fkey(id, created_at),
          analyses!analyses_user_id_fkey(productivity_score)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Sessions query error:', error)
        const { data: basicSessions } = await supabase
          .from('workflow_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        setSessions(basicSessions || [])
        setFilteredSessions(basicSessions || [])
      } else {
        setSessions(data || [])
        setFilteredSessions(data || [])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSessionDuration = (session: Session) => {
    if (!session.screenshots || session.screenshots.length < 2) {
      return '< 1m'
    }
    
    const times = session.screenshots.map(s => new Date(s.created_at).getTime())
    const start = Math.min(...times)
    const end = Math.max(...times)
    const minutes = Math.round((end - start) / (1000 * 60))
    
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getAverageProductivity = (session: Session) => {
    if (!session.analyses || session.analyses.length === 0) return 'N/A'
    const sum = session.analyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0)
    return Math.round(sum / session.analyses.length)
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
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter">
                Work Sessions
              </h1>
              
              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light"
                />
              </div>
            </div>
            
            {filteredSessions.length === 0 ? (
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-primary dark:text-primary-light mb-2">
                  {searchTerm ? 'No sessions found' : 'No sessions yet'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm ? 'Try a different search term' : 'Start your first work session from the dashboard'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-clean btn-primary-clean"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Screenshots
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Avg Productivity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {session.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(session.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {getSessionDuration(session)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Camera className="w-4 h-4 mr-1" />
                            {session.screenshots?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            <span className="text-gray-900 dark:text-gray-100">
                              {getAverageProductivity(session)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {session.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              <Play className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
