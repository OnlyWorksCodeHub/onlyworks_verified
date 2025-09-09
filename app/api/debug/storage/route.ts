import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // List all storage files
    const { data: files, error: listError } = await supabase.storage
      .from('screenshots')
      .list('', { limit: 100 })

    // List user-specific files
    const { data: userFiles, error: userListError } = await supabase.storage
      .from('screenshots')
      .list(user.id, { limit: 100 })

    // Get database records
    const { data: dbScreenshots } = await supabase
      .from('screenshots')
      .select('id, image_url, created_at, trigger_type, active_window, sequence_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get session records
    const { data: sessions } = await supabase
      .from('workflow_sessions')
      .select('id, name, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get analyses records
    const { data: analyses } = await supabase
      .from('analyses')
      .select('id, screenshot_id, primary_application, activity_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email
      },
      storage: {
        allFiles: files?.map(f => ({ name: f.name, size: f.metadata?.size })) || [],
        allFilesError: listError?.message,
        userFiles: userFiles?.map(f => ({ name: f.name, size: f.metadata?.size })) || [],
        userFilesError: userListError?.message
      },
      database: {
        screenshots: dbScreenshots || [],
        sessions: sessions || [],
        analyses: analyses || []
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
