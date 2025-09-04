import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { screenshot, sessionId, trigger, backgroundApps } = body

    if (!screenshot || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract base64 data
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Generate filename
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
      console.error('Storage upload error:', uploadError)
      // Create bucket if it doesn't exist
      if (uploadError.message?.includes('not found')) {
        await supabase.storage.createBucket('screenshots', { public: true })
        // Retry upload
        const { data: retryData, error: retryError } = await supabase.storage
          .from('screenshots')
          .upload(filename, buffer, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
          })
        if (retryError) {
          return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 })
      }
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
          backgroundApps: backgroundApps || []
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save screenshot record' }, { status: 500 })
    }

    // Analyze with GPT-4 Vision
    let analysisResult = null
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this screenshot and provide:
                1. Productivity score (0-100)
                2. Main activity type (Coding, Meeting, Email, Research, Social Media, etc.)
                3. Applications visible on screen
                4. Estimated task being performed
                5. Whether this appears to be productive work

                Also note these background apps were running: ${backgroundApps?.join(', ') || 'Unknown'}
                
                Format your response as JSON with these fields:
                - productivity_score: number
                - activity_type: string
                - applications_detected: array of strings
                - estimated_task: string
                - is_productive: boolean
                - analysis_notes: string`
              },
              {
                type: "image_url",
                image_url: {
                  url: screenshot,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })

      const analysisText = response.choices[0]?.message?.content || '{}'
      let parsedAnalysis
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedAnalysis = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch {
        // Fallback parsing
        parsedAnalysis = {
          productivity_score: 50,
          activity_type: 'Unknown',
          applications_detected: [],
          estimated_task: 'Unable to determine',
          is_productive: false,
          analysis_notes: analysisText
        }
      }

      // Save analysis
      const { data: analysisRecord, error: analysisError } = await supabase
        .from('analyses')
        .insert({
          screenshot_id: screenshotRecord.id,
          user_id: user.id,
          session_id: sessionId,
          productivity_score: parsedAnalysis.productivity_score || 50,
          activity_type: parsedAnalysis.activity_type || 'Unknown',
          applications_detected: parsedAnalysis.applications_detected || [],
          background_apps: backgroundApps || [],
          estimated_task: parsedAnalysis.estimated_task || '',
          is_productive: parsedAnalysis.is_productive || false,
          raw_analysis: {
            gpt4_response: analysisText,
            parsed: parsedAnalysis,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (!analysisError) {
        analysisResult = analysisRecord
      }
    } catch (aiError) {
      console.error('GPT-4 Vision analysis error:', aiError)
    }

    return NextResponse.json({ 
      success: true, 
      screenshot: {
        id: screenshotRecord.id,
        url: publicUrl,
        created_at: screenshotRecord.created_at
      },
      analysis: analysisResult
    })
    
  } catch (error) {
    console.error('Screenshot capture error:', error)
    return NextResponse.json({ 
      error: 'Failed to process screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
