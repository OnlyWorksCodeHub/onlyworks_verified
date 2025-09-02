'use client'

import { useEffect, useState } from 'react'

export function ActivityChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Mock data - replace with real data
    setData([
      { day: 'Mon', productivity: 75 },
      { day: 'Tue', productivity: 82 },
      { day: 'Wed', productivity: 78 },
      { day: 'Thu', productivity: 85 },
      { day: 'Fri', productivity: 90 },
      { day: 'Sat', productivity: 65 },
      { day: 'Sun', productivity: 70 },
    ])
  }, [])

  const maxValue = Math.max(...data.map(d => d.productivity))

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Productivity</h3>
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item) => (
          <div key={item.day} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end">
              <div
                className="w-full bg-primary-500 rounded-t transition-all duration-500"
                style={{ height: `${(item.productivity / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}