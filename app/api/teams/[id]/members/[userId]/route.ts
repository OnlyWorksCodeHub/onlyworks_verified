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

// DELETE /api/teams/[id]/members/[userId] - Remove member from team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
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
        { error: 'Access denied. Only owners and admins can remove members.' },
        { status: 403 }
      )
    }

    // Check if trying to remove the owner
    const { data: targetMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', params.id)
      .eq('user_id', params.userId)
      .single()

    if (targetMember?.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove team owner' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', params.id)
      .eq('user_id', params.userId)

    if (error) {
      console.error('Failed to remove member:', error)
      return NextResponse.json(
        { error: 'Failed to remove member' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id]/members/[userId] - Update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
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
        { error: 'Access denied. Only owners and admins can update member roles.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { role } = body

    if (!role || !['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "member"' },
        { status: 400 }
      )
    }

    // Check if trying to modify the owner
    const { data: targetMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', params.id)
      .eq('user_id', params.userId)
      .single()

    if (targetMember?.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot modify team owner role' },
        { status: 400 }
      )
    }

    const { data: updatedMember, error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('team_id', params.id)
      .eq('user_id', params.userId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update member role:', error)
      return NextResponse.json(
        { error: 'Failed to update member role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ member: updatedMember })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
