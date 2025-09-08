import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, projectName, clientName } = await request.json()

    // Get user's profession for customized tracking
    const { data: profile } = await supabase
      .from('profiles')
      .select('profession')
      .eq('id', user.id)
      .single()

    const { data: session, error } = await supabase
      .from('workflow_sessions')
      .insert({
        user_id: user.id,
        name: name || `Session - ${new Date().toLocaleString()}`,
        project_name: projectName,
        client_name: clientName,
        profession_type: profile?.profession || 'other',
        status: 'active',
        metadata: {
          start_time: new Date().toISOString(),
          browser: request.headers.get('user-agent') || 'unknown'
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Session creation error:', error)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Initialize daily stats if needed
    const today = new Date().toISOString().split('T')[0]
    const { data: existingStats } = await supabase
      .from('daily_stats')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (!existingStats) {
      await supabase
        .from('daily_stats')
        .insert({
          user_id: user.id,
          date: today,
          total_sessions: 1
        })
    } else {
      await supabase
        .from('daily_stats')
        .update({
          total_sessions: supabase.raw('total_sessions + 1')
        })
        .eq('user_id', user.id)
        .eq('date', today)
    }

    return NextResponse.json({ 
      success: true,
      session
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create session' 
    }, { status: 500 })
  }
}
