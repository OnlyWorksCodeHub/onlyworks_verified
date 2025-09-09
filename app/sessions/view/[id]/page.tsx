'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Download } from 'lucide-react'
import Image from 'next/image'

export default function ViewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [screenshots, setScreenshots] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchSession()
  }, [params.id])

  const fetchSession = async () => {
    const { data: sessionData } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (sessionData) {
      setSession(sessionData)
      
      // Fetch screenshots
      const { data: screenshotData } = await supabase
        .from('screenshots')
        .select('*')
        .eq('session_id', params.id)
        .order('sequence_number', { ascending: true })
      
      if (screenshotData) {
        setScreenshots(screenshotData)
      }
    }
  }

  if (!session) return <div className="min-h-screen bg-[#0A0A0A] text-white p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">{session.name}</h1>
          <div className="text-gray-400">
            <p>Created: {new Date(session.created_at).toLocaleString()}</p>
            <p>Status: {session.status}</p>
            <p>Screenshots: {screenshots.length}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-4">Screenshots</h2>
        
        {screenshots.length === 0 ? (
          <p className="text-gray-400">No screenshots in this session</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => (
              <div key={screenshot.id} className="bg-[#1A1A1A] border border-gray-800 rounded-lg overflow-hidden">
                <img
                  src={screenshot.image_url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2">
                  <p className="text-xs text-gray-400">#{screenshot.sequence_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
