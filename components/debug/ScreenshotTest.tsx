'use client'

import { useState } from 'react'

interface ScreenshotTestProps {
  sessionId: string
}

export function ScreenshotTest({ sessionId }: ScreenshotTestProps) {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testClientScreenshot = async () => {
    setIsLoading(true)
    setTestResult('Testing client-side screenshot...')

    try {
      // Create a test canvas and screenshot
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')!
      
      // Draw a simple test image
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 50, 50)
      ctx.fillStyle = 'blue'
      ctx.fillRect(50, 0, 50, 50)
      ctx.fillStyle = 'green'
      ctx.fillRect(0, 50, 50, 50)
      ctx.fillStyle = 'yellow'
      ctx.fillRect(50, 50, 50, 50)
      
      const screenshot = canvas.toDataURL('image/jpeg', 0.8)
      
      setTestResult('Created test image, sending to API...')
      
      // Send to screenshot API
      const response = await fetch('/api/screenshots/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenshot,
          sessionId,
          trigger: 'client-test',
          metadata: {
            sequenceNumber: 1,
            timestamp: new Date().toISOString(),
            test: true
          }
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Client screenshot test passed! ID: ${result.screenshot?.id}`)
      } else {
        setTestResult(`❌ Client screenshot test failed: ${result.error}`)
      }
      
    } catch (error) {
      setTestResult(`❌ Client test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testServerScreenshot = async () => {
    setIsLoading(true)
    setTestResult('Testing server-side screenshot...')

    try {
      const response = await fetch('/api/test/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Server screenshot test passed! ID: ${result.screenshot?.id}`)
      } else {
        setTestResult(`❌ Server screenshot test failed: ${result.error} - ${result.details}`)
      }
      
    } catch (error) {
      setTestResult(`❌ Server test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-2">
      <h4 className="font-semibold text-sm mb-2">Screenshot Tests</h4>
      
      <div className="flex gap-2 mb-2">
        <button 
          onClick={testServerScreenshot}
          disabled={isLoading}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
        >
          Test Server
        </button>
        <button 
          onClick={testClientScreenshot}
          disabled={isLoading}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          Test Client
        </button>
      </div>
      
      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
          {testResult}
        </div>
      )}
    </div>
  )
}
