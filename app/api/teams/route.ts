import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// GET /api/teams - List all teams for the authenticated user
export async function GET(request: NextRequest) {
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

    // Get teams where user is a member
    const { data: teams, error } = await supabase
      .from('team_members')
      .select(`
        role,
        joined_at,
        teams!inner (
          id,
          name,
          description,
          invite_code,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to fetch teams:', error)
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      )
    }

    // Get member counts for each team
    const teamsWithCounts = await Promise.all(
      teams.map(async (teamMember: any) => {
        const { data: memberCount } = await supabase
          .from('team_members')
          .select('id', { count: 'exact', head: true })
          .eq('team_id', teamMember.teams.id)

        return {
          ...teamMember.teams,
          role: teamMember.role,
          joined_at: teamMember.joined_at,
          member_count: memberCount || 0
        }
      })
    )

    return NextResponse.json({ teams: teamsWithCounts })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, description, organization_id, invitedMembers = [] } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        organization_id: organization_id || null,
        created_by: user.id
      })
      .select()
      .single()

    if (teamError) {
      console.error('Failed to create team:', teamError)
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      )
    }

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) {
      console.error('Failed to add team owner:', memberError)
      // Rollback: delete the team
      await supabase.from('teams').delete().eq('id', team.id)
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      )
    }

    // Send invitations to invited members
    if (invitedMembers.length > 0) {
      const invitations = invitedMembers.map((member: any) => ({
        team_id: team.id,
        invited_by: user.id,
        recipient_email: member.email.toLowerCase(),
        role: member.role || 'member'
      }))

      await supabase.from('team_invitations').insert(invitations)
    }

    return NextResponse.json({
      team: {
        ...team,
        role: 'owner',
        member_count: 1
      }
    }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
