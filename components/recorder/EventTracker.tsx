'use client'

import { useEffect, useCallback, useRef } from 'react'
import { log } from '@/lib/logger'

interface EventTrackerProps {
  onCapture: (trigger: string, metadata?: any) => void
  isActive: boolean
}

export function EventTracker({ onCapture, isActive }: EventTrackerProps) {
  const lastEventTime = useRef<number>(0)
  const minEventInterval = 1000 // Minimum 1 second between captures
  
  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return
    
    // Throttle events
    const now = Date.now()
    if (now - lastEventTime.current < minEventInterval) {
      log.debug('Click throttled', { timeSinceLastEvent: now - lastEventTime.current })
      return
    }
    
    lastEventTime.current = now
    
    log.debug('Click detected', { x: e.clientX, y: e.clientY })
    
    const metadata = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      activeElement: (e.target as HTMLElement)?.tagName,
      activeText: (e.target as HTMLElement)?.innerText?.substring(0, 50),
      timestamp: new Date().toISOString()
    }
    
    onCapture('click', metadata)
  }, [isActive, onCapture])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isActive) return
    
    // Only capture specific keys
    if (e.key !== ' ' && e.key !== 'Enter') return
    
    // Throttle events
    const now = Date.now()
    if (now - lastEventTime.current < minEventInterval) {
      log.debug('Key press throttled', { key: e.key })
      return
    }
    
    lastEventTime.current = now
    
    log.debug('Key press detected', { key: e.key })
    
    const metadata = {
      key: e.key,
      activeElement: (document.activeElement as HTMLElement)?.tagName,
      activeId: (document.activeElement as HTMLElement)?.id,
      timestamp: new Date().toISOString()
    }
    
    onCapture(e.key === ' ' ? 'spacebar' : 'enter', metadata)
  }, [isActive, onCapture])

  // Handle window focus/blur to capture when user switches apps
  const handleFocusChange = useCallback((e: FocusEvent) => {
    if (!isActive) return

    const eventType = e.type
    log.debug('Focus change detected', { eventType })

    // Throttle events
    const now = Date.now()
    if (now - lastEventTime.current < minEventInterval) {
      return
    }
    
    lastEventTime.current = now
    
    const metadata = {
      focusEvent: eventType,
      activeElement: document.activeElement?.tagName,
      timestamp: new Date().toISOString(),
      reason: eventType === 'blur' ? 'user_switched_away' : 'user_returned'
    }
    
    onCapture(eventType === 'blur' ? 'window_blur' : 'window_focus', metadata)
  }, [isActive, onCapture])

  useEffect(() => {
    if (!isActive) return

    log.debug('Event tracker activated')
    
    // Store references to the actual handlers
    const clickHandler = handleClick
    const keyHandler = handleKeyPress
    const blurHandler = handleFocusChange
    const focusHandler = handleFocusChange
    
    // Add event listeners with options object for better cleanup
    const options = { capture: true, passive: true }
    document.addEventListener('click', clickHandler, options)
    document.addEventListener('keypress', keyHandler, options)
    
    // Window focus/blur events to detect app switching
    window.addEventListener('blur', blurHandler)
    window.addEventListener('focus', focusHandler)
    
    return () => {
      log.debug('Event tracker cleanup')
      document.removeEventListener('click', clickHandler, options)
      document.removeEventListener('keypress', keyHandler, options)
      window.removeEventListener('blur', blurHandler)
      window.removeEventListener('focus', focusHandler)
    }
  }, [isActive, handleClick, handleKeyPress, handleFocusChange])

  if (!isActive) return null

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-3">
      <p className="text-sm text-green-800 dark:text-green-400 font-medium">
        Event Tracking Active
      </p>
      <div className="text-xs text-green-700 dark:text-green-300 mt-1 space-y-1">
        <p>• Click anywhere in browser to capture screenshot</p>
        <p>• Press spacebar or enter to capture</p>
        <p>• Switching apps/windows triggers capture</p>
        <p>• Auto-capture every 30 seconds</p>
        <p>• All actions tracked (1 second cooldown)</p>
      </div>
    </div>
  )
}
