import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test database connection
    const { data: sessions, error: sessionsError } = await supabase
      .from('workflow_sessions')
      .select('*')
      .eq('user_id', user.id)
      .limit(5)

    // Test storage access
    const { data: files, error: storageError } = await supabase.storage
      .from('screenshots')
      .list('', { limit: 5 })

    // Test table structure
    const { data: screenshots, error: screenshotsError } = await supabase
      .from('screenshots')
      .select('*')
      .eq('user_id', user.id)
      .limit(5)

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      database: {
        sessions: sessionsError ? `Error: ${sessionsError.message}` : `${sessions?.length || 0} sessions found`,
        screenshots: screenshotsError ? `Error: ${screenshotsError.message}` : `${screenshots?.length || 0} screenshots found`
      },
      storage: storageError ? `Error: ${storageError.message}` : `${files?.length || 0} files found`,
      environment: {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error.message 
    }, { status: 500 })
  }
}
