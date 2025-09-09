'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import { EventTracker } from './EventTracker'
import { log } from '@/lib/logger'

interface ScreenRecorderProps {
  sessionId: string
  userId: string
  onSessionEnd?: () => void
}

export function ScreenRecorder({ sessionId, userId, onSessionEnd }: ScreenRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const [videoState, setVideoState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sequenceRef = useRef(0)
  const captureQueueRef = useRef<Promise<void>>(Promise.resolve())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Persist recording state across page changes
  useEffect(() => {
    const savedState = localStorage.getItem(`recording_${sessionId}`)
    if (savedState) {
      const state = JSON.parse(savedState)
      if (state.isRecording) {
        // Try to restore recording state
        setIsRecording(true)
        setVideoState('ready')
        setCaptureCount(state.captureCount || 0)
        sequenceRef.current = state.sequenceNumber || 0
        log.info('Restored recording state after navigation', state)
      }
    }
  }, [sessionId])

  const captureScreenshot = useCallback(async (
    trigger: string, 
    metadata?: any
  ) => {
    // Queue captures to prevent race conditions
    captureQueueRef.current = captureQueueRef.current.then(async () => {
      try {
        // Check if we have a stream
        if (!streamRef.current) {
          log.warn('Capture skipped - no stream', { trigger })
          return
        }

        log.info('Attempting screenshot capture', { trigger })
        
        // Try real screen capture first, fallback to test screenshot
        let screenshot: string
        let captureWidth = 800
        let captureHeight = 600
        let isRealCapture = false
        
        try {
          if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
            const videoTrack = streamRef.current.getVideoTracks()[0]
            
            // Use ImageCapture API if available
            if ('ImageCapture' in window) {
              log.info('Using ImageCapture API for real screen capture')
              const imageCapture = new (window as any).ImageCapture(videoTrack)
              const bitmap = await imageCapture.grabFrame()
              
              const canvas = document.createElement('canvas')
              canvas.width = bitmap.width
              canvas.height = bitmap.height
              captureWidth = bitmap.width
              captureHeight = bitmap.height
              const ctx = canvas.getContext('2d')!
              ctx.drawImage(bitmap, 0, 0)
              
              // Add click indicator if available
              if (metadata?.mouseX && metadata?.mouseY) {
                const scaleX = canvas.width / window.innerWidth
                const scaleY = canvas.height / window.innerHeight
                const scaledX = metadata.mouseX * scaleX
                const scaledY = metadata.mouseY * scaleY
                
                ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'
                ctx.beginPath()
                ctx.arc(scaledX, scaledY, 20, 0, 2 * Math.PI)
                ctx.fill()
                
                ctx.strokeStyle = 'rgba(255, 0, 0, 1)'
                ctx.lineWidth = 3
                ctx.stroke()
              }
              
              screenshot = canvas.toDataURL('image/jpeg', 0.8)
              isRealCapture = true
              log.info('Real screen capture successful', { 
                dimensions: `${bitmap.width}x${bitmap.height}`,
                trigger 
              })
            } else {
              throw new Error('ImageCapture API not available')
            }
          } else {
            throw new Error('No video stream available')
          }
        } catch (realCaptureError: any) {
          log.warn('Real capture failed, using test screenshot', { 
            error: realCaptureError?.message || 'Unknown error',
            trigger 
          })
          
          // Fallback to test screenshot
          const canvas = document.createElement('canvas')
          canvas.width = 800
          canvas.height = 600
          captureWidth = 800
          captureHeight = 600
          const ctx = canvas.getContext('2d')!
          
          // Fill with gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, '#4F46E5')
          gradient.addColorStop(1, '#7C3AED')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Add text
          ctx.fillStyle = 'white'
          ctx.font = 'bold 24px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('OnlyWorks Test Screenshot', canvas.width / 2, canvas.height / 2 - 60)
          
          ctx.font = '18px Arial'
          ctx.fillText(`Trigger: ${trigger}`, canvas.width / 2, canvas.height / 2 - 20)
          ctx.fillText(`Sequence: ${sequenceRef.current + 1}`, canvas.width / 2, canvas.height / 2 + 20)
          ctx.fillText(`Time: ${new Date().toLocaleTimeString()}`, canvas.width / 2, canvas.height / 2 + 60)
          
          ctx.font = '14px Arial'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fillText('(Real capture failed - using test mode)', canvas.width / 2, canvas.height / 2 + 100)
          
          // Add click indicator if available
          if (metadata?.mouseX && metadata?.mouseY) {
            const scaleX = canvas.width / window.innerWidth
            const scaleY = canvas.height / window.innerHeight
            const scaledX = metadata.mouseX * scaleX
            const scaledY = metadata.mouseY * scaleY
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, 15, 0, 2 * Math.PI)
            ctx.fill()
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
            ctx.lineWidth = 2
            ctx.stroke()
          }
          
          screenshot = canvas.toDataURL('image/jpeg', 0.8)
        }
        sequenceRef.current += 1
        
        log.info('Uploading screenshot to backend...', {
          sequenceNumber: sequenceRef.current,
          trigger,
          sessionId
        })
        
        // Upload the screenshot
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
              canvasWidth: captureWidth,
              canvasHeight: captureHeight,
              isTestCapture: !isRealCapture
            }
          })
        })
        
        log.info('Backend response received', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })
        
        const result = await response.json()
        log.info('Backend response data', result)
        
        if (response.ok && result.success) {
          setCaptureCount(prev => prev + 1)
          log.info('✅ Test screenshot captured successfully!', { 
            id: result.screenshot?.id, 
            sequence: sequenceRef.current,
            dimensions: `${captureWidth}x${captureHeight}`,
            backendResponse: result
          })
          toast.success(`📸 Screenshot ${sequenceRef.current} saved!`)
        } else {
          log.error('❌ Screenshot upload failed', { 
            result, 
            status: response.status,
            statusText: response.statusText 
          })
          toast.error(`Failed to save screenshot: ${result?.error || 'Unknown error'}`)
        }

      } catch (error) {
        log.error('Screenshot capture failed', { error, trigger })
        toast.error('Screenshot capture failed')
      }
    })
  }, [sessionId])

  const startRecording = async () => {
    try {
      log.info('Starting screen recording')
      setVideoState('loading')
      
      // Request full screen capture with explicit settings
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          cursor: 'always',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      })
      
      streamRef.current = stream
      
      // Set up video element (for potential future use)
      if (videoRef.current) {
        const video = videoRef.current
        video.srcObject = stream
        video.load()
      }
      
      setIsRecording(true)
      setVideoState('ready')
      setCaptureCount(0)
      sequenceRef.current = 0
      
      // Handle stream end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        log.info('Screen share ended by user')
        stopRecording()
      })
      
      // Take initial screenshot
      setTimeout(() => {
        log.info('Taking initial test screenshot')
        captureScreenshot('session_start')
      }, 1000)

      // Start automatic screenshot capturing every 30 seconds for desktop activity
      intervalRef.current = setInterval(() => {
        if (streamRef.current && isRecording) {
          log.info('Taking automatic screenshot')
          captureScreenshot('automatic', { 
            reason: 'periodic_capture',
            interval: '30s'
          })
        }
      }, 30000) // 30 seconds

      // Save recording state
      localStorage.setItem(`recording_${sessionId}`, JSON.stringify({
        isRecording: true,
        captureCount: 0,
        sequenceNumber: 0,
        startTime: new Date().toISOString()
      }))
      
      toast.success('Recording started! Capturing desktop every 30 seconds + browser clicks.')
      
      // Check what type of source was selected
      const videoTrack = stream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()
      log.info('Screen capture source selected', {
        displaySurface: (settings as any).displaySurface,
        width: settings.width,
        height: settings.height,
        frameRate: settings.frameRate
      })
      
      // Warn if browser tab was selected instead of screen
      if ((settings as any).displaySurface === 'browser') {
        toast.error('⚠️ Browser tab selected - please select "Entire Screen" for full desktop capture', {
          duration: 8000
        })
      }
      
    } catch (error: any) {
      log.error('Failed to start recording', error)
      setVideoState('error')
      
      if (error.name === 'NotAllowedError') {
        toast.error('Screen sharing cancelled. Please click "Start Recording" again and select "Entire Screen".')
      } else if (error.name === 'NotFoundError') {
        toast.error('No screen capture device found. Please check your system permissions.')
      } else {
        toast.error('Failed to start recording. Please allow screen sharing and select "Entire Screen".')
      }
    }
  }

  const stopRecording = async () => {
    log.info('Stopping recording', { captureCount })
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Clear automatic screenshot interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Clear recording state from localStorage
    localStorage.removeItem(`recording_${sessionId}`)
    
    setIsRecording(false)
    setVideoState('idle')
    
    // End session
    try {
      const endResponse = await fetch('/api/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      if (endResponse.ok) {
        const endResult = await endResponse.json()
        log.info('Session ended', endResult)
        
        if (endResult.screenshotCount > 0) {
          toast.success(`Session saved with ${endResult.screenshotCount} screenshots`)
        } else {
          toast('Session ended with no screenshots captured')
        }
      }
    } catch (error) {
      log.error('Failed to end session', error)
    }
    
    // Cleanup
    setCaptureCount(0)
    sequenceRef.current = 0
    
    if (onSessionEnd) {
      onSessionEnd()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Screen Recording
      </h3>
      
      {!isRecording ? (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Share your screen to start tracking productivity.
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
          {/* Video element for potential future use */}
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-sm border rounded bg-gray-100"
            style={{ maxHeight: '200px' }}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {captureCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Screenshots</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {videoState}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            </div>
          </div>

          {/* Debug info */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
            <p>Debug Info:</p>
            <p>• Recording: {isRecording ? 'Yes' : 'No'}</p>
            <p>• Video State: {videoState}</p>
            <p>• Has Stream: {streamRef.current ? 'Yes' : 'No'}</p>
            <p>• Sequence: {sequenceRef.current}</p>
          </div>

          <EventTracker 
            onCapture={captureScreenshot} 
            isActive={isRecording && videoState === 'ready'} 
          />

          {/* Test button */}
          <button
            onClick={() => captureScreenshot('manual-test')}
            className="w-full btn-clean bg-blue-600 hover:bg-blue-700 text-white mb-2"
            disabled={!isRecording || videoState !== 'ready'}
          >
            📸 Test Screenshot Capture
          </button>

          <button
            onClick={stopRecording}
            className="w-full btn-clean bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </button>
        </div>
      )}
    </div>
  )
}