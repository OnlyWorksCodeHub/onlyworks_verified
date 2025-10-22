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

// GET /api/teams/[id]/analytics - Get team analytics
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

    // Get query parameters for date range
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days') || '30'
    const days = parseInt(daysParam, 10)

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Use the database function to get analytics
    const { data: analytics, error: analyticsError } = await supabase
      .rpc('get_team_analytics', {
        p_team_id: params.id,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
      })

    if (analyticsError) {
      console.error('Failed to fetch team analytics:', analyticsError)
      return NextResponse.json(
        { error: 'Failed to fetch team analytics' },
        { status: 500 }
      )
    }

    // Get member breakdown
    const { data: members } = await supabase
      .from('team_members')
      .select(`
        user_id,
        role,
        user:auth.users!inner (
          email
        )
      `)
      .eq('team_id', params.id)

    if (members) {
      // Get stats for each member
      const memberStats = await Promise.all(
        members.map(async (member: any) => {
          const { data: reports } = await supabase
            .from('reports')
            .select('lines_written, lines_deleted, files_modified_count, session_duration, created_at')
            .eq('user_id', member.user_id)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())

          const totalLinesWritten = reports?.reduce((sum, r) => sum + (r.lines_written || 0), 0) || 0
          const totalSessionDuration = reports?.reduce((sum, r) => sum + (r.session_duration || 0), 0) || 0
          const totalReports = reports?.length || 0

          return {
            user_id: member.user_id,
            email: member.user.email,
            role: member.role,
            total_reports: totalReports,
            total_lines_written: totalLinesWritten,
            total_session_duration: totalSessionDuration
          }
        })
      )

      return NextResponse.json({
        analytics: analytics[0] || {},
        member_stats: memberStats,
        date_range: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days
        }
      })
    }

    return NextResponse.json({
      analytics: analytics[0] || {},
      member_stats: [],
      date_range: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days
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
