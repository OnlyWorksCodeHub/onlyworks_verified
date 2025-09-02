import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Debug: Check what data exists
    const { data: screenshots, error: screenshotError } = await supabase
      .from('screenshots')
      .select('*')
      .eq('user_id', user.id)
    
    const { data: analyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
    
    const { data: sessions } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('user_id', user.id)

    console.log('User stats debug:', {
      userId: user.id,
      screenshotsCount: screenshots?.length || 0,
      analysesCount: analyses?.length || 0,
      sessionsCount: sessions?.length || 0
    })

    return NextResponse.json({
      screenshots: screenshots || [],
      analyses: analyses || [],
      sessions: sessions || [],
      debug: {
        userId: user.id,
        email: user.email,
        screenshotsCount: screenshots?.length || 0,
        analysesCount: analyses?.length || 0,
        sessionsCount: sessions?.length || 0
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
