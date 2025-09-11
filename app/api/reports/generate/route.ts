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

    // Get session details
    const { data: session } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get session summary
    const { data: summary } = await supabase
      .from('session_summaries')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (!summary) {
      return NextResponse.json({ error: 'Summary not found' }, { status: 404 })
    }

    // Get user profile for company name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company')
      .eq('id', user.id)
      .single()

    // Generate verification code
    const verificationCode = `OW-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create public report
    const { data: report, error } = await supabase
      .from('public_reports')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        verification_code: verificationCode,
        company_name: profile?.company,
        project_name: session.project_name,
        work_duration: session.total_duration ? Math.round(session.total_duration / 60) : 0,
        productivity_score: summary.avg_productivity_score,
        authenticity_verified: summary.avg_authenticity_score >= 80,
        work_summary: summary.work_narrative,
        key_metrics: {
          totalActions: summary.total_screenshots,
          focusedWorkPercentage: summary.avg_focus_score,
          toolsUsed: extractToolsUsed(summary),
          tasksCompleted: summary.accomplishments,
          efficiencyRating: getEfficiencyRating(summary.avg_productivity_score)
        },
        is_public: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (error) {
      console.error('Report generation error:', error)
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }

    // Update session summary with public URL
    await supabase
      .from('session_summaries')
      .update({
        public_report_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`
      })
      .eq('id', summary.id)

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        publicUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`
      }
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate report' 
    }, { status: 500 })
  }
}

function extractToolsUsed(summary: any): string[] {
  // This would be enhanced to extract from the actual analyses
  const tools = new Set<string>()
  
  // Add default tools based on profession
  tools.add('Browser')
  
  // Extract from narrative if available
  if (summary.work_narrative) {
    if (summary.work_narrative.includes('VS Code')) tools.add('VS Code')
    if (summary.work_narrative.includes('Figma')) tools.add('Figma')
    if (summary.work_narrative.includes('Excel')) tools.add('Excel')
    if (summary.work_narrative.includes('Slack')) tools.add('Slack')
  }
  
  return Array.from(tools)
}

function getEfficiencyRating(productivityScore: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (productivityScore >= 90) return 'A'
  if (productivityScore >= 80) return 'B'
  if (productivityScore >= 70) return 'C'
  if (productivityScore >= 60) return 'D'
  return 'F'
}
