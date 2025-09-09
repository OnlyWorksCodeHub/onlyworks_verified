import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sessionIdSchema } from '@/lib/validations/api'
import { rateLimit } from '@/lib/middleware/rateLimiter'
import { authenticateRequest } from '@/lib/auth/server'
import { log } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      key: 'session-end',
      points: 10,
      duration: 60,
    })
    if (rateLimitResult) return rateLimitResult

    // Authentication
    const { user, error: authError } = await authenticateRequest(request)
    if (authError) return authError

    // Validate request
    const body = await request.json()
    const validationResult = sessionIdSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { sessionId } = validationResult.data
    const supabase = createClient()

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user!.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Session already completed' },
        { status: 400 }
      )
    }

    // Get screenshot statistics
    const { count, data: screenshots } = await supabase
      .from('screenshots')
      .select('created_at', { count: 'exact' })
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    const screenshotCount = count || 0
    
    // Calculate actual work duration (excluding gaps > 5 minutes)
    let totalDuration = 0
    if (screenshots && screenshots.length > 1) {
      for (let i = 1; i < screenshots.length; i++) {
        const gap = new Date(screenshots[i].created_at).getTime() - 
                   new Date(screenshots[i-1].created_at).getTime()
        // Only count gaps less than 5 minutes as work time
        if (gap < 5 * 60 * 1000) {
          totalDuration += gap
        }
      }
      totalDuration = Math.floor(totalDuration / 1000) // Convert to seconds
    }

    // Update session
    const { error: updateError } = await supabase
      .from('workflow_sessions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        total_duration: totalDuration
      })
      .eq('id', sessionId)
      .eq('user_id', user!.id)

    if (updateError) {
      log.error('Failed to end session', {
        error: updateError.message,
        sessionId,
        userId: user!.id
      })
      throw updateError
    }

    // Update daily stats (if table exists)
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Try to upsert daily stats directly since functions don't exist
      const { error: statsError } = await supabase
        .from('daily_stats')
        .upsert({
          user_id: user!.id,
          date: today,
          total_sessions: 1,
          total_duration: totalDuration
        }, {
          onConflict: 'user_id,date'
        })

      if (statsError) {
        log.warn('Daily stats table not available', { error: statsError.message })
      }
    } catch (error) {
      log.warn('Daily stats update skipped', { error: 'Table not found' })
    }

    log.info('Session ended successfully', {
      sessionId,
      userId: user!.id,
      duration: totalDuration,
      screenshotCount
    })

    // If session has screenshots, trigger report generation
    let reportGenerated = false
    if (screenshotCount > 0) {
      // Wait a moment for any pending analyses to complete
      setTimeout(async () => {
        try {
          const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reports/generate`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cookie': request.headers.get('cookie') || ''
            },
            body: JSON.stringify({ sessionId })
          })
          
          if (reportResponse.ok) {
            log.info('Report generated successfully for session', { sessionId })
          } else {
            log.warn('Report generation failed', { sessionId })
          }
        } catch (error: any) {
          log.error('Background report generation failed', { 
            sessionId, 
            error: error.message 
          })
        }
      }, 3000) // Wait 3 seconds for analyses to complete
      
      reportGenerated = true
    }

    return NextResponse.json({ 
      success: true,
      screenshotCount,
      duration: totalDuration,
      readyForAnalysis: screenshotCount > 0,
      reportGenerationTriggered: reportGenerated
    })

  } catch (error: any) {
    log.error('Session end error', error)
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    )
  }
}
