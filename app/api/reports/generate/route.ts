import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await request.json()
    console.log('Generating report for session:', sessionId)

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      console.error('Session not found:', sessionError)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get or create session summary
    let { data: summary } = await supabase
      .from('session_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    // If no summary exists, create one first
    if (!summary) {
      console.log('No summary found, generating one...')
      
      // Generate summary first
      const summaryResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/session/summary`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || ''
        },
        body: JSON.stringify({ sessionId })
      })

      if (!summaryResponse.ok) {
        console.error('Failed to generate summary')
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
      }

      const summaryResult = await summaryResponse.json()
      summary = summaryResult.summary
    }

    // Get user profile for company name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company')
      .eq('id', user.id)
      .single()

    // Get analyses for metadata
    const { data: analyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('session_id', sessionId)

    // Generate verification code
    const verificationCode = `OW-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create public report
    const { data: report, error: reportError } = await supabase
      .from('public_reports')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        verification_code: verificationCode,
        company_name: profile?.company || 'Independent Professional',
        project_name: session.project_name || session.name,
        work_duration: session.total_duration ? Math.round(session.total_duration / 60) : 0,
        productivity_score: summary?.avg_productivity_score || 0,
        authenticity_verified: (summary?.avg_authenticity_score || 0) >= 80,
        work_summary: summary?.work_narrative || 'Work session completed.',
        key_metrics: {
          totalActions: summary?.total_screenshots || 0,
          focusedWorkPercentage: summary?.avg_focus_score || 0,
          toolsUsed: summary?.ai_tools_used || [],
          tasksCompleted: summary?.accomplishments || [],
          efficiencyRating: getEfficiencyRating(summary?.avg_productivity_score || 0)
        },
        is_public: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (reportError) {
      console.error('Report generation error:', reportError)
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }

    // Save report to storage bucket
    const reportData = {
      reportId: report.id,
      verificationCode,
      sessionId,
      generatedAt: new Date().toISOString(),
      summary: {
        productivity_score: summary?.avg_productivity_score || 0,
        authenticity_verified: (summary?.avg_authenticity_score || 0) >= 80,
        work_summary: summary?.work_narrative || 'Work session completed.',
        key_metrics: {
          totalActions: summary?.total_screenshots || 0,
          focusedWorkPercentage: summary?.avg_focus_score || 0,
          toolsUsed: summary?.ai_tools_used || [],
          tasksCompleted: summary?.accomplishments || [],
          efficiencyRating: getEfficiencyRating(summary?.avg_productivity_score || 0)
        }
      },
      metadata: {
        duration: session?.total_duration || 0,
        screenshotCount: summary?.total_screenshots || 0,
        analysesCount: analyses?.length || 0
      }
    }

    // Save to reports bucket
    const reportFileName = `${user.id}/${sessionId}/report_${verificationCode}.json`
    try {
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(reportFileName, JSON.stringify(reportData, null, 2), {
          contentType: 'application/json',
          upsert: true
        })

      if (uploadError) {
        console.warn('Failed to save report to storage:', uploadError.message)
      }
    } catch (storageError) {
      console.warn('Report storage error:', storageError)
    }

    // Update session summary with public URL
    if (summary) {
      await supabase
        .from('session_summaries')
        .update({
          public_report_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`
        })
        .eq('id', summary.id)
    }

    console.log('Report generated successfully:', report)

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        publicUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`
      }
    })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate report',
      details: error.message
    }, { status: 500 })
  }
}

function getEfficiencyRating(productivityScore: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (productivityScore >= 90) return 'A'
  if (productivityScore >= 80) return 'B'
  if (productivityScore >= 70) return 'C'
  if (productivityScore >= 60) return 'D'
  return 'F'
}
