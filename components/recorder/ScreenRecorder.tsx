'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Square, Pause, Play, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ScreenRecorderProps {
  sessionId: string
}

export function ScreenRecorder({ sessionId }: ScreenRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const captureScreenshot = useCallback(async () => {
    if (!mediaStreamRef.current || isPaused) return

    try {
      // Create video element if needed
      let video = videoRef.current
      if (!video) {
        video = document.createElement('video')
        video.autoplay = true
        video.muted = true
        video.playsInline = true
        video.style.display = 'none'
        document.body.appendChild(video)
        videoRef.current = video
      }
      
      // Create canvas if needed
      let canvas = canvasRef.current
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.style.display = 'none'
        document.body.appendChild(canvas)
        canvasRef.current = canvas
      }

      // Set video source
      if (video.srcObject !== mediaStreamRef.current) {
        video.srcObject = mediaStreamRef.current
        await video.play()
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Set canvas dimensions and draw
      canvas.width = video.videoWidth || 1920
      canvas.height = video.videoHeight || 1080
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error('Could not get canvas context')
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const screenshot = canvas.toDataURL('image/jpeg', 0.8)

      // Send to API
      const response = await fetch('/api/screenshots/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenshot, sessionId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save screenshot')
      }

      setCaptureCount(prev => prev + 1)
      console.log('Screenshot captured successfully')
      
    } catch (error) {
      console.error('Screenshot capture error:', error)
    }
  }, [sessionId, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          cursor: 'always'
        } as DisplayMediaStreamConstraints['video'],
        audio: false
      })

      mediaStreamRef.current = stream
      setIsRecording(true)
      toast.success('Recording started - screenshots every 30 seconds')

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

    // Clean up video and canvas elements
    if (videoRef.current && videoRef.current.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current)
      videoRef.current = null
    }
    if (canvasRef.current && canvasRef.current.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current)
      canvasRef.current = null
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
      // Clean up DOM elements
      if (videoRef.current && videoRef.current.parentNode) {
        videoRef.current.parentNode.removeChild(videoRef.current)
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current)
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

      {isRecording && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-3 mb-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-sm text-green-800 dark:text-green-300">
              {captureCount} screenshots captured
            </p>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
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
