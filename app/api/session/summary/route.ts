import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import crypto from 'crypto'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await request.json()

    // Get all screenshots and analyses for this session
    const { data: screenshots } = await supabase
      .from('screenshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true })

    const { data: analyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (!screenshots || screenshots.length === 0) {
      return NextResponse.json({ error: 'No data to analyze' }, { status: 400 })
    }

    // Build session narrative
    const narrative = buildSessionNarrative(screenshots, analyses || [])
    
    // Calculate metrics
    const metrics = calculateSessionMetrics(screenshots, analyses || [])

    // Generate AI summary
    const aiSummary = await generateAISummary(narrative, metrics)

    // Generate verification hash
    const verificationHash = generateVerificationHash(screenshots)

    // Save summary
    const { data: summary, error } = await supabase
      .from('session_summaries')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        work_narrative: aiSummary.narrative,
        accomplishments: aiSummary.accomplishments,
        total_screenshots: screenshots.length,
        total_clicks: screenshots.filter(s => s.trigger_type === 'click').length,
        total_keystrokes: screenshots.filter(s => ['spacebar', 'enter'].includes(s.trigger_type)).length,
        avg_productivity_score: metrics.avgProductivity,
        avg_focus_score: metrics.avgFocus,
        avg_authenticity_score: metrics.avgAuthenticity,
        strengths: aiSummary.strengths,
        improvements: aiSummary.improvements,
        specific_wins: aiSummary.wins,
        specific_issues: aiSummary.issues,
        recommendations: aiSummary.recommendations,
        verification_hash: verificationHash
      })
      .select()
      .single()

    if (error) {
      console.error('Summary save error:', error)
      return NextResponse.json({ error: 'Failed to save summary' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      summary
    })
  } catch (error) {
    console.error('Summary generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate summary' 
    }, { status: 500 })
  }
}

function buildSessionNarrative(screenshots: any[], analyses: any[]): string {
  const events = screenshots.map((screenshot, index) => {
    const analysis = analyses.find(a => a.screenshot_id === screenshot.id)
    
    return `
    Event ${index + 1} (${screenshot.trigger_type}):
    - Time: ${new Date(screenshot.created_at).toLocaleTimeString()}
    - Activity: ${analysis?.activity_type || 'Unknown'}
    - Application: ${analysis?.primary_application || 'Unknown'}
    - Productivity: ${analysis?.productivity_score || 0}%
    - Focus: ${analysis?.focus_score || 0}%
    ${screenshot.mouse_x ? `- Click position: (${screenshot.mouse_x}, ${screenshot.mouse_y})` : ''}
    ${analysis?.ai_tool_detected ? `- AI Tool: ${analysis.ai_tool_detected}` : ''}
    ${analysis?.copy_paste_detected ? '- Copy-paste detected' : ''}
    ${screenshot.background_apps?.length > 0 ? `- Background apps: ${screenshot.background_apps.join(', ')}` : ''}
    ${analysis?.suspicious_patterns?.length > 0 ? `- Warnings: ${analysis.suspicious_patterns.join(', ')}` : ''}
    `
  }).join('\n')
  
  return events
}

function calculateSessionMetrics(screenshots: any[], analyses: any[]) {
  const validAnalyses = analyses.filter(a => a.productivity_score != null)
  
  return {
    totalEvents: screenshots.length,
    clickCount: screenshots.filter(s => s.trigger_type === 'click').length,
    keyCount: screenshots.filter(s => ['spacebar', 'enter'].includes(s.trigger_type)).length,
    avgProductivity: validAnalyses.length > 0 
      ? Math.round(validAnalyses.reduce((sum, a) => sum + a.productivity_score, 0) / validAnalyses.length)
      : 0,
    avgFocus: validAnalyses.length > 0
      ? Math.round(validAnalyses.reduce((sum, a) => sum + (a.focus_score || 0), 0) / validAnalyses.length)
      : 0,
    avgAuthenticity: validAnalyses.length > 0
      ? Math.round(validAnalyses.reduce((sum, a) => sum + (a.authenticity_score || 100), 0) / validAnalyses.length)
      : 100,
    suspiciousCount: screenshots.filter(s => s.is_suspicious).length,
    aiUsageCount: analyses.filter(a => a.ai_tool_detected).length,
    copyPasteCount: analyses.filter(a => a.copy_paste_detected).length
  }
}

async function generateAISummary(narrative: string, metrics: any) {
  const prompt = `
  Analyze this work session and provide a comprehensive summary.
  
  Session Data:
  ${narrative}
  
  Metrics:
  - Total events: ${metrics.totalEvents}
  - Clicks: ${metrics.clickCount}
  - Keystrokes: ${metrics.keyCount}
  - Average productivity: ${metrics.avgProductivity}%
  - Average focus: ${metrics.avgFocus}%
  - Authenticity score: ${metrics.avgAuthenticity}%
  - AI tool usage: ${metrics.aiUsageCount} times
  - Copy-paste events: ${metrics.copyPasteCount}
  - Suspicious activities: ${metrics.suspiciousCount}
  
  Provide a JSON response with:
  1. narrative: A professional paragraph describing what was accomplished
  2. accomplishments: Array of specific tasks completed
  3. strengths: Array of positive behaviors observed
  4. improvements: Array of areas that need improvement
  5. wins: Array of {time: string, description: string} for specific good moments
  6. issues: Array of {time: string, description: string, suggestion: string} for problems
  7. recommendations: Array of actionable tips for next session
  
  Be specific and constructive. Focus on helping the user improve.
  `

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a productivity coach analyzing work sessions. Provide constructive, specific feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  } catch (error) {
    console.error('AI summary error:', error)
    
    // Fallback summary
    return {
      narrative: `Completed a ${Math.floor(metrics.totalEvents * 0.5)} minute work session with ${metrics.totalEvents} tracked actions.`,
      accomplishments: ['Work session completed'],
      strengths: metrics.avgProductivity > 70 ? ['Good productivity maintained'] : [],
      improvements: metrics.avgProductivity < 50 ? ['Focus on reducing distractions'] : [],
      wins: [],
      issues: metrics.suspiciousCount > 0 ? [{
        time: 'Session',
        description: 'Automation tools detected',
        suggestion: 'Avoid using automation tools for genuine work verification'
      }] : [],
      recommendations: ['Take regular breaks', 'Minimize context switching']
    }
  }
}

function generateVerificationHash(screenshots: any[]): string {
  const data = screenshots.map(s => ({
    id: s.id,
    sequence: s.sequence_number,
    trigger: s.trigger_type,
    timestamp: s.created_at
  }))
  
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex')
  
  return hash
}
