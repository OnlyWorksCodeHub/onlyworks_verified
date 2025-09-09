import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { captureScreenshotSchema } from '@/lib/validations/api'
import { rateLimit } from '@/lib/middleware/rateLimiter'
import { authenticateRequest } from '@/lib/auth/server'
import { log } from '@/lib/logger'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      key: 'screenshot-capture',
      points: 60, // 60 screenshots per
      duration: 60, // 1 minute
    })
    if (rateLimitResult) return rateLimitResult

    // Authentication
    const { user, error: authError } = await authenticateRequest(request)
    if (authError) return authError

    // Parse and validate request body
    const body = await request.json()
    const validationResult = captureScreenshotSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { screenshot, sessionId, trigger, metadata } = validationResult.data
    
    log.info('Processing screenshot capture', {
      userId: user!.id,
      sessionId,
      trigger,
      sequenceNumber: metadata?.sequenceNumber
    })

    // Use regular server client, not service key
    const supabase = createClient()
    
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('workflow_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user!.id)
      .single()

    if (sessionError || !session) {
      log.warn('Invalid session access attempt', { userId: user!.id, sessionId })
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      )
    }

    // Process the image
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Validate image size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image too large (max 5MB)' },
        { status: 413 }
      )
    }
    
    const fileName = `${user!.id}/${sessionId}/${Date.now()}.jpg`
    
    // Start database transaction
    let uploadData: any = null
    let dbRecord: any = null
    
    try {
      // Upload to storage first
      const uploadResult = await supabase.storage
        .from('screenshots')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        })

      if (uploadResult.error) {
        log.error('Screenshot upload failed', {
          error: uploadResult.error.message,
          userId: user!.id,
          sessionId
        })
        return NextResponse.json(
          { 
            error: 'Upload failed',
            details: uploadResult.error.message
          },
          { status: 500 }
        )
      }

      uploadData = uploadResult.data

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName)

      // Save to database (without metadata column)
      const dbResult = await supabase
        .from('screenshots')
        .insert({
          session_id: sessionId,
          user_id: user!.id,
          image_url: publicUrl,
          trigger_type: trigger,
          sequence_number: metadata?.sequenceNumber || 1,
          mouse_x: metadata?.mouseX || null,
          mouse_y: metadata?.mouseY || null
        })
        .select()
        .single()

      if (dbResult.error) {
        throw new Error(`Database save failed: ${dbResult.error.message}`)
      }

      dbRecord = dbResult.data

    } catch (atomicError: any) {
      log.error('Atomic operation failed', {
        error: atomicError.message,
        userId: user!.id,
        sessionId
      })
      
      // Clean up uploaded file if it exists
      if (uploadData) {
        await supabase.storage.from('screenshots').remove([fileName])
      }
      
      return NextResponse.json(
        { error: 'Failed to save screenshot' },
        { status: 500 }
      )
    }

    log.info('Screenshot captured successfully', {
      screenshotId: dbRecord.id,
      userId: user!.id,
      sessionId
    })

    // Get public URL for analysis
    const { data: { publicUrl: analysisUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName)

    // Trigger screenshot analysis in the background (don't wait for it)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/screenshot/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({
        screenshotId: dbRecord.id,
        imageUrl: analysisUrl,
        sessionId
      })
    }).catch(error => {
      log.error('Background analysis failed', { 
        screenshotId: dbRecord.id, 
        error: error.message 
      })
    })

    // Don't await the analysis - return success immediately
    return NextResponse.json({ 
      success: true,
      screenshot: dbRecord,
      analysisTriggered: true
    })

  } catch (error: any) {
    log.error('Screenshot capture error', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}
