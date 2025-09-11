'use client'

import { useEffect, useCallback } from 'react'

interface EventTrackerProps {
  onCapture: (trigger: string, metadata?: any) => void
  isActive: boolean
}

export function EventTracker({ onCapture, isActive }: EventTrackerProps) {
  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return
    
    // Get click position relative to screen
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
    
    if (e.key === ' ' || e.key === 'Enter') {
      const metadata = {
        key: e.key,
        activeElement: (document.activeElement as HTMLElement)?.tagName,
        activeId: (document.activeElement as HTMLElement)?.id,
        timestamp: new Date().toISOString()
      }
      
      onCapture(e.key === ' ' ? 'spacebar' : 'enter', metadata)
    }
  }, [isActive, onCapture])

  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keypress', handleKeyPress)
      
      return () => {
        document.removeEventListener('click', handleClick)
        document.removeEventListener('keypress', handleKeyPress)
      }
    }
  }, [isActive, handleClick, handleKeyPress])

  if (!isActive) return null

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm p-3">
      <p className="text-sm text-green-800 dark:text-green-400 font-medium">
        Tracking Active
      </p>
      <div className="text-xs text-green-700 dark:text-green-300 mt-1 space-y-1">
        <p>• Click anywhere to capture with position</p>
        <p>• Press spacebar or enter to capture</p>
        <p>• All actions are being recorded</p>
      </div>
    </div>
  )
}
