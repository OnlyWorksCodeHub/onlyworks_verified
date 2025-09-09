import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { screenshotId, imageUrl, sessionId } = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Analyzing screenshot:', screenshotId)

    // Call OpenAI Vision API with the NEW model
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Updated model name
      messages: [
        {
          role: "system",
          content: `You are a productivity analyst. Analyze this screenshot and provide detailed insights about:
          1. What work is being done (be specific)
          2. The application being used
          3. Productivity score (0-100)
          4. Focus score (0-100)
          5. Whether AI tools are being used and how effectively
          6. Any signs of distraction or non-work activity
          7. Task description in 1-2 sentences
          
          Return a JSON object with these exact fields:
          {
            "productivity_score": number,
            "focus_score": number,
            "work_type": string (coding/designing/writing/analyzing/meeting/researching/planning/other),
            "application_used": string,
            "task_description": string,
            "ai_tool_detected": boolean,
            "ai_tool_name": string or null,
            "ai_usage_type": string or null (generating/reviewing/editing/learning),
            "ai_effectiveness_score": number or null,
            "is_productive": boolean,
            "distraction_detected": boolean,
            "distraction_type": string or null,
            "content_type": string,
            "content_complexity": string (low/medium/high)
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            },
            {
              type: "text",
              text: "Analyze this screenshot for productivity and work patterns."
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    })

    const analysisText = response.choices[0].message.content
    console.log('OpenAI response:', analysisText)

    let analysis
    try {
      // Clean OpenAI response - remove markdown code blocks and other artifacts  
      let cleanedText = analysisText || '{}'
      console.log('Raw OpenAI response:', cleanedText.substring(0, 200) + '...')
      
      // More aggressive cleaning
      cleanedText = cleanedText
        .replace(/```json\s*/gi, '')  // Remove ```json
        .replace(/```\s*/g, '')       // Remove ```
        .replace(/^[^{]*{/, '{')      // Remove anything before first {
        .replace(/}[^}]*$/, '}')      // Remove anything after last }
        .trim()
      
      console.log('Cleaned text:', cleanedText.substring(0, 200) + '...')
      
      // Parse the JSON response
      analysis = JSON.parse(cleanedText)
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e)
      // Fallback analysis
      analysis = {
        productivity_score: 70,
        focus_score: 70,
        work_type: 'general',
        application_used: 'Unknown',
        task_description: 'Working on computer',
        ai_tool_detected: false,
        ai_tool_name: null,
        ai_usage_type: null,
        ai_effectiveness_score: null,
        is_productive: true,
        distraction_detected: false,
        distraction_type: null,
        content_type: 'work',
        content_complexity: 'medium'
      }
    }

    // Save analysis to database with proper field mapping
    const { data: savedAnalysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        screenshot_id: screenshotId,
        session_id: sessionId,
        user_id: user.id,
        productivity_score: analysis.productivity_score,
        focus_score: analysis.focus_score,
        efficiency_score: analysis.efficiency_score || analysis.productivity_score,
        authenticity_score: analysis.authenticity_score || 100,
        activity_type: analysis.work_type || analysis.activity_type,
        primary_application: analysis.application_used || analysis.primary_application,
        ai_tool_detected: analysis.ai_tool_name || (analysis.ai_tool_detected ? 'detected' : null),
        ai_interaction_type: analysis.ai_usage_type || analysis.ai_interaction_type,
        // New columns (will be added by SQL migration) - remove if missing from DB
        // content_type: analysis.content_type,
        // content_complexity: analysis.content_complexity,
        // distraction_detected: analysis.distraction_detected || false,
        // distraction_type: analysis.distraction_type,
        // task_description: analysis.task_description,
        // is_productive: analysis.is_productive !== false,
        // work_type: analysis.work_type,
        raw_analysis: analysis
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    console.log('Analysis saved:', savedAnalysis)

    return NextResponse.json({ 
      success: true, 
      analysis: savedAnalysis 
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze screenshot',
      details: error.message 
    }, { status: 500 })
  }
}
