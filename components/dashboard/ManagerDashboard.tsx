'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, BarChart3, TrendingUp, Clock, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

interface Team {
  id: string
  name: string
  role: string
  member_count: number
}

interface TeamAnalytics {
  total_reports: number
  total_lines_written: number
  total_session_duration: number
  active_members: number
  avg_lines_per_member: number
}

export default function ManagerDashboard() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam) {
      loadTeamAnalytics(selectedTeam.id)
    }
  }, [selectedTeam])

  const loadTeams = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const managerTeams = data.teams.filter((t: Team) => t.role === 'owner' || t.role === 'admin')
        setTeams(managerTeams)

        if (managerTeams.length > 0) {
          setSelectedTeam(managerTeams[0])
        }
      }
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTeamAnalytics = async (teamId: string) => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${teamId}/analytics?days=30`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="w-8 h-8 border-4 border-[#5c5ce6] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-8 text-center">
        <Users className="w-16 h-16 text-[#5c5ce6] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teams Yet</h3>
        <p className="text-gray-600 mb-6">Create a team to view aggregated metrics and manage your organization.</p>
        <button
          onClick={() => router.push('/workspace')}
          className="px-6 py-2 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors font-medium"
        >
          Go to Workspace
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Viewing Team</label>
        <div className="relative">
          <button
            onClick={() => setShowTeamDropdown(!showTeamDropdown)}
            className="w-full md:w-64 flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5c5ce6]" />
              <span className="font-medium text-gray-900">{selectedTeam?.name}</span>
              <span className="text-xs text-gray-500">({selectedTeam?.member_count} members)</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showTeamDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full md:w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team)
                    setShowTeamDropdown(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{team.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">({team.member_count})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#5c5ce6]" />
              </div>
              <span className="text-sm text-gray-600">Total Reports</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.total_reports}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Lines Written</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.total_lines_written.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Across all members</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Total Time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatDuration(analytics.total_session_duration)}</p>
            <p className="text-xs text-gray-500 mt-1">Productive hours</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Active Members</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.active_members}</p>
            <p className="text-xs text-gray-500 mt-1">Contributing members</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => router.push(`/workspace/${selectedTeam?.id}`)}
            className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#5c5ce6] transition-all text-left"
          >
            <Users className="w-5 h-5 text-[#5c5ce6]" />
            <div>
              <p className="font-medium text-gray-900 text-sm">View Team Details</p>
              <p className="text-xs text-gray-500">Manage members and settings</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/workspace')}
            className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#5c5ce6] transition-all text-left"
          >
            <BarChart3 className="w-5 h-5 text-[#5c5ce6]" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Workspace</p>
              <p className="text-xs text-gray-500">View all teams and people</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/reports')}
            className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#5c5ce6] transition-all text-left"
          >
            <TrendingUp className="w-5 h-5 text-[#5c5ce6]" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Team Reports</p>
              <p className="text-xs text-gray-500">View all team activity</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
