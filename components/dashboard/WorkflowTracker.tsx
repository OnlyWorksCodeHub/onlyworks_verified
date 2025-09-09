'use client'

import { useState, useRef } from 'react'
import { Play, Square, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function WorkflowTracker() {
  const [isTracking, setIsTracking] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [screenshotCount, setScreenshotCount] = useState(0)
  const [sessionName, setSessionName] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const supabase = createClient()

  const startTracking = async () => {
    if (!sessionName.trim()) {
      toast.error('Enter a session name')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Not logged in')
        return
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const { data: session, error } = await supabase
        .from('workflow_sessions')
        .insert({
          user_id: user.id,
          name: sessionName,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      setSessionId(session.id)
      setIsTracking(true)
      setScreenshotCount(0)
      
      toast.success('Recording started!')
      
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopTracking()
      })
    } catch (error: any) {
      toast.error('Failed to start')
    }
  }

  const captureScreenshot = async () => {
    if (!videoRef.current || !sessionId) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(videoRef.current, 0, 0)
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
      })

      // FIXED: Use flat filename, no folders
      const fileName = `${Date.now()}.jpg`
      
      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, blob)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName)

      await supabase
        .from('screenshots')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          image_url: publicUrl,
          trigger_type: 'manual',
          sequence_number: screenshotCount + 1
        })

      setScreenshotCount(prev => prev + 1)
      toast.success(`Screenshot ${screenshotCount + 1} captured!`)
      
    } catch (error: any) {
      toast.error('Failed to capture')
    }
  }

  const stopTracking = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (sessionId) {
      await supabase
        .from('workflow_sessions')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId)
    }

    setIsTracking(false)
    setSessionId(null)
    setScreenshotCount(0)
    setSessionName('')
    toast.success('Session ended!')
  }

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Workflow Tracker</h2>
      
      {!isTracking ? (
        <div className="space-y-4">
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name..."
            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white"
          />
          
          <button
            onClick={startTracking}
            disabled={!sessionName.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] disabled:opacity-50"
          >
            <Play className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500 rounded">
            <span className="text-green-500">● Recording</span>
            <span className="text-white">{screenshotCount} screenshots</span>
          </div>
          
          <div className="aspect-video bg-black rounded overflow-hidden">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-contain" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={captureScreenshot}
              className="flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Camera className="w-5 h-5" />
              <span>Capture</span>
            </button>
            
            <button
              onClick={stopTracking}
              className="flex items-center justify-center space-x-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
