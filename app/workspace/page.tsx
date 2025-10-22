'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Users, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Team {
  id: string
  name: string
  description: string | null
  role: string
  member_count: number
  joined_at: string
}

interface TeamMember {
  id: string
  user_id: string
  email: string
  full_name: string | null
  profession: string | null
  role: string
  team_id: string
  team_name: string
}

export default function WorkspacePage() {
  const { user, loading: authLoading } = useAuth() as any
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [allMembers, setAllMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadTeams()
    }
  }, [user])

  const loadTeams = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      if (!session) {
        toast.error('Not authenticated')
        return
      }

      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }

      const data = await response.json()
      setTeams(data.teams || [])

      // Load members for all teams
      if (data.teams && data.teams.length > 0) {
        await loadAllMembers(data.teams, session.access_token)
      }
    } catch (error: any) {
      console.error('Error loading teams:', error)
      toast.error(error.message || 'Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const loadAllMembers = async (teamsList: Team[], accessToken: string) => {
    try {
      const allMembersData: TeamMember[] = []

      for (const team of teamsList) {
        const response = await fetch(`/api/teams/${team.id}/members`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const membersWithTeam = data.members.map((m: any) => ({
            ...m,
            team_id: team.id,
            team_name: team.name
          }))
          allMembersData.push(...membersWithTeam)
        }
      }

      setAllMembers(allMembersData)
    } catch (error) {
      console.error('Error loading members:', error)
    }
  }

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -220, behavior: 'smooth' })
    }
  }

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 220, behavior: 'smooth' })
    }
  }

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [teams])

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete team')
      }

      toast.success('Team deleted successfully')
      loadTeams()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete team')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5c5ce6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Workspace</h1>
            <p className="text-gray-600 mt-1">Manage your teams and collaborate with your organization</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>

        {/* Teams Carousel Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teams</h2>

          {teams.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No teams yet. Create your first team to get started!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors font-medium"
              >
                Create Team
              </button>
            </div>
          ) : (
            <div className="relative px-6">
              {/* Carousel Navigation */}
              {canScrollLeft && (
                <button
                  onClick={handleScrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-[#5c5ce6] transition-all shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={handleScrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-[#5c5ce6] transition-all shadow-md"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {/* Carousel Items */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-hidden pb-3"
                style={{ scrollBehavior: 'smooth' }}
              >
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => router.push(`/workspace/${team.id}`)}
                    className="flex-shrink-0 w-[200px] min-h-[140px] bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-[#5c5ce6] transition-all text-center flex flex-col justify-center relative group"
                  >
                    {team.role === 'owner' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTeam(team.id, team.name)
                        }}
                        className="absolute top-2 right-2 w-7 h-7 p-1.5 bg-transparent hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <Users className="w-12 h-12 text-[#5c5ce6] mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{team.name}</h3>
                    <p className="text-xs text-gray-500">{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</p>
                    <span className="text-[10px] bg-[#5c5ce6] text-white px-2 py-0.5 rounded-full mt-2 inline-block uppercase font-semibold tracking-wide">
                      {team.role}
                    </span>
                  </div>
                ))}

                {/* Add Team Card */}
                <div
                  onClick={() => setShowCreateModal(true)}
                  className="flex-shrink-0 w-[200px] min-h-[140px] border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#5c5ce6] hover:bg-purple-50 transition-all text-center flex flex-col justify-center group"
                >
                  <Plus className="w-12 h-12 text-gray-400 group-hover:text-[#5c5ce6] mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-gray-600 font-medium">Create Team</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* People Grid Section */}
        {allMembers.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">People</h2>

            <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-4">
              {allMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-[200px] min-h-[140px] bg-white border border-gray-200 rounded-lg p-4 text-center flex flex-col justify-center hover:bg-gray-50 transition-all"
                >
                  <div className="w-10 h-10 bg-[#5c5ce6] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
                    {member.full_name ? member.full_name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 truncate px-2">{member.full_name || 'Team Member'}</h4>
                  <p className="text-xs text-gray-500 mb-2 truncate px-2">{member.profession || member.email}</p>
                  <p className="text-xs text-gray-400 truncate px-2">{member.team_name}</p>
                  <button className="mt-3 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#5c5ce6] transition-all">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal (placeholder - will implement in components) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Team</h3>
            <p className="text-gray-600 mb-4">Team creation modal with member invitation will be implemented in the components step...</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
