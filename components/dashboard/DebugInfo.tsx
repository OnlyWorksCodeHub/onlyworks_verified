'use client'

import { useState, useEffect } from 'react'

export function DebugInfo() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/stats')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Debug fetch error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading debug info...</div>

  return (
    <div className="bg-gray-100 rounded-sm p-4 mt-6">
      <h3 className="font-semibold mb-2">Debug Info:</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(data?.debug, null, 2)}
      </pre>
      <p className="text-xs mt-2">
        Screenshots: {data?.screenshots?.length || 0} | 
        Analyses: {data?.analyses?.length || 0} | 
        Sessions: {data?.sessions?.length || 0}
      </p>
      {data?.screenshots?.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold">Latest Screenshot:</p>
          <p className="text-xs">{data.screenshots[0].image_url}</p>
        </div>
      )}
    </div>
  )
}
