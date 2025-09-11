import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { screenshot, sessionId, trigger, metadata } = await request.json()

    // Upload screenshot to Supabase Storage
    const fileName = `${user.id}/${sessionId}/${Date.now()}-${metadata.sequenceNumber}.jpg`
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName)

    // Get previous screenshot ID for linking
    let previousScreenshotId = null
    if (metadata.sequenceNumber > 1) {
      const { data: prevScreenshot } = await supabase
        .from('screenshots')
        .select('id')
        .eq('session_id', sessionId)
        .eq('sequence_number', metadata.sequenceNumber - 1)
        .single()
      
      previousScreenshotId = prevScreenshot?.id
    }

    // Save screenshot record
    const { data: screenshotRecord, error: dbError } = await supabase
      .from('screenshots')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        image_url: publicUrl,
        sequence_number: metadata.sequenceNumber,
        previous_screenshot_id: previousScreenshotId,
        trigger_type: trigger,
        mouse_x: metadata.mouseX,
        mouse_y: metadata.mouseY,
        active_window: metadata.activeElement,
        background_apps: metadata.backgroundApps || [],
        metadata: metadata,
        is_suspicious: (metadata.backgroundApps && metadata.backgroundApps.length > 0) || false
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save screenshot' }, { status: 500 })
    }
    
    console.log('Screenshot saved successfully:', {
      sessionId,
      screenshotId: screenshotRecord.id,
      sequenceNumber: metadata.sequenceNumber,
      trigger
    })

    // Analyze screenshot with GPT-4 Vision
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are a productivity analyst. Analyze this screenshot and provide:
              1. productivity_score (0-100): How productive is this activity?
              2. focus_score (0-100): How focused is the user?
              3. efficiency_score (0-100): How efficiently are they working?
              4. activity_type: What are they doing? (coding, writing, researching, etc.)
              5. applications: What applications are visible?
              6. ai_tool_detected: Any AI tools visible? (ChatGPT, Claude, Copilot, etc.)
              7. distractions: Any distracting elements?
              8. copy_paste_detected: Evidence of copy-paste behavior?
              9. suggestions: Brief improvement tips
              
              Return as JSON only.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Trigger: ${trigger}, Mouse position: ${metadata.mouseX ? `(${metadata.mouseX}, ${metadata.mouseY})` : 'N/A'}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })

      const analysisText = response.choices[0].message.content || '{}'
      const analysis = JSON.parse(analysisText)

      // Calculate authenticity score based on patterns
      const authenticityScore = calculateAuthenticityScore(metadata, analysis)

      // Save analysis
      await supabase.from('analyses').insert({
        screenshot_id: screenshotRecord.id,
        session_id: sessionId,
        user_id: user.id,
        productivity_score: analysis.productivity_score || 50,
        focus_score: analysis.focus_score || 50,
        efficiency_score: analysis.efficiency_score || 50,
        authenticity_score: authenticityScore,
        activity_type: analysis.activity_type || 'unknown',
        primary_application: analysis.applications?.[0] || 'unknown',
        applications_used: analysis.applications || [],
        ai_tool_detected: analysis.ai_tool_detected || null,
        ai_interaction_type: analysis.copy_paste_detected ? 'copy' : 'original',
        copy_paste_detected: analysis.copy_paste_detected || false,
        distractions_found: analysis.distractions || [],
        automation_tools_detected: metadata.backgroundApps || [],
        suspicious_patterns: identifySuspiciousPatterns(metadata, analysis),
        raw_analysis: analysis
      })

      // Update daily stats
      await updateDailyStats(user.id, analysis)

    } catch (analysisError) {
      console.error('Analysis error:', analysisError)
      // Continue without analysis - screenshot is still saved
    }

    return NextResponse.json({ 
      success: true,
      screenshot: screenshotRecord
    })

  } catch (error) {
    console.error('Screenshot capture error:', error)
    return NextResponse.json({ 
      error: 'Failed to process screenshot' 
    }, { status: 500 })
  }
}

function calculateAuthenticityScore(metadata: any, analysis: any): number {
  let score = 100

  // Deduct for automation tools
  if (metadata.backgroundApps && metadata.backgroundApps.length > 0) {
    score -= 30
  }

  // Deduct for copy-paste without modification
  if (analysis.copy_paste_detected && !analysis.content_modified) {
    score -= 20
  }

  // Deduct for suspicious timing patterns
  if (metadata.sequenceNumber > 5) {
    // Check if actions are too regular (bot-like)
    // This would need historical data to properly implement
    // For now, just a placeholder
  }

  return Math.max(0, score)
}

function identifySuspiciousPatterns(metadata: any, analysis: any): string[] {
  const patterns: string[] = []

  if (metadata.backgroundApps?.includes('AutoHotkey')) {
    patterns.push('Automation tool detected: AutoHotkey')
  }

  if (metadata.backgroundApps?.includes('Selenium')) {
    patterns.push('Browser automation detected: Selenium')
  }

  if (analysis.copy_paste_detected && analysis.productivity_score > 90) {
    patterns.push('High productivity with copy-paste behavior')
  }

  return patterns
}

async function updateDailyStats(userId: string, analysis: any) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  // Get current stats
  const { data: currentStats } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (currentStats) {
    // Update existing stats
    const newAvgProductivity = Math.round(
      (currentStats.avg_productivity * currentStats.total_sessions + analysis.productivity_score) / 
      (currentStats.total_sessions + 1)
    )
    
    const newAvgFocus = Math.round(
      (currentStats.avg_focus * currentStats.total_sessions + analysis.focus_score) / 
      (currentStats.total_sessions + 1)
    )

    await supabase
      .from('daily_stats')
      .update({
        avg_productivity: newAvgProductivity,
        avg_focus: newAvgFocus,
        ai_usage_count: currentStats.ai_usage_count + (analysis.ai_tool_detected ? 1 : 0)
      })
      .eq('user_id', userId)
      .eq('date', today)
  } else {
    // Create new stats
    await supabase
      .from('daily_stats')
      .insert({
        user_id: userId,
        date: today,
        total_sessions: 1,
        avg_productivity: analysis.productivity_score || 50,
        avg_focus: analysis.focus_score || 50,
        ai_usage_count: analysis.ai_tool_detected ? 1 : 0
      })
  }
}
