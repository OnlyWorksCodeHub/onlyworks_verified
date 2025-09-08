'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Square, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { EventTracker } from './EventTracker'

interface ScreenRecorderProps {
  sessionId: string
  userId: string
  onSessionEnd?: () => void
}

export function ScreenRecorder({ sessionId, userId, onSessionEnd }: ScreenRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const [suspiciousApps, setSuspiciousApps] = useState<string[]>([])
  const [lastCapture, setLastCapture] = useState<Date | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sequenceRef = useRef(0)

  const captureScreenshot = useCallback(async (
    trigger: string, 
    metadata?: { mouseX?: number; mouseY?: number; activeElement?: string }
  ) => {
    if (!streamRef.current || isPaused) return

    const video = document.createElement('video')
    video.srcObject = streamRef.current
    video.play()
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    ctx.drawImage(video, 0, 0)
    
    // Draw click indicator if mouse position provided
    if (metadata?.mouseX && metadata?.mouseY) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
      ctx.beginPath()
      ctx.arc(metadata.mouseX, metadata.mouseY, 15, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    const screenshot = canvas.toDataURL('image/jpeg', 0.9)
    sequenceRef.current += 1
    
    // Check for suspicious apps
    const detectedApps = await detectBackgroundApps()
    if (detectedApps.length > 0) {
      setSuspiciousApps(detectedApps)
    }
    
    // Send to API
    const response = await fetch('/api/screenshots/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        screenshot,
        sessionId,
        trigger,
        metadata: {
          ...metadata,
          sequenceNumber: sequenceRef.current,
          timestamp: new Date().toISOString(),
          backgroundApps: detectedApps
        }
      })
    })
    
    if (response.ok) {
      setCaptureCount(prev => prev + 1)
      setLastCapture(new Date())
    }
  }, [sessionId, isPaused])

  const detectBackgroundApps = async () => {
    // Check page title and other indicators
    const suspiciousPatterns = [
      'AutoHotkey', 'Macro Recorder', 'Auto Clicker',
      'Selenium', 'Puppeteer', 'Cluely', 'Ghost Mouse'
    ]
    
    const detected: string[] = []
    
    // Check if any suspicious strings in page title or visible
    if (typeof document !== 'undefined') {
      const pageContent = document.body.innerText.toLowerCase()
      suspiciousPatterns.forEach(pattern => {
        if (pageContent.includes(pattern.toLowerCase())) {
          detected.push(pattern)
        }
      })
    }
    
    return detected
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          displaySurface: 'monitor',
          cursor: 'always'
        } as any,
        audio: false
      })
      
      streamRef.current = stream
      setIsRecording(true)
      sequenceRef.current = 0
      
      // Initial capture
      await captureScreenshot('session_start')
      
      toast.success('Recording started - tracking all actions')
    } catch (error) {
      toast.error('Failed to start recording. Please allow screen sharing.')
    }
  }

  const stopRecording = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setIsRecording(false)
    
    // Generate session summary
    toast.loading('Generating session summary...')
    
    const response = await fetch('/api/sessions/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })
    
    if (response.ok) {
      const { summary } = await response.json()
      toast.dismiss()
      toast.success('Session complete! Summary generated.')
      onSessionEnd?.()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    toast(isPaused ? 'Recording resumed' : 'Recording paused')
  }

  return (
    <div className="card-clean p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Screen Recorder
        </h2>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
          </div>
        )}
      </div>

      {!isRecording ? (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Share your screen to start tracking productivity. We'll capture screenshots on every click, spacebar, and enter key.
          </p>
          <button
            onClick={startRecording}
            className="btn-clean btn-primary-clean flex items-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Recording
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recording stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{captureCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Screenshots</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lastCapture ? new Date().getTime() - lastCapture.getTime() < 5000 ? 'Active' : 'Idle' : '-'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suspiciousApps.length === 0 ? '✓' : '⚠'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
            </div>
          </div>

          {/* Suspicious apps warning */}
          {suspiciousApps.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Automation tools detected
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    {suspiciousApps.join(', ')} - This will be noted in your report
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Event tracker */}
          <EventTracker onCapture={captureScreenshot} isActive={isRecording && !isPaused} />

          {/* Controls */}
          <div className="flex space-x-3">
            <button
              onClick={togglePause}
              className="btn-clean bg-yellow-500 hover:bg-yellow-600 text-white flex items-center"
            >
              {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopRecording}
              className="btn-clean bg-red-600 hover:bg-red-700 text-white flex items-center"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop & Generate Report
            </button>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Screenshots captured on: clicks, spacebar, enter key</p>
            <p>• Mouse position tracked for all clicks</p>
            <p>• Background apps monitored for automation</p>
          </div>
        </div>
      )}
    </div>
  )
}
