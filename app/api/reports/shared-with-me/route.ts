import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

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

    // Get reports shared with this user's email
    const { data, error } = await supabase
      .from('shared_reports')
      .select(`
        id,
        share_token,
        expires_at,
        view_count,
        created_at,
        reports!inner (
          id,
          title,
          report_date,
          lines_written,
          files_modified_count,
          session_duration,
          executive_summary
        ),
        shared_by:auth_users!shared_reports_shared_by_user_id_fkey (
          email
        )
      `)
      .eq('recipient_email', user.email!.toLowerCase())
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch shared reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch shared reports' },
        { status: 500 }
      )
    }

    return NextResponse.json({ receivedReports: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
