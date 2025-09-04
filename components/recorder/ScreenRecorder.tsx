'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Square, Pause, Play, AlertCircle, CheckCircle, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'

interface ScreenRecorderProps {
  sessionId: string
  onCapture?: (screenshot: string) => void
}

export function ScreenRecorder({ sessionId, onCapture }: ScreenRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const [lastCapture, setLastCapture] = useState<string>('')
  const [backgroundApps, setBackgroundApps] = useState<string[]>([])
  
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check for background apps (this is a simplified version)
  const checkBackgroundApps = async () => {
    try {
      const response = await fetch('/api/system/apps')
      const data = await response.json()
      if (data.apps) {
        setBackgroundApps(data.apps)
      }
    } catch (error) {
      console.log('Could not fetch background apps')
    }
  }

  useEffect(() => {
    checkBackgroundApps()
    const interval = setInterval(checkBackgroundApps, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const captureScreenshot = useCallback(async () => {
    if (!mediaStreamRef.current || isPaused) {
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas) {
        // Create video element if it doesn't exist
        if (!video) {
          const newVideo = document.createElement('video')
          newVideo.autoplay = true
          newVideo.muted = true
          newVideo.playsInline = true
          videoRef.current = newVideo
        }
        
        // Create canvas if it doesn't exist
        if (!canvas) {
          const newCanvas = document.createElement('canvas')
          canvasRef.current = newCanvas
        }
        return
      }

      // Set video source
      if (video.srcObject !== mediaStreamRef.current) {
        video.srcObject = mediaStreamRef.current
        await video.play()
        // Wait for video to be ready
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Set canvas dimensions
      canvas.width = video.videoWidth || 1920
      canvas.height = video.videoHeight || 1080

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to base64
      const screenshot = canvas.toDataURL('image/jpeg', 0.8)

      // Send to API with background apps info
      const response = await fetch('/api/screenshots/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshot,
          sessionId,
          trigger: 'auto',
          backgroundApps
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save screenshot')
      }

      const data = await response.json()
      
      setCaptureCount(prev => prev + 1)
      setLastCapture(new Date().toLocaleTimeString())
      onCapture?.(screenshot)
      
      console.log('Screenshot captured successfully:', data)
      
    } catch (error) {
      console.error('Screenshot capture error:', error)
      toast.error('Failed to capture screenshot')
    }
  }, [sessionId, isPaused, onCapture, backgroundApps])

  const startRecording = async () => {
    try {
      // Request screen capture permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always'
        },
        audio: false
      })

      mediaStreamRef.current = stream
      setIsRecording(true)
      toast.success('Recording started - screenshots every 30 seconds')

      // Create hidden video and canvas elements
      const video = document.createElement('video')
      video.autoplay = true
      video.muted = true
      video.playsInline = true
      video.style.display = 'none'
      videoRef.current = video
      
      const canvas = document.createElement('canvas')
      canvas.style.display = 'none'
      canvasRef.current = canvas

      // Capture first screenshot after 2 seconds
      setTimeout(captureScreenshot, 2000)

      // Set up interval for automatic captures
      intervalRef.current = setInterval(captureScreenshot, 30000)

      // Handle stream end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording()
      })

    } catch (error) {
      console.error('Failed to start recording:', error)
      toast.error('Failed to start screen recording. Please allow screen sharing.')
    }
  }

  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsRecording(false)
    setIsPaused(false)
    
    if (captureCount > 0) {
      toast.success(`Recording stopped. Captured ${captureCount} screenshots.`)
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    toast.success(isPaused ? 'Recording resumed' : 'Recording paused')
  }

  const manualCapture = () => {
    if (isRecording && !isPaused) {
      captureScreenshot()
      toast.success('Manual screenshot captured')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Screen Recorder
        </h2>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
          </div>
        )}
      </div>

      {/* Status Display */}
      {isRecording && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-300">
                  {captureCount} screenshots captured
                </p>
                {lastCapture && (
                  <p className="text-green-700 dark:text-green-400">
                    Last capture: {lastCapture}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Apps Display */}
      {backgroundApps.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3 mb-4">
          <div className="flex items-start">
            <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
            <div className="text-sm flex-1">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Active Applications:
              </p>
              <p className="text-blue-700 dark:text-blue-400">
                {backgroundApps.slice(0, 5).join(', ')}
                {backgroundApps.length > 5 && ` +${backgroundApps.length - 5} more`}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </button>
            <button
              onClick={togglePause}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={manualCapture}
              disabled={isPaused}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Now
            </button>
          </>
        )}
      </div>
    </div>
  )
}
