import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the target date/hour from request body or default to current hour
    const { targetDate } = await request.json().catch(() => ({}))
    const reportDate = targetDate ? new Date(targetDate) : new Date()
    
    console.log('Generating hourly report for:', user.id, 'hour:', reportDate.toISOString())

    // Get period boundaries using the database function
    const { data: periodData, error: periodError } = await supabase
      .rpc('get_period_boundaries', {
        report_type_param: 'hourly',
        target_date: reportDate.toISOString()
      })
      .single()

    if (periodError) {
      console.error('Error getting period boundaries:', periodError)
      return NextResponse.json({ error: 'Failed to calculate period' }, { status: 500 })
    }

    const { period_start, period_end } = periodData as { period_start: string; period_end: string }

    // Check if report already exists for this period
    const { data: existingReport } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('report_type', 'hourly')
      .eq('period_start', period_start)
      .single()

    if (existingReport) {
      return NextResponse.json({
        success: true,
        report: existingReport,
        message: 'Report already exists for this period'
      })
    }

    // Get user profile for company name
    const { data: profile } = await supabase
      .from('profiles')
      .select('company')
      .eq('id', user.id)
      .single()

    // Aggregate session data using the database function
    const { data: aggregatedDataRaw, error: aggregateError } = await supabase
      .rpc('aggregate_session_data', {
        user_id_param: user.id,
        start_time: period_start,
        end_time: period_end
      })
      .single()

    if (aggregateError) {
      console.error('Error aggregating session data:', aggregateError)
      return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 500 })
    }

    const aggregatedData = aggregatedDataRaw as {
      total_sessions: string;
      total_duration: string;
      total_screenshots: string;
      total_analyses: string;
      avg_productivity: string;
      avg_focus: string;
      avg_authenticity: string;
      avg_efficiency: string;
      activity_breakdown: any;
      applications_used: any;
      ai_tools_used: any;
      accomplishments: string[];
    }

    // Get detailed activity timeline for the hour
    const activityTimeline = await getHourlyActivityTimeline(supabase, user.id, period_start, period_end)
    
    // Calculate minute-by-minute productivity
    const minutelyProductivity = await calculateMinutelyProductivity(supabase, user.id, period_start, period_end)
    
    // Generate work narrative
    const workNarrative = generateHourlyNarrative(aggregatedData, activityTimeline, period_start, period_end)
    
    // Generate insights
    const keyInsights = generateHourlyInsights(aggregatedData, activityTimeline, minutelyProductivity)

    // Generate verification code
    const verificationCode = `OW-HOURLY-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create the hourly report
    const { data: report, error: reportError } = await supabase
      .from('user_reports')
      .insert({
        user_id: user.id,
        report_type: 'hourly',
        period_start,
        period_end,
        company_name: profile?.company || 'Independent Professional',
        total_sessions: parseInt(aggregatedData.total_sessions) || 0,
        total_duration: parseInt(aggregatedData.total_duration) || 0,
        total_screenshots: parseInt(aggregatedData.total_screenshots) || 0,
        total_analyses: parseInt(aggregatedData.total_analyses) || 0,
        avg_productivity_score: parseFloat(aggregatedData.avg_productivity) || 0,
        avg_focus_score: parseFloat(aggregatedData.avg_focus) || 0,
        avg_authenticity_score: parseFloat(aggregatedData.avg_authenticity) || 0,
        avg_efficiency_score: parseFloat(aggregatedData.avg_efficiency) || 0,
        activity_breakdown: aggregatedData.activity_breakdown || {},
        applications_used: aggregatedData.applications_used || [],
        ai_tools_used: aggregatedData.ai_tools_used || [],
        accomplishments: aggregatedData.accomplishments || [],
        work_narrative: workNarrative,
        key_insights: keyInsights,
        verification_code: verificationCode,
        is_public: false
      })
      .select()
      .single()

    if (reportError) {
      console.error('Hourly report creation error:', reportError)
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
    }

    // Save detailed report to storage
    const reportData = {
      reportId: report.id,
      verificationCode,
      type: 'hourly',
      period: {
        start: period_start,
        end: period_end,
        hour: new Date(period_start).getHours(),
        date: new Date(period_start).toISOString().split('T')[0]
      },
      generatedAt: new Date().toISOString(),
      summary: {
        totalMinutesActive: Math.round((report.total_duration || 0) / 60),
        screenshotsCount: report.total_screenshots,
        avgProductivity: report.avg_productivity_score,
        avgFocus: report.avg_focus_score,
        mainActivity: getMostFrequentActivity(report.activity_breakdown),
        keyAccomplishments: report.accomplishments
      },
      timeline: activityTimeline,
      minutelyProductivity,
      insights: keyInsights,
      activityBreakdown: report.activity_breakdown
    }

    // Save to reports bucket
    const hourStart = new Date(period_start).toISOString().replace(/[:.]/g, '-').split('T')
    const reportFileName = `${user.id}/hourly/${hourStart[0]}/${hourStart[1].split('-').slice(0, 2).join('-')}_${verificationCode}.json`
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(reportFileName, JSON.stringify(reportData, null, 2), {
          contentType: 'application/json',
          upsert: true
        })

      if (!uploadError) {
        // Update report with file path
        await supabase
          .from('user_reports')
          .update({ report_file_path: reportFileName })
          .eq('id', report.id)
      }
    } catch (storageError) {
      console.warn('Hourly report storage error:', storageError)
    }

    console.log('Hourly report generated successfully:', report.id)

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        summary: reportData.summary,
        timeline: activityTimeline,
        minutelyBreakdown: minutelyProductivity
      }
    })
  } catch (error: any) {
    console.error('Hourly report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate hourly report',
      details: error.message
    }, { status: 500 })
  }
}

async function getHourlyActivityTimeline(supabase: any, userId: string, periodStart: string, periodEnd: string) {
  const timeline: any[] = []

  // Get all analyses within the hour with timestamps
  const { data: analyses } = await supabase
    .from('analyses')
    .select(`
      created_at,
      productivity_score,
      focus_score,
      activity_type,
      primary_application,
      ai_tool_detected,
      screenshot_id
    `)
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lt('created_at', periodEnd)
    .order('created_at', { ascending: true })

  if (analyses) {
    analyses.forEach((analysis: any, index: number) => {
      const timestamp = new Date(analysis.created_at)
      const minute = timestamp.getMinutes()
      
      timeline.push({
        minute,
        timestamp: analysis.created_at,
        productivityScore: analysis.productivity_score,
        focusScore: analysis.focus_score,
        activity: analysis.activity_type,
        application: analysis.primary_application,
        aiTool: analysis.ai_tool_detected,
        screenshotId: analysis.screenshot_id
      })
    })
  }

  return timeline
}

async function calculateMinutelyProductivity(supabase: any, userId: string, periodStart: string, periodEnd: string) {
  const minutelyData: any = {}

  // Get all analyses and group by minute
  const { data: analyses } = await supabase
    .from('analyses')
    .select('created_at, productivity_score, focus_score')
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lt('created_at', periodEnd)

  if (analyses) {
    analyses.forEach((analysis: any) => {
      const minute = new Date(analysis.created_at).getMinutes()
      if (!minutelyData[minute]) {
        minutelyData[minute] = { productivity: [], focus: [] }
      }
      minutelyData[minute].productivity.push(analysis.productivity_score)
      minutelyData[minute].focus.push(analysis.focus_score)
    })

    // Calculate averages for each minute
    Object.keys(minutelyData).forEach(minute => {
      const data = minutelyData[minute]
      minutelyData[minute] = {
        productivity: Math.round(data.productivity.reduce((sum: number, val: number) => sum + val, 0) / data.productivity.length),
        focus: Math.round(data.focus.reduce((sum: number, val: number) => sum + val, 0) / data.focus.length),
        sampleCount: data.productivity.length
      }
    })
  }

  return minutelyData
}

function generateHourlyNarrative(data: any, timeline: any[], periodStart: string, periodEnd: string): string {
  const totalMinutes = Math.round((parseInt(data.total_duration) || 0) / 60)
  const screenshots = parseInt(data.total_screenshots) || 0
  const productivity = Math.round(parseFloat(data.avg_productivity) || 0)
  
  const hourStart = new Date(periodStart)
  const hourLabel = `${hourStart.getHours()}:00-${hourStart.getHours() + 1}:00`
  const dateLabel = hourStart.toDateString()
  
  let narrative = `Hourly work summary for ${hourLabel} on ${dateLabel}: `
  
  if (screenshots === 0) {
    return narrative + "No activity recorded during this hour."
  }
  
  narrative += `Active for ${totalMinutes} minutes with ${screenshots} screenshots captured. `
  
  if (productivity >= 80) {
    narrative += "High productivity hour with focused work patterns. "
  } else if (productivity >= 60) {
    narrative += "Good productivity with steady work flow. "
  } else if (productivity >= 40) {
    narrative += "Moderate productivity - some distractions present. "
  } else {
    narrative += "Low productivity hour - significant interruptions or non-work activities. "
  }
  
  // Analyze activity patterns
  const activities = timeline.map(t => t.activity).filter(Boolean)
  const uniqueActivities = [...new Set(activities)]
  if (uniqueActivities.length > 0) {
    narrative += `Primary activities: ${uniqueActivities.slice(0, 3).join(', ')}. `
  }
  
  const applications = timeline.map(t => t.application).filter(Boolean)
  const uniqueApps = [...new Set(applications)]
  if (uniqueApps.length > 0) {
    narrative += `Tools used: ${uniqueApps.slice(0, 3).join(', ')}. `
  }
  
  // Check for AI tool usage
  const aiTools = timeline.map(t => t.aiTool).filter(Boolean)
  if (aiTools.length > 0) {
    const uniqueAI = [...new Set(aiTools)]
    narrative += `AI assistance: ${uniqueAI.slice(0, 2).join(', ')}. `
  }
  
  return narrative
}

function generateHourlyInsights(data: any, timeline: any[], minutelyData: any): string[] {
  const insights: string[] = []
  const totalMinutes = (parseInt(data.total_duration) || 0) / 60
  const productivity = parseFloat(data.avg_productivity) || 0
  const focus = parseFloat(data.avg_focus) || 0
  
  // Activity intensity
  if (totalMinutes >= 50) {
    insights.push("Very active hour - almost full hour of work tracked")
  } else if (totalMinutes >= 30) {
    insights.push("Good activity level - significant work time recorded")
  } else if (totalMinutes > 0) {
    insights.push("Light activity - partial hour of work tracked")
  }
  
  // Productivity insights
  if (productivity >= 90) {
    insights.push("Exceptional productivity - peak performance hour")
  } else if (productivity >= 75) {
    insights.push("High productivity - efficient work patterns")
  } else if (productivity >= 50) {
    insights.push("Moderate productivity with room for improvement")
  } else if (productivity > 0) {
    insights.push("Low productivity - consider addressing distractions")
  }
  
  // Focus insights
  if (focus >= 85) {
    insights.push("Excellent focus maintained throughout the hour")
  } else if (focus < 60 && focus > 0) {
    insights.push("Focus challenges detected - consider minimizing interruptions")
  }
  
  // Timeline analysis
  if (timeline.length > 0) {
    const productivityScores = timeline.map(t => t.productivityScore).filter(Boolean)
    if (productivityScores.length > 1) {
      const variance = calculateProductivityVariance(productivityScores)
      if (variance < 15) {
        insights.push("Consistent productivity maintained throughout the hour")
      } else if (variance > 30) {
        insights.push("Productivity fluctuated significantly - investigate cause of variations")
      }
    }
    
    // Activity switching analysis
    const activities = timeline.map(t => t.activity).filter(Boolean)
    const activitySwitches = countActivitySwitches(activities)
    if (activitySwitches > 5) {
      insights.push("High task switching - consider focusing on fewer activities")
    } else if (activitySwitches === 0 && activities.length > 0) {
      insights.push("Good task focus - stayed on single activity type")
    }
  }
  
  // AI tool effectiveness
  const aiUsage = timeline.filter(t => t.aiTool).length
  const totalAnalyses = timeline.length
  if (aiUsage > 0 && totalAnalyses > 0) {
    const aiPercentage = Math.round((aiUsage / totalAnalyses) * 100)
    if (aiPercentage > 50) {
      insights.push(`Heavy AI tool usage (${aiPercentage}%) - verify work authenticity`)
    } else if (aiPercentage > 20) {
      insights.push(`Moderate AI assistance (${aiPercentage}%) - good balance of human and AI work`)
    }
  }
  
  return insights
}

function getMostFrequentActivity(activityBreakdown: any): string {
  if (!activityBreakdown || Object.keys(activityBreakdown).length === 0) {
    return "unknown"
  }
  
  return Object.entries(activityBreakdown)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
}

function calculateProductivityVariance(scores: number[]): number {
  if (scores.length <= 1) return 0
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length)
}

function countActivitySwitches(activities: string[]): number {
  let switches = 0
  for (let i = 1; i < activities.length; i++) {
    if (activities[i] !== activities[i - 1]) {
      switches++
    }
  }
  return switches
}

// Endpoint for cron jobs (less commonly used for hourly reports)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'Hourly reports are typically generated on-demand rather than via cron jobs'
    })
  } catch (error: any) {
    console.error('Hourly cron job error:', error)
    return NextResponse.json({ 
      error: 'Hourly cron job failed',
      details: error.message
    }, { status: 500 })
  }
}