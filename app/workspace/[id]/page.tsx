'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Users, Settings, BarChart3, Activity, Trash2, UserPlus, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Team {
  id: string
  name: string
  description: string | null
  role: string
  member_count: number
}

interface Member {
  id: string
  user_id: string
  email: string
  full_name: string | null
  profession: string | null
  role: string
  joined_at: string
}

interface Analytics {
  total_reports: number
  total_lines_written: number
  total_lines_deleted: number
  total_files_modified: number
  total_session_duration: number
  total_errors: number
  total_screenshots: number
  active_members: number
  avg_lines_per_member: number
}

export default function TeamDetailsPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth() as any
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'members' | 'analytics' | 'activity' | 'settings'>('members')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadTeamDetails()
      loadMembers()
      loadAnalytics()
    }
  }, [user, params.id])

  const loadTeamDetails = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load team')
      }

      const data = await response.json()
      setTeam(data.team)
    } catch (error: any) {
      console.error('Error loading team:', error)
      toast.error(error.message || 'Failed to load team')
      router.push('/workspace')
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${params.id}/members`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      }
    } catch (error) {
      console.error('Error loading members:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${params.id}/analytics?days=30`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics || null)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const handleRemoveMember = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from this team?`)) {
      return
    }

    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${params.id}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove member')
      }

      toast.success('Member removed successfully')
      loadMembers()
      loadTeamDetails()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member')
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5c5ce6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Team Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-[#5c5ce6] rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
                {team.description && <p className="text-gray-600 mt-1">{team.description}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-500">{team.member_count} members</span>
                  <span className="text-xs bg-[#5c5ce6] text-white px-2 py-0.5 rounded-full uppercase font-semibold">
                    {team.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {(team.role === 'owner' || team.role === 'admin') && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Members
                </button>
              )}
              <button
                onClick={() => router.push('/workspace')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Back to Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'members'
                  ? 'text-gray-900 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Members
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-gray-900 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-gray-900 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity
            </button>
            {(team.role === 'owner' || team.role === 'admin') && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-gray-900 border-b-2 border-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}
          </div>

          <div className="p-6">
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                  {members.map((member) => (
                    <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="w-10 h-10 bg-[#5c5ce6] text-white rounded-full flex items-center justify-center mb-3 text-sm font-semibold">
                        {member.full_name ? member.full_name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{member.full_name || 'Team Member'}</h4>
                      <p className="text-xs text-gray-500 mb-2">{member.role}</p>
                      <p className="text-xs text-gray-400 mb-3">{member.email}</p>

                      {member.role !== 'owner' && (team.role === 'owner' || team.role === 'admin') && (
                        <button
                          onClick={() => handleRemoveMember(member.user_id, member.email)}
                          className="w-full mt-3 px-3 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-600 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Analytics (Last 30 Days)</h3>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_reports}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Lines Written</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_lines_written.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Time</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(analytics.total_session_duration)}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Active Members</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.active_members}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Avg Lines/Member</p>
                    <p className="text-xl font-semibold text-gray-900">{Math.round(analytics.avg_lines_per_member).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Files Modified</p>
                    <p className="text-xl font-semibold text-gray-900">{analytics.total_files_modified.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Screenshots</p>
                    <p className="text-xl font-semibold text-gray-900">{analytics.total_screenshots.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Activity feed coming soon...</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (team.role === 'owner' || team.role === 'admin') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings</h3>
                <div className="max-w-2xl">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                    <input
                      type="text"
                      value={team.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c5ce6]"
                      readOnly
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={team.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c5ce6]"
                      rows={3}
                      readOnly
                    />
                  </div>

                  {team.role === 'owner' && (
                    <div className="border-t border-gray-200 pt-6 mt-8">
                      <h4 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h4>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                        Delete Team
                      </button>
                      <p className="text-xs text-gray-500 mt-2">This action cannot be undone.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
