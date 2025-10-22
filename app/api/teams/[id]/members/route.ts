import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Helper function to verify user's role in team
async function verifyTeamRole(teamId: string, userId: string, requiredRoles: string[]) {
  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .single()

  if (!member || !requiredRoles.includes(member.role)) {
    return null
  }

  return member.role
}

// GET /api/teams/[id]/members - List team members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify user is a member of this team
    const userRole = await verifyTeamRole(params.id, user.id, ['owner', 'admin', 'member'])

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get team members with user details
    const { data: members, error } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        joined_at,
        user:auth.users!inner (
          id,
          email
        )
      `)
      .eq('team_id', params.id)

    if (error) {
      console.error('Failed to fetch members:', error)
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      )
    }

    // Get profile data for members
    const memberIds = members.map((m: any) => m.user.id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, company, profession')
      .in('id', memberIds)

    // Merge profile data with member data
    const membersWithProfiles = members.map((member: any) => {
      const profile = profiles?.find(p => p.id === member.user.id)
      return {
        id: member.id,
        user_id: member.user.id,
        email: member.user.email,
        full_name: profile?.full_name || null,
        company: profile?.company || null,
        profession: profile?.profession || null,
        role: member.role,
        joined_at: member.joined_at
      }
    })

    return NextResponse.json({ members: membersWithProfiles })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/teams/[id]/members - Invite members to team
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify user is owner or admin
    const userRole = await verifyTeamRole(params.id, user.id, ['owner', 'admin'])

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied. Only owners and admins can invite members.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { members } = body

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: 'Members array is required' },
        { status: 400 }
      )
    }

    // Create invitations
    const invitations = members.map((member: any) => ({
      team_id: params.id,
      invited_by: user.id,
      recipient_email: member.email.toLowerCase(),
      role: member.role || 'member'
    }))

    const { data, error } = await supabase
      .from('team_invitations')
      .insert(invitations)
      .select()

    if (error) {
      console.error('Failed to create invitations:', error)
      return NextResponse.json(
        { error: 'Failed to create invitations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ invitations: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
