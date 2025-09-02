import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all user data
    const [profile, sessions, screenshots, analyses, dailyStats] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', params.userId).single(),
      supabase.from('workflow_sessions').select('*').eq('user_id', params.userId),
      supabase.from('screenshots').select('*').eq('user_id', params.userId),
      supabase.from('analyses').select('*').eq('user_id', params.userId),
      supabase.from('daily_stats').select('*').eq('user_id', params.userId),
    ])

    const exportData = {
      profile: profile.data,
      sessions: sessions.data,
      screenshots: screenshots.data,
      analyses: analyses.data,
      dailyStats: dailyStats.data,
      exportedAt: new Date().toISOString(),
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}