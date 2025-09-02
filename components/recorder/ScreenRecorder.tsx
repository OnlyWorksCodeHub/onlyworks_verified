'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Pause, Square, Monitor, Shield, Eye, EyeOff, MousePointer } from 'lucide-react'
import toast from 'react-hot-toast'

interface RecorderProps {
  sessionId: string
  userId: string
}

export function ScreenRecorder({ sessionId, userId }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [screenshotCount, setScreenshotCount] = useState(0)
  const [privacyMode, setPrivacyMode] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastCaptureTime = useRef<number>(0)
  const scrollTimer = useRef<NodeJS.Timeout | null>(null)

  const captureScreenshot = useCallback(async (trigger: string = 'user_action') => {
    if (!streamRef.current || !videoRef.current || isPaused || privacyMode) return

    // Rate limiting - minimum 200ms between captures
    const now = Date.now()
    if (now - lastCaptureTime.current < 200) return
    lastCaptureTime.current = now

    try {
      const video = videoRef.current
      
      if (video.readyState < 2) {
        await new Promise(resolve => {
          video.addEventListener('loadeddata', resolve, { once: true })
        })
      }

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        
        // Add timestamp
        ctx.fillStyle = 'rgba(121, 22, 255, 0.8)'
        ctx.fillRect(10, 10, 200, 30)
        ctx.fillStyle = 'white'
        ctx.font = '14px monospace'
        ctx.fillText(new Date().toLocaleTimeString(), 20, 30)
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const reader = new FileReader()
            reader.onloadend = async () => {
              const base64 = reader.result?.toString().split(',')[1]
              
              if (base64) {
                const formData = new FormData()
                formData.append('screenshot', blob)
                formData.append('sessionId', sessionId)
                formData.append('userId', userId)
                formData.append('base64', base64)
                formData.append('trigger', trigger)
                
                try {
                  const response = await fetch('/api/screenshots/capture', {
                    method: 'POST',
                    body: formData,
                  })
                  
                  if (response.ok) {
                    setScreenshotCount(prev => prev + 1)
                  }
                } catch (error) {
                  console.error('Upload error:', error)
                }
              }
            }
            reader.readAsDataURL(blob)
          }
        }, 'image/jpeg', 0.6)
      }
    } catch (error) {
      console.error('Screenshot error:', error)
    }
  }, [sessionId, userId, isPaused, privacyMode])

  // Aggressive event capturing
  useEffect(() => {
    if (!isRecording || isPaused || privacyMode) return

    // Capture on click
    const handleClick = () => {
      captureScreenshot('click')
    }

    // Capture on spacebar
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        captureScreenshot('spacebar')
      }
      // Also capture on Enter and Tab
      if (e.code === 'Enter' || e.code === 'Tab') {
        captureScreenshot(`key_${e.code}`)
      }
    }

    // Capture when scrolling stops (user is reading)
    const handleScroll = () => {
      captureScreenshot('scroll')
      
      // Clear existing timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current)
      }
      
      // Set new timer - capture when user stops scrolling for 1 second
      scrollTimer.current = setTimeout(() => {
        captureScreenshot('scroll_stop_reading')
      }, 1000)
    }

    // Capture on mouse movement stop (indicates focus)
    let mouseTimer: NodeJS.Timeout
    const handleMouseMove = () => {
      clearTimeout(mouseTimer)
      mouseTimer = setTimeout(() => {
        captureScreenshot('mouse_stop')
      }, 2000)
    }

    // Capture on focus changes
    const handleFocus = () => captureScreenshot('focus')
    const handleBlur = () => captureScreenshot('blur')

    // Add all listeners
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyPress, true)
    window.addEventListener('scroll', handleScroll, true)
    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Also capture every 30 seconds as baseline
    const interval = setInterval(() => {
      captureScreenshot('interval')
    }, 30000)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyPress, true)
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      clearInterval(interval)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      clearTimeout(mouseTimer)
    }
  }, [isRecording, isPaused, privacyMode, captureScreenshot])

  const startRecording = async () => {
    try {
      const confirmed = window.confirm(
        'Screen recording will capture your screen:\n\n' +
        '• On every click\n' +
        '• On every spacebar press\n' +
        '• When you stop scrolling (reading)\n' +
        '• When switching windows\n' +
        '• Every 30 seconds\n\n' +
        'You can pause anytime. Continue?'
      )
      
      if (!confirmed) return

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } as any,
        audio: false
      })
      
      streamRef.current = stream
      
      if (!videoRef.current) {
        videoRef.current = document.createElement('video')
      }
      videoRef.current.srcObject = stream
      videoRef.current.play()
      
      setIsRecording(true)
      setScreenshotCount(0)
      setPrivacyMode(false)
      
      setTimeout(() => captureScreenshot('start'), 1000)
      
      toast.success('Recording started! Capturing all interactions.')
      
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording()
      })
    } catch (error) {
      toast.error('Recording cancelled or failed.')
      console.error(error)
    }
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setIsRecording(false)
    setIsPaused(false)
    setPrivacyMode(false)
    
    if (screenshotCount > 0) {
      toast.success(`Session complete! ${screenshotCount} screenshots captured.`)
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    toast.success(isPaused ? 'Recording resumed' : 'Recording paused')
  }

  const togglePrivacyMode = () => {
    setPrivacyMode(!privacyMode)
    if (!privacyMode) {
      toast.success('Privacy mode ON - screenshots disabled', { icon: '🔒', duration: 4000 })
    } else {
      toast.success('Privacy mode OFF - screenshots resumed')
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary tracking-tight flex items-center">
          <Monitor className="w-5 h-5 mr-2" />
          Productivity Tracker
        </h3>
        {isRecording && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${isPaused || privacyMode ? 'bg-yellow-500' : 'bg-green-500'} rounded-full ${!isPaused && !privacyMode && 'animate-pulse'}`}></div>
              <span className="text-sm text-gray-600">
                {privacyMode ? 'Privacy Mode' : isPaused ? 'Paused' : 'Active'}
              </span>
            </div>
            <span className="text-sm font-medium text-primary">
              {screenshotCount} captured
            </span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!sessionId}
            className="flex-1 btn-clean btn-primary-clean"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Tracking
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-sm hover:bg-yellow-600 transition flex items-center justify-center"
            >
              {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
              onClick={togglePrivacyMode}
              className={`flex-1 ${privacyMode ? 'bg-gray-600' : 'bg-gray-500'} text-white py-2 px-3 rounded-sm hover:bg-gray-700 transition flex items-center justify-center`}
            >
              {privacyMode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Privacy
            </button>
            
            <button
              onClick={stopRecording}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-sm hover:bg-red-600 transition flex items-center justify-center"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </button>
          </>
        )}
      </div>
      
      <div className="bg-purple-50 rounded-sm p-4 space-y-2">
        <div className="flex items-start space-x-2">
          <MousePointer className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-semibold">Capture Triggers:</p>
            <ul className="ml-4 space-y-0.5 text-xs">
              <li>• Every click anywhere on screen</li>
              <li>• Every spacebar press</li>
              <li>• When you stop scrolling (reading)</li>
              <li>• Tab/Enter key presses</li>
              <li>• Window focus changes</li>
              <li>• Every 30 seconds baseline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
