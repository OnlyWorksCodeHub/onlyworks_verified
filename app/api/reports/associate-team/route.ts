import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// POST /api/reports/associate-team - Automatically associate user's reports with their teams
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

    // Get all teams the user is a member of
    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({
        message: 'No team memberships found',
        associated: 0
      })
    }

    // If user is in multiple teams, use the first one (or implement selection logic)
    const primaryTeamId = memberships[0].team_id

    // Update all user's reports that don't have a team assigned
    const { data, error } = await supabase
      .from('reports')
      .update({ team_id: primaryTeamId })
      .eq('user_id', user.id)
      .is('team_id', null)
      .select('id')

    if (error) {
      console.error('Failed to associate reports:', error)
      return NextResponse.json(
        { error: 'Failed to associate reports with team' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully associated ${data?.length || 0} reports with team`,
      associated: data?.length || 0,
      team_id: primaryTeamId
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/reports/associate-team - Get user's team association status
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

    // Get user's teams
    const { data: memberships } = await supabase
      .from('team_members')
      .select(`
        team_id,
        role,
        teams!inner (
          id,
          name
        )
      `)
      .eq('user_id', user.id)

    // Get reports without team assignment
    const { count: unassignedCount } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('team_id', null)

    return NextResponse.json({
      teams: memberships || [],
      unassigned_reports: unassignedCount || 0,
      has_teams: (memberships?.length || 0) > 0
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
