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

// GET /api/teams/[id] - Get team details
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

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Get member count
    const { count: memberCount } = await supabase
      .from('team_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', params.id)

    return NextResponse.json({
      team: {
        ...team,
        role: userRole,
        member_count: memberCount || 0
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id] - Update team details
export async function PUT(
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
        { error: 'Access denied. Only owners and admins can update team details.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    const updates: any = {}
    if (name !== undefined && name.trim() !== '') {
      updates.name = name.trim()
    }
    if (description !== undefined) {
      updates.description = description?.trim() || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    const { data: team, error: updateError } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update team:', updateError)
      return NextResponse.json(
        { error: 'Failed to update team' },
        { status: 500 }
      )
    }

    return NextResponse.json({ team })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/teams/[id] - Delete team
export async function DELETE(
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

    // Verify user is owner
    const userRole = await verifyTeamRole(params.id, user.id, ['owner'])

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied. Only team owners can delete teams.' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Failed to delete team:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete team' },
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
