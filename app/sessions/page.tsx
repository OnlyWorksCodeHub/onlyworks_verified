'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Eye, Trash2 } from 'lucide-react'

export default function SessionsPage() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchSessions()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('workflow_sessions')
      .select('*, screenshots(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setSessions(data)
    }
    setLoading(false)
  }

  const deleteSession = async (id: string) => {
    await supabase.from('workflow_sessions').delete().eq('id', id)
    fetchSessions()
  }

  const viewSession = (id: string) => {
    router.push(`/sessions/view/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Sessions</h1>
            
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">No sessions yet. Start recording to see them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold">{session.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(session.created_at).toLocaleString()} • 
                        {session.screenshots?.[0]?.count || 0} screenshots • 
                        Status: {session.status}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewSession(session.id)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
