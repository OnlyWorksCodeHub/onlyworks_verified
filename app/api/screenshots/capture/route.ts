import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeScreenshot } from '@/lib/ai/gemini'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.formData()
    
    const screenshot = formData.get('screenshot') as File
    const sessionId = formData.get('sessionId') as string
    const userId = formData.get('userId') as string
    const base64 = formData.get('base64') as string
    
    if (!screenshot || !sessionId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await screenshot.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Supabase Storage
    const fileName = `${userId}/${sessionId}/${Date.now()}.jpg`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Construct the public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/${fileName}`

    // Save to database WITHOUT metadata column
    const { data: screenshotData, error: dbError } = await supabase
      .from('screenshots')
      .insert({
        user_id: userId,
        session_id: sessionId,
        image_url: publicUrl,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    // Analyze with AI
    let analysis = null
    if (base64 && process.env.GEMINI_API_KEY) {
      try {
        analysis = await analyzeScreenshot(base64)
        
        await supabase.from('analyses').insert({
          screenshot_id: screenshotData.id,
          user_id: userId,
          productivity_score: analysis.productivity_score || 75,
          activity_type: analysis.activity_type || 'working',
          raw_analysis: analysis,
        })
      } catch (aiError) {
        console.error('AI analysis error:', aiError)
      }
    }

    return NextResponse.json({ 
      success: true,
      screenshot: screenshotData,
      analysis 
    })
  } catch (error) {
    console.error('Screenshot capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture screenshot' },
      { status: 500 }
    )
  }
}
