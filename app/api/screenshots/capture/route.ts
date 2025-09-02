import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeScreenshot } from '@/lib/ai/gemini'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { screenshot, sessionId, trigger } = await req.json()

    if (!screenshot || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert base64 to blob
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Create unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${sessionId}/${timestamp}.jpg`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filename)

    // Save screenshot record
    const { data: screenshotRecord, error: dbError } = await supabase
      .from('screenshots')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        image_url: publicUrl,
        trigger_type: trigger || 'manual',
        metadata: {
          timestamp: new Date().toISOString(),
          trigger,
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save screenshot' }, { status: 500 })
    }

    // Analyze with enhanced prompt for better summaries
    const analysis = await analyzeScreenshot(base64Data)
    
    if (analysis) {
      // Parse the analysis for more structured data
      let productivity_score = 50
      let focus_score = 50
      let activity_type = 'Working'
      let applications_detected: string[] = []
      let distractions_detected: string[] = []
      let suggestions: string[] = []
      let estimated_task = ''
      let work_category = 'general'

      // Extract productivity score
      const scoreMatch = analysis.match(/productivity[:\s]+(\d+)/i)
      if (scoreMatch) {
        productivity_score = parseInt(scoreMatch[1])
      }

      // Extract focus score
      const focusMatch = analysis.match(/focus[:\s]+(\d+)/i)
      if (focusMatch) {
        focus_score = parseInt(focusMatch[1])
      }

      // Extract activity type
      if (analysis.toLowerCase().includes('coding') || analysis.toLowerCase().includes('programming')) {
        activity_type = 'Coding'
        work_category = 'deep work'
      } else if (analysis.toLowerCase().includes('meeting') || analysis.toLowerCase().includes('video call')) {
        activity_type = 'Meeting'
        work_category = 'collaboration'
      } else if (analysis.toLowerCase().includes('email')) {
        activity_type = 'Email'
        work_category = 'shallow work'
      } else if (analysis.toLowerCase().includes('research') || analysis.toLowerCase().includes('reading')) {
        activity_type = 'Research'
        work_category = 'deep work'
      } else if (analysis.toLowerCase().includes('social media') || analysis.toLowerCase().includes('youtube')) {
        activity_type = 'Distracted'
        work_category = 'distraction'
        productivity_score = Math.min(productivity_score, 30)
      }

      // Extract applications
      const appPatterns = [
        'Chrome', 'Firefox', 'Safari', 'VS Code', 'Visual Studio',
        'Slack', 'Discord', 'Teams', 'Zoom', 'Gmail', 'Outlook',
        'Figma', 'Photoshop', 'Terminal', 'YouTube', 'Twitter',
        'Facebook', 'Instagram', 'LinkedIn', 'Notion', 'Obsidian'
      ]
      
      appPatterns.forEach(app => {
        if (analysis.toLowerCase().includes(app.toLowerCase())) {
          applications_detected.push(app)
        }
      })

      // Extract task estimation
      const taskMatch = analysis.match(/(?:working on|task:|doing:)\s*([^.]+)/i)
      if (taskMatch) {
        estimated_task = taskMatch[1].trim()
      }

      // Identify distractions
      const distractionKeywords = ['social media', 'youtube', 'twitter', 'facebook', 'instagram', 'reddit', 'news', 'shopping']
      distractionKeywords.forEach(keyword => {
        if (analysis.toLowerCase().includes(keyword)) {
          distractions_detected.push(keyword)
        }
      })

      // Generate suggestions based on analysis
      if (productivity_score < 50) {
        suggestions.push('Consider closing non-work related tabs')
        suggestions.push('Try using focus mode or website blockers')
      }
      if (distractions_detected.length > 0) {
        suggestions.push('Minimize distractions by using dedicated work browser profile')
      }
      if (work_category === 'shallow work' && productivity_score < 70) {
        suggestions.push('Batch similar tasks together for better efficiency')
      }

      // Save analysis with enhanced data
      const { error: analysisError } = await supabase
        .from('analyses')
        .insert({
          screenshot_id: screenshotRecord.id,
          user_id: user.id,
          session_id: sessionId,
          productivity_score,
          focus_score,
          activity_type,
          work_category,
          applications_detected,
          is_productive: productivity_score >= 60,
          distractions_detected,
          suggestions,
          estimated_task,
          raw_analysis: {
            text: analysis,
            timestamp: new Date().toISOString(),
            trigger
          }
        })

      if (analysisError) {
        console.error('Analysis save error:', analysisError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      screenshot: screenshotRecord,
      analysis: analysis || 'Analysis pending'
    })
  } catch (error) {
    console.error('Screenshot capture error:', error)
    return NextResponse.json({ 
      error: 'Failed to process screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
