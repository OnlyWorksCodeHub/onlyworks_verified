'use client'

import { useState } from 'react'

interface DebugProps {
  isRecording: boolean
  captureCount: number
  sessionId: string
}

export function RecordingDebug({ isRecording, captureCount, sessionId }: DebugProps) {
  const [testResult, setTestResult] = useState<string>('')

  const runFullTest = async () => {
    setTestResult('Testing...')
    
    try {
      // Test 1: Basic API
      const apiResponse = await fetch('/api/debug/screenshot')
      const apiData = await apiResponse.json()
      
      if (!apiResponse.ok) {
        setTestResult(`API Test Failed: ${apiData.error}`)
        return
      }

      // Test 2: Screenshot storage/database
      const screenshotResponse = await fetch('/api/test/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      const screenshotData = await screenshotResponse.json()
      
      if (screenshotResponse.ok) {
        setTestResult(`✅ All tests passed! Screenshot saved: ${screenshotData.screenshot?.id}`)
      } else {
        setTestResult(`❌ Screenshot test failed: ${screenshotData.error} - ${screenshotData.details}`)
      }
      
    } catch (error) {
      setTestResult(`❌ Test error: ${error}`)
    }
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">System Test</h4>
        <button 
          onClick={runFullTest}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Run Test
        </button>
      </div>
      
      <div className="text-xs space-y-1">
        <p>Recording: {isRecording ? '✅' : '❌'}</p>
        <p>Session ID: {sessionId}</p>
        <p>Captures: {captureCount}</p>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="font-mono">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
