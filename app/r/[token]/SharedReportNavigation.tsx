'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, FileText, Brain } from 'lucide-react'

interface SharedReportNavigationProps {
  token: string
}

const SharedReportNavigation = ({ token }: SharedReportNavigationProps) => {
  const redirectUrl = `/auth/login?redirect=/r/${token}`

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={redirectUrl} className="flex items-center">
              <Image
                src="/images/onlyworks-logo.png"
                alt="OnlyWorks"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/auth/login?redirect=/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/auth/login?redirect=/reports"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Reports
              </Link>
              <Link
                href="/auth/login?redirect=/insights"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <Brain className="w-4 h-4" />
                AI Insights
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/auth/login?redirect=/r/${token}`}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href={`/auth/register?redirect=/r/${token}`}
              className="px-4 py-2 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors text-sm font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SharedReportNavigation
