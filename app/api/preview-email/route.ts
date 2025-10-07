import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { shareReportViaEmail, getReport } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

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
    const { reportId, recipientEmail, expiresInDays = 30 } = body

    // Validate input
    if (!reportId || !recipientEmail) {
      return NextResponse.json(
        { error: 'reportId and recipientEmail are required' },
        { status: 400 }
      )
    }

    // Verify user owns the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single()

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Report not found or you do not have permission to share it' },
        { status: 404 }
      )
    }

    // Create share record
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const { data: shareData, error: shareError } = await supabase
      .from('shared_reports')
      .insert({
        report_id: reportId,
        shared_by_user_id: user.id,
        recipient_email: recipientEmail.toLowerCase(),
        expires_at: expiresAt.toISOString()
      })
      .select('id, share_token, expires_at')
      .single()

    if (shareError || !shareData) {
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      )
    }

    // Generate email preview instead of sending
    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareData.share_token}`
    const senderName = user.email?.split('@')[0] || 'OnlyWorks User'

    const emailPreview = {
      to: recipientEmail,
      from: process.env.FROM_EMAIL || 'noreply@onlyworks.com',
      subject: `📊 ${senderName} shared a work report with you - OnlyWorks`,
      shareLink: shareLink,
      expiresAt: shareData.expires_at,
      message: `
📧 EMAIL PREVIEW - This would be sent to: ${recipientEmail}

Subject: 📊 ${senderName} shared a work report with you - OnlyWorks

Hello!

${senderName} has shared a work report with you from OnlyWorks.

Report: ${report.title || 'Daily Work Report'}
Date: ${new Date(report.report_date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

Quick Stats:
- Lines Written: ${report.lines_written || 0}
- Files Modified: ${report.files_modified_count || 0}
- Session Duration: ${report.session_duration || 'N/A'}
- Screenshots: ${report.screenshot_count || 0}

Executive Summary:
"${report.executive_summary ? report.executive_summary.substring(0, 300) + '...' : 'No summary available'}"

🔗 View Full Report: ${shareLink}

⏰ This link expires on ${new Date(shareData.expires_at).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

🔒 Security Notice: This link is unique to you and should not be shared with others.

--
OnlyWorks - Productivity Tracking Made Simple
${process.env.NEXT_PUBLIC_APP_URL}
      `
    }

    return NextResponse.json({
      success: true,
      shareToken: shareData.share_token,
      expiresAt: shareData.expires_at,
      emailPreview: emailPreview,
      note: 'Email preview generated - set up Gmail App Password to actually send emails'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}