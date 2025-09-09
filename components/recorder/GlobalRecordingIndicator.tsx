'use client'

import { useState, useEffect } from 'react'
import { Camera, Square, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface GlobalRecordingIndicatorProps {
  sessionId?: string
}

export function GlobalRecordingIndicator({ sessionId }: GlobalRecordingIndicatorProps) {
  const [isGloballyRecording, setIsGloballyRecording] = useState(false)
  const [recordingSession, setRecordingSession] = useState<string | null>(null)

  useEffect(() => {
    // Check for any active recording across the app
    const checkGlobalRecording = () => {
      const keys = Object.keys(localStorage)
      const recordingKeys = keys.filter(key => key.startsWith('recording_'))
      
      if (recordingKeys.length > 0) {
        const activeSession = recordingKeys[0].replace('recording_', '')
        setRecordingSession(activeSession)
        setIsGloballyRecording(true)
      } else {
        setIsGloballyRecording(false)
        setRecordingSession(null)
      }
    }

    // Check immediately
    checkGlobalRecording()

    // Check periodically in case of changes from other tabs
    const interval = setInterval(checkGlobalRecording, 1000)

    return () => clearInterval(interval)
  }, [])

  const stopGlobalRecording = async () => {
    if (!recordingSession) return

    try {
      const response = await fetch('/api/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: recordingSession })
      })

      if (response.ok) {
        localStorage.removeItem(`recording_${recordingSession}`)
        setIsGloballyRecording(false)
        setRecordingSession(null)
        toast.success('Recording stopped from navigation')
        window.location.reload() // Refresh to update UI
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      toast.error('Failed to stop recording')
    }
  }

  if (!isGloballyRecording || sessionId === recordingSession) {
    return null // Don't show if not recording or on the same session page
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
      <Camera className="w-4 h-4" />
      <span className="text-sm font-medium">Recording Active</span>
      <AlertCircle className="w-4 h-4" />
      <button
        onClick={stopGlobalRecording}
        className="ml-2 bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs flex items-center"
      >
        <Square className="w-3 h-3 mr-1" />
        Stop
      </button>
    </div>
  )
}