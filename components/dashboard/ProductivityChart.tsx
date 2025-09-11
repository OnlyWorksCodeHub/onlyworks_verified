'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ProductivityChartProps {
  userId: string
}

interface ChartData {
  date: string
  productivity: number
  focus: number
}

export function ProductivityChart({ userId }: ProductivityChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchChartData()
  }, [userId])

  const fetchChartData = async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const { data: stats } = await supabase
      .from('daily_stats')
      .select('date, avg_productivity, avg_focus')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: true })

    if (stats) {
      const chartData = stats.map(stat => ({
        date: format(new Date(stat.date), 'MMM dd'),
        productivity: stat.avg_productivity || 0,
        focus: stat.avg_focus || 0
      }))
      setData(chartData)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="card-clean p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productivity Trend</h3>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-sm animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="card-clean p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Productivity Trend
      </h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.125rem'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              name="Productivity"
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Focus"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
