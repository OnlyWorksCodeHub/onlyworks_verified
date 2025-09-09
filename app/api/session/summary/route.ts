import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { detectSuspiciousPatterns, calculateAuthenticityScore } from '@/lib/utils/fraud-detection'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { sessionId } = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Generating summary for session:', sessionId)

    // Get all analyses for the session
    const { data: analyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    // Get all screenshots for fraud detection
    const { data: screenshots } = await supabase
      .from('screenshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true })

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ 
        error: 'No analyses found for this session' 
      }, { status: 404 })
    }

    // Calculate metrics
    const avgProductivity = Math.round(
      analyses.reduce((sum, a) => sum + (a.productivity_score || 0), 0) / analyses.length
    )
    
    const avgFocus = Math.round(
      analyses.reduce((sum, a) => sum + (a.focus_score || 0), 0) / analyses.length
    )

    // Detect suspicious patterns
    const suspiciousPatterns = detectSuspiciousPatterns(screenshots || [], analyses)
    const authenticityScore = calculateAuthenticityScore(suspiciousPatterns)

    // Get AI tools usage
    const aiToolsSet = new Set(analyses
      .filter(a => a.ai_tool_detected)
      .map(a => a.ai_tool_detected))
    const aiToolsUsed = Array.from(aiToolsSet)

    const aiUsagePercentage = Math.round(
      (analyses.filter(a => a.ai_tool_detected).length / analyses.length) * 100
    )

    // Generate narrative using GPT with the NEW model
    const narrativePrompt = `Based on these work analyses, write a professional 2-3 sentence summary of what was accomplished:
    
    Activity types:
    ${analyses.map(a => a.activity_type).filter(Boolean).join(', ')}
    
    Applications used:
    ${analyses.map(a => a.primary_application).filter(Boolean).join(', ')}
    
    Average productivity: ${avgProductivity}%
    Average focus: ${avgFocus}%
    AI tools used: ${aiToolsUsed.join(', ') || 'None'}
    
    Write a concise, professional summary that highlights the main accomplishments.`

    const narrativeResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Updated model name
      messages: [
        {
          role: "system",
          content: "You are a professional work summary writer. Write concise, factual summaries."
        },
        {
          role: "user",
          content: narrativePrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.5
    })

    const workNarrative = narrativeResponse.choices[0].message.content || 
      'Completed a productive work session with consistent focus.'

    // Extract accomplishments
    const accomplishments = analyses
      .filter(a => a.is_productive && a.task_description)
      .map(a => a.task_description)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5)

    // Generate feedback
    const strengths = []
    const improvements = []
    const recommendations = []

    if (avgProductivity >= 80) {
      strengths.push('Maintained high productivity throughout the session')
    }
    if (avgFocus >= 80) {
      strengths.push('Excellent focus with minimal distractions')
    }
    if (aiUsagePercentage > 0 && aiUsagePercentage < 50) {
      strengths.push('Balanced use of AI tools to enhance productivity')
    }

    if (avgProductivity < 60) {
      improvements.push('Increase focus on productive tasks')
      recommendations.push('Use time-blocking to allocate specific periods for focused work')
    }
    if (analyses.filter(a => a.distraction_detected).length > analyses.length * 0.3) {
      improvements.push('Reduce time spent on distracting websites')
      recommendations.push('Consider using website blockers during work sessions')
    }
    if (authenticityScore < 80) {
      improvements.push('Work patterns appear automated or suspicious')
    }

    // Save summary to database
    const { data: summary, error: summaryError } = await supabase
      .from('session_summaries')
      .upsert({
        session_id: sessionId,
        user_id: user.id,
        total_screenshots: screenshots?.length || 0,
        avg_productivity_score: avgProductivity,
        avg_focus_score: avgFocus,
        avg_authenticity_score: authenticityScore,
        // primary_work_type: analyses[0]?.work_type || 'general', // commented out if missing from DB
        work_narrative: workNarrative,
        accomplishments,
        // ai_tools_used: aiToolsUsed, // commented out if missing from DB
        // ai_usage_percentage: aiUsagePercentage, // commented out if missing from DB
        // ai_effectiveness_rating column doesn't exist, removing it
        strengths,
        improvements,
        recommendations
        // automation_detected: authenticityScore < 80, // commented out if missing from DB
        // suspicious_patterns: suspiciousPatterns.length > 0 ? suspiciousPatterns : null // commented out if missing from DB
      })
      .select()
      .single()

    if (summaryError) {
      console.error('Summary save error:', summaryError)
      throw summaryError
    }

    console.log('Summary generated:', summary)

    return NextResponse.json({ 
      success: true, 
      summary 
    })
  } catch (error: any) {
    console.error('Summary generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate summary',
      details: error.message 
    }, { status: 500 })
  }
}
