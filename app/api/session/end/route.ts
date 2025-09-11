import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { sessionId } = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all screenshots from the session
    const { data: screenshots } = await supabase
      .from('screenshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true })

    // Get AI analyses
    const { data: analyses } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('session_id', sessionId)

    // Calculate session duration
    const startTime = screenshots?.[0]?.created_at
    const endTime = screenshots?.[screenshots.length - 1]?.created_at
    const duration = startTime && endTime ? 
      Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) : 0

    // Generate smart session name based on work done
    const sessionName = generateSessionName(analyses)

    // Update session with proper name and status
    const { error: updateError } = await supabase
      .from('workflow_sessions')
      .update({
        name: sessionName,
        status: 'completed',
        end_time: new Date().toISOString(),
        total_duration: duration
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Generate summary if there are analyses
    if (analyses && analyses.length > 0) {
      await generateSessionSummary(sessionId, analyses, screenshots, user.id)
    }

    return NextResponse.json({ 
      success: true,
      sessionName,
      duration 
    })
  } catch (error) {
    console.error('Session end error:', error)
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}

function generateSessionName(analyses: any[]): string {
  if (!analyses || analyses.length === 0) {
    return `Work Session ${new Date().toLocaleDateString()}`
  }

  // Count task types
  const taskTypes: { [key: string]: number } = {}
  const applications: { [key: string]: number } = {}
  
  analyses.forEach(analysis => {
    if (analysis.work_type) {
      taskTypes[analysis.work_type] = (taskTypes[analysis.work_type] || 0) + 1
    }
    if (analysis.application_used) {
      applications[analysis.application_used] = (applications[analysis.application_used] || 0) + 1
    }
  })

  // Find dominant task type
  const dominantTask = Object.entries(taskTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0]

  // Find dominant application
  const dominantApp = Object.entries(applications)
    .sort(([,a], [,b]) => b - a)[0]?.[0]

  // Generate name based on work type
  if (dominantTask) {
    const taskNames: { [key: string]: string } = {
      'coding': 'Development Session',
      'designing': 'Design Work',
      'writing': 'Writing Session',
      'analyzing': 'Data Analysis',
      'meeting': 'Meeting Notes',
      'researching': 'Research Session',
      'planning': 'Planning Session',
      'debugging': 'Debugging Session',
      'testing': 'Testing Session',
      'reviewing': 'Code Review'
    }
    
    return taskNames[dominantTask.toLowerCase()] || `${dominantTask} Session`
  } else if (dominantApp) {
    return `${dominantApp} Work`
  }

  return `Productive Session`
}

async function generateSessionSummary(
  sessionId: string, 
  analyses: any[], 
  screenshots: any[],
  userId: string
) {
  const supabase = createClient()
  
  // Calculate averages
  const avgProductivity = Math.round(
    analyses.reduce((sum, a) => sum + (a.productivity_score || 0), 0) / analyses.length
  )
  
  const avgFocus = Math.round(
    analyses.reduce((sum, a) => sum + (a.focus_score || 0), 0) / analyses.length
  )

  // Calculate authenticity (check for automation)
  const suspiciousCount = screenshots.filter(s => s.is_suspicious).length
  const authenticityScore = Math.round((1 - suspiciousCount / screenshots.length) * 100)

  // Generate work narrative
  const workNarrative = generateWorkNarrative(analyses)
  const accomplishments = extractAccomplishments(analyses)
  
  // Insert summary
  await supabase
    .from('session_summaries')
    .insert({
      session_id: sessionId,
      user_id: userId,
      total_screenshots: screenshots.length,
      avg_productivity_score: avgProductivity,
      avg_focus_score: avgFocus,
      avg_authenticity_score: authenticityScore,
      work_narrative: workNarrative,
      accomplishments,
      authenticity_verified: authenticityScore >= 80,
      primary_work_type: analyses[0]?.work_type || 'general'
    })
}

function generateWorkNarrative(analyses: any[]): string {
  const tasks = analyses
    .filter(a => a.task_description)
    .map(a => a.task_description)
    .filter((v, i, a) => a.indexOf(v) === i) // unique tasks
  
  if (tasks.length === 0) {
    return 'Completed a focused work session with consistent productivity.'
  }
  
  return `Worked on ${tasks.length} different tasks including: ${tasks.slice(0, 3).join(', ')}. ` +
         `Maintained an average productivity level throughout the session.`
}

function extractAccomplishments(analyses: any[]): string[] {
  const accomplishments: string[] = []
  
  // Extract unique productive tasks
  const productiveTasks = analyses
    .filter(a => a.is_productive && a.task_description)
    .map(a => a.task_description)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5)
  
  return productiveTasks
}
