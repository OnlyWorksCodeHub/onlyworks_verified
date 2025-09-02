'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera } from 'lucide-react'

interface RecentScreenshotsProps {
  userId: string
}

export function RecentScreenshots({ userId }: RecentScreenshotsProps) {
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (userId) {
      loadScreenshots()
    }
  }, [userId])

  const loadScreenshots = async () => {
    try {
      const { data } = await supabase
        .from('screenshots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(6)

      setScreenshots(data || [])
    } catch (error) {
      console.error('Error loading screenshots:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-light mb-4">Recent Screenshots</h2>
        <div className="animate-pulse grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
      <h2 className="text-lg font-semibold text-primary dark:text-primary-light tracking-tight mb-4">Recent Screenshots</h2>
      
      {screenshots.length === 0 ? (
        <div className="text-center py-8">
          <Camera className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No screenshots yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start recording to capture screenshots</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {screenshots.map((screenshot) => (
            <div key={screenshot.id} className="relative group cursor-pointer">
              <img
                src={screenshot.image_url}
                alt="Screenshot"
                className="w-full h-24 object-cover rounded-sm border border-gray-200 dark:border-gray-700 group-hover:border-primary dark:group-hover:border-primary-light transition-colors"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-sm flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                  {new Date(screenshot.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
