import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { shareReportViaEmail, getReport } from '@/lib/supabase'
// Choose your email service:
// import { emailService } from '@/lib/emailService' // Resend (works if sending to admin@only-works.com)
import { nodemailerEmailService as emailService } from '@/lib/emailService-nodemailer' // Nodemailer (works with any email)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitStore = new Map()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_SHARES_PER_HOUR = 10

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userKey = `share_${userId}`
  const userRequests = rateLimitStore.get(userKey) || []

  // Remove old requests outside the window
  const validRequests = userRequests.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW)

  if (validRequests.length >= MAX_SHARES_PER_HOUR) {
    return false
  }

  // Add current request
  validRequests.push(now)
  rateLimitStore.set(userKey, validRequests)

  return true
}

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

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 shares per hour.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { reportId, recipientEmail, expiresInDays = 30, message } = body

    // Validate input
    if (!reportId || !recipientEmail) {
      return NextResponse.json(
        { error: 'reportId and recipientEmail are required' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (expiresInDays < 1 || expiresInDays > 365) {
      return NextResponse.json(
        { error: 'Expiration must be between 1 and 365 days' },
        { status: 400 }
      )
    }

    // Verify user owns the report using service key (bypasses RLS)
    console.log('Checking report access:', { reportId, userId: user.id })

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single()

    console.log('Report check result:', { report: !!report, reportError })

    if (reportError || !report) {
      console.error('Report access denied:', { reportError, reportId, userId: user.id })
      return NextResponse.json(
        {
          error: 'Report not found or you do not have permission to share it',
          debug: {
            reportId,
            userId: user.id,
            reportError: reportError?.message || 'No error details'
          }
        },
        { status: 404 }
      )
    }

    // Create share record directly (bypassing RLS since we're using service key)
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
      console.error('Share creation error:', shareError)
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      )
    }

    // Get sender name from user email
    const senderName = user.email?.split('@')[0] || 'OnlyWorks User'

    // Send email notification
    const emailResult = await emailService.sendShareEmail(
      recipientEmail,
      report,
      shareData.share_token,
      senderName,
      shareData.expires_at
    )

    if (!emailResult.success) {
      console.error('Email sending failed:', 'error' in emailResult ? emailResult.error : 'Unknown error')
      // Still return success since the share was created
      return NextResponse.json({
        success: true,
        shareToken: shareData.share_token,
        expiresAt: shareData.expires_at,
        warning: 'Share created but email notification failed to send'
      })
    }

    return NextResponse.json({
      success: true,
      shareToken: shareData.share_token,
      expiresAt: shareData.expires_at,
      emailSent: true,
      messageId: emailResult.messageId
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Get user's shared reports
    const { data: sharedReports, error } = await supabase
      .from('shared_reports')
      .select(`
        id,
        recipient_email,
        share_token,
        expires_at,
        view_count,
        created_at,
        reports!inner (
          id,
          title,
          report_date,
          lines_written,
          files_modified_count
        )
      `)
      .eq('shared_by_user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch shared reports' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sharedReports })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('shareId')

    if (!shareId) {
      return NextResponse.json(
        { error: 'shareId is required' },
        { status: 400 }
      )
    }

    // Delete the share
    const { error } = await supabase
      .from('shared_reports')
      .delete()
      .eq('id', shareId)
      .eq('shared_by_user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to revoke share' },
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