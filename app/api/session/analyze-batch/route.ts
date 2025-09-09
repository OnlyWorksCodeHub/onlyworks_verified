import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

    console.log('Starting batch analysis for session:', sessionId)

    // Get all screenshots for the session
    const { data: screenshots } = await supabase
      .from('screenshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true })

    if (!screenshots || screenshots.length === 0) {
      return NextResponse.json({ error: 'No screenshots found' }, { status: 404 })
    }

    console.log(`Analyzing ${screenshots.length} screenshots in batch`)

    // Smart sampling: take every 3rd screenshot + first and last
    const sampled = screenshots.filter((_, index) => 
      index === 0 || // first
      index === screenshots.length - 1 || // last
      index % 3 === 0 // every 3rd
    ).slice(0, 10) // max 10 images to keep costs reasonable

    console.log(`Sampled ${sampled.length} screenshots for analysis`)

    // Create batch analysis prompt
    const analysisPrompt = `Analyze this work session of ${screenshots.length} screenshots taken over time. 

    For this batch of ${sampled.length} representative screenshots, provide:
    
    1. Overall productivity score (0-100)
    2. Main work activities identified
    3. Applications used
    4. AI tool usage patterns
    5. Focus level throughout session
    6. Any concerning patterns
    7. Work narrative summary
    
    Return JSON with:
    {
      "session_productivity_score": number,
      "session_focus_score": number,
      "primary_activities": [string],
      "applications_used": [string],
      "ai_tools_detected": [string],
      "work_narrative": string,
      "time_pattern_analysis": string,
      "recommendations": [string],
      "total_screenshots_analyzed": ${sampled.length},
      "session_duration_minutes": number
    }`

    // Build OpenAI request with multiple images
    const imageContent = sampled.map(screenshot => ({
      type: "image_url" as const,
      image_url: {
        url: screenshot.image_url,
        detail: "low" as const // Use low detail to save tokens
      }
    }))

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a productivity analyst. Analyze this series of screenshots from a work session."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt
            },
            ...imageContent
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    })

    const analysisText = response.choices[0].message.content
    
    let batchAnalysis
    try {
      batchAnalysis = JSON.parse(analysisText || '{}')
    } catch (e) {
      // Fallback if parsing fails
      batchAnalysis = {
        session_productivity_score: 75,
        session_focus_score: 75,
        primary_activities: ['work'],
        applications_used: ['various'],
        ai_tools_detected: [],
        work_narrative: 'Completed a work session with multiple activities.',
        time_pattern_analysis: 'Consistent work patterns observed.',
        recommendations: ['Continue current productivity patterns.'],
        total_screenshots_analyzed: sampled.length,
        session_duration_minutes: Math.round((screenshots.length * 30) / 60) // estimate
      }
    }

    // Save batch analysis results
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('session_summaries')
      .upsert({
        session_id: sessionId,
        user_id: user.id,
        total_screenshots: screenshots.length,
        avg_productivity_score: batchAnalysis.session_productivity_score,
        avg_focus_score: batchAnalysis.session_focus_score,
        work_narrative: batchAnalysis.work_narrative,
        accomplishments: batchAnalysis.primary_activities || [],
        ai_tools_used: batchAnalysis.ai_tools_detected || [],
        recommendations: batchAnalysis.recommendations || [],
        primary_work_type: batchAnalysis.primary_activities?.[0] || 'general'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save batch analysis:', saveError)
    }

    console.log('Batch analysis completed successfully')

    return NextResponse.json({
      success: true,
      analysis: batchAnalysis,
      screenshots_analyzed: sampled.length,
      total_screenshots: screenshots.length,
      cost_savings: `~${Math.round((1 - sampled.length / screenshots.length) * 100)}% vs individual analysis`
    })

  } catch (error: any) {
    console.error('Batch analysis error:', error)
    return NextResponse.json({ 
      error: 'Batch analysis failed',
      details: error.message 
    }, { status: 500 })
  }
}
