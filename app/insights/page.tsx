'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'
import {
  TrendingUp,
  Brain,
  Clock,
  Target,
  Zap,
  AlertCircle,
  Calendar,
  BarChart3,
  Lightbulb,
  CheckCircle
} from 'lucide-react'

export default function InsightsPage() {
  const { user, loading } = useAuth() as any
  const router = useRouter()

  React.useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5c5ce6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />

      {/* Header */}
      <div className="pt-16 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-7 h-7 text-[#5c5ce6]" />
                AI Insights
              </h1>
              <p className="text-gray-600 mt-1">AI-powered analytics and recommendations for your productivity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Productivity Score"
            value="87%"
            change="+12%"
            trend="up"
            icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          />
          <MetricCard
            title="Focus Time"
            value="24.5h"
            change="+3.2h"
            trend="up"
            icon={<Clock className="w-8 h-8 text-blue-500" />}
          />
          <MetricCard
            title="Peak Performance"
            value="2-5 PM"
            change="Consistent"
            trend="neutral"
            icon={<Target className="w-8 h-8 text-purple-500" />}
          />
          <MetricCard
            title="Efficiency"
            value="92%"
            change="+5%"
            trend="up"
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
          />
        </div>

        {/* Productivity Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#5c5ce6]" />
            Productivity Trends
          </h2>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-[#5c5ce6] mx-auto mb-3 opacity-50" />
              <p className="text-gray-500">Interactive chart coming soon</p>
              <p className="text-sm text-gray-400">Productivity trends over the last 30 days</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#5c5ce6]" />
            AI-Powered Recommendations
          </h2>
          <div className="space-y-4">
            <RecommendationCard
              title="Optimize Focus Time"
              description="Your productivity peaks between 2-5 PM. Consider scheduling deep work during this window."
              priority="high"
            />
            <RecommendationCard
              title="Take Regular Breaks"
              description="Analysis shows 15-minute breaks every 90 minutes improve your sustained performance by 23%."
              priority="medium"
            />
            <RecommendationCard
              title="Reduce Context Switching"
              description="You switch between 8+ projects daily. Try batching similar tasks to improve flow state."
              priority="medium"
            />
          </div>
        </div>

        {/* Work Patterns & Blockers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Work Patterns */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5c5ce6]" />
              Work Patterns
            </h2>
            <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-[#5c5ce6] mx-auto mb-2 opacity-50" />
                <p className="text-gray-500 text-sm">Activity heatmap</p>
                <p className="text-xs text-gray-400">Weekly work patterns visualization</p>
              </div>
            </div>
          </div>

          {/* Focus Time Analysis */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5c5ce6]" />
              Focus Time Analysis
            </h2>
            <div className="h-48 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-12 h-12 text-[#5c5ce6] mx-auto mb-2 opacity-50" />
                <p className="text-gray-500 text-sm">Time distribution</p>
                <p className="text-xs text-gray-400">Deep work vs. shallow work breakdown</p>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Blockers */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#5c5ce6]" />
            Detected Productivity Blockers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BlockerCard
              title="Frequent Interruptions"
              description="23 context switches detected yesterday"
              severity="high"
            />
            <BlockerCard
              title="Long Meeting Blocks"
              description="4+ hour meeting block on Tuesday"
              severity="medium"
            />
            <BlockerCard
              title="Late Night Work"
              description="Working past 10 PM reduces next-day efficiency"
              severity="medium"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon }: any) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className={`text-sm font-medium ${trendColor}`}>{change}</p>
    </div>
  )
}

function RecommendationCard({ title, description, priority }: any) {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50'
  }

  return (
    <div className={`p-4 border-l-4 rounded-lg ${priorityColors[priority]}`}>
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-[#5c5ce6] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

function BlockerCard({ title, description, severity }: any) {
  const severityColors = {
    high: 'bg-red-100 border-red-200 text-red-700',
    medium: 'bg-yellow-100 border-yellow-200 text-yellow-700',
    low: 'bg-green-100 border-green-200 text-green-700'
  }

  return (
    <div className={`p-4 border rounded-lg ${severityColors[severity]}`}>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  )
}
