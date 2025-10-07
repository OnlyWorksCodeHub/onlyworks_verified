import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json(
        { error: 'Share token is required' },
        { status: 400 }
      )
    }

    console.log('Looking for share token:', token)

    // First get the share record
    const { data: shareRecord, error: shareError } = await supabase
      .from('shared_reports')
      .select('*')
      .eq('share_token', token)
      .gt('expires_at', new Date().toISOString())
      .single()

    console.log('Share record:', shareRecord, 'Error:', shareError)

    if (shareError || !shareRecord) {
      return NextResponse.json(
        { error: 'Share not found or expired' },
        { status: 404 }
      )
    }

    // Then get the actual report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', shareRecord.report_id)
      .single()

    console.log('Report:', !!report, 'Error:', reportError)

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabase
      .from('shared_reports')
      .update({ view_count: (shareRecord.view_count || 0) + 1 })
      .eq('id', shareRecord.id)

    const shareInfo = {
      id: shareRecord.id,
      recipientEmail: shareRecord.recipient_email,
      expiresAt: shareRecord.expires_at,
      viewCount: (shareRecord.view_count || 0) + 1,
      sharedByUserId: shareRecord.shared_by_user_id
    }

    // Return the report and share info
    return NextResponse.json({
      report,
      shareInfo
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}