import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSessionSchema } from '@/lib/validations/api'
import { rateLimit } from '@/lib/middleware/rateLimiter'
import { authenticateRequest } from '@/lib/auth/server'
import { log } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - limit session creation
    const rateLimitResult = await rateLimit(request, {
      key: 'session-create',
      points: 5, // 5 sessions per
      duration: 300, // 5 minutes
    })
    if (rateLimitResult) return rateLimitResult

    // Authentication
    const { user, error: authError } = await authenticateRequest(request)
    if (authError) return authError

    // Validate request
    const body = await request.json()
    const validationResult = createSessionSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      )
    }

    const { name, projectName, clientName } = validationResult.data
    const supabase = createClient()

    // Check for active sessions
    const { data: activeSessions } = await supabase
      .from('workflow_sessions')
      .select('id')
      .eq('user_id', user!.id)
      .eq('status', 'active')

    if (activeSessions && activeSessions.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active session. Please end it before starting a new one.' },
        { status: 400 }
      )
    }

    // Get user's profession for customized tracking
    const { data: profile } = await supabase
      .from('profiles')
      .select('profession')
      .eq('id', user!.id)
      .single()

    const { data: session, error } = await supabase
      .from('workflow_sessions')
      .insert({
        user_id: user!.id,
        name: name || `Session - ${new Date().toLocaleString()}`,
        project_name: projectName,
        status: 'active',
        start_time: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      log.error('Session creation error', {
        error: error.message,
        userId: user!.id
      })
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    // Initialize or update daily stats (if table exists)
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Try to increment daily sessions directly since functions don't exist
      const { error: statsError } = await supabase
        .from('daily_stats')
        .upsert({
          user_id: user!.id,
          date: today,
          total_sessions: 1
        }, {
          onConflict: 'user_id,date'
        })

      if (statsError) {
        log.warn('Daily stats table not available', { error: statsError.message })
      }
    } catch (error) {
      log.warn('Daily stats update skipped', { error: 'Table not found' })
    }

    log.info('Session created successfully', {
      sessionId: session.id,
      userId: user!.id,
      name: session.name
    })

    return NextResponse.json({ 
      success: true,
      session
    })
  } catch (error) {
    log.error('Session creation error', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
