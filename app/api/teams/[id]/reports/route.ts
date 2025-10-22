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

// GET /api/teams/[id]/reports - Get all team reports
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

    // Get all team member IDs
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', params.id)

    if (!members || members.length === 0) {
      return NextResponse.json({ reports: [] })
    }

    const memberIds = members.map(m => m.user_id)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Get reports from all team members
    const { data: reports, error, count } = await supabase
      .from('reports')
      .select(`
        id,
        user_id,
        report_date,
        title,
        session_duration,
        executive_summary,
        lines_written,
        lines_deleted,
        files_modified_count,
        errors_encountered_count,
        screenshot_count,
        created_at,
        updated_at
      `, { count: 'exact' })
      .in('user_id', memberIds)
      .order('report_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Failed to fetch team reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team reports' },
        { status: 500 }
      )
    }

    // Get user emails for each report
    const { data: users } = await supabase.auth.admin.listUsers()
    const userEmailMap = new Map(users?.users?.map(u => [u.id, u.email]) || [])

    const reportsWithEmail = reports.map(report => ({
      ...report,
      user_email: userEmailMap.get(report.user_id) || 'Unknown'
    }))

    return NextResponse.json({
      reports: reportsWithEmail,
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
