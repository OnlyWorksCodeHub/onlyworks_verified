'use client'

import { useState } from 'react'
import { X, Users, Mail, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface InvitedMember {
  email: string
  role: 'admin' | 'member'
  name?: string
}

export default function CreateTeamModal({ isOpen, onClose, onSuccess }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddMember = (email: string, role: 'admin' | 'member' = 'member') => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    if (invitedMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      toast.error('This member has already been added')
      return
    }

    setInvitedMembers([...invitedMembers, { email: email.toLowerCase(), role }])
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleRemoveMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter(m => m.email !== email))
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamName.trim()) {
      toast.error('Team name is required')
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          name: teamName,
          description: description || null,
          invitedMembers
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create team')
      }

      toast.success('Team created successfully!')
      setTeamName('')
      setDescription('')
      setInvitedMembers([])
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5c5ce6] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Create Team</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleCreateTeam} className="p-6">
          {/* Team Name */}
          <div className="mb-4">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              id="teamName"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c5ce6]"
              placeholder="Engineering Team"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c5ce6]"
              rows={3}
              placeholder="A brief description of your team..."
            />
          </div>

          {/* Member Invitation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Invite Members (optional)
            </label>

            {/* Selected Members Tags */}
            {invitedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {invitedMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-sm"
                  >
                    <span className="font-medium text-gray-900">{member.email}</span>
                    <span className="text-xs text-gray-500">({member.role})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.email)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <input
                type="email"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setShowDropdown(searchQuery.length > 0)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c5ce6]"
                placeholder="Enter email address..."
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              {/* Quick Add Button */}
              {searchQuery.includes('@') && (
                <button
                  type="button"
                  onClick={() => handleAddMember(searchQuery, 'member')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#5c5ce6] text-white text-xs rounded-md hover:bg-[#4c4cd6] transition-colors"
                >
                  Add
                </button>
              )}
            </div>

            {/* Dropdown with suggestions */}
            {showDropdown && searchQuery.includes('@') && (
              <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => handleAddMember(searchQuery, 'member')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">Invite {searchQuery}</p>
                      <p className="text-xs text-gray-500">Send invitation as Member</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddMember(searchQuery, 'admin')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">Invite {searchQuery}</p>
                      <p className="text-xs text-gray-500">Send invitation as Admin</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Team members will receive an email invitation to join this team.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !teamName.trim()}
              className="px-6 py-2 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
