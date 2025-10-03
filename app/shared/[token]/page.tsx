'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Home, ExternalLink } from 'lucide-react'
// import { getSharedReport } from '@/lib/supabase' // Disabled - sharing functionality not available
import ReportViewer from '@/components/ReportViewer'

const SharedReportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">OnlyWorks</h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to OnlyWorks
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sharing Unavailable</h2>
          <p className="text-gray-600 mb-6">
            Report sharing is currently disabled. This feature requires additional database setup.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to OnlyWorks
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedReportPage