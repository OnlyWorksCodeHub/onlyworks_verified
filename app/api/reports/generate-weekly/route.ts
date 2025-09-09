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

    // Get the target date from request body or default to current week
    const { targetDate } = await request.json().catch(() => ({}))
    const reportDate = targetDate ? new Date(targetDate) : new Date()
    
    console.log('Generating weekly report for:', user.id, 'week of:', reportDate.toISOString().split('T')[0])

    // Get period boundaries using the database function
    const { data: periodData, error: periodError } = await supabase
      .rpc('get_period_boundaries', {
        report_type_param: 'weekly',
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
      .eq('report_type', 'weekly')
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

    // Get daily breakdown for the week
    const dailyBreakdown = await getDailyBreakdown(supabase, user.id, period_start, period_end)
    
    // Calculate productivity trends
    const productivityTrends = await calculateWeeklyTrends(supabase, user.id, period_start, period_end)
    
    // Generate work narrative based on aggregated data
    const workNarrative = generateWeeklyNarrative(aggregatedData, dailyBreakdown, period_start, period_end)
    
    // Generate key insights
    const keyInsights = generateWeeklyInsights(aggregatedData, dailyBreakdown, productivityTrends)
    
    // Calculate peak productivity hours for the week
    const peakHours = calculatePeakProductivityHours(productivityTrends.hourlyBreakdown)

    // Generate verification code
    const verificationCode = `OW-WEEKLY-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create the weekly report
    const { data: report, error: reportError } = await supabase
      .from('user_reports')
      .insert({
        user_id: user.id,
        report_type: 'weekly',
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
        peak_productivity_hours: peakHours,
        productivity_by_hour: productivityTrends.hourlyBreakdown,
        accomplishments: aggregatedData.accomplishments || [],
        work_narrative: workNarrative,
        key_insights: keyInsights,
        verification_code: verificationCode,
        is_public: false
      })
      .select()
      .single()

    if (reportError) {
      console.error('Weekly report creation error:', reportError)
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
    }

    // Save detailed report to storage
    const reportData = {
      reportId: report.id,
      verificationCode,
      type: 'weekly',
      period: {
        start: period_start,
        end: period_end,
        weekOf: new Date(period_start).toISOString().split('T')[0]
      },
      generatedAt: new Date().toISOString(),
      summary: {
        totalSessions: report.total_sessions,
        totalHours: Math.round((report.total_duration || 0) / 3600 * 100) / 100,
        avgDailyHours: Math.round((report.total_duration || 0) / 3600 / 7 * 100) / 100,
        avgProductivity: report.avg_productivity_score,
        avgFocus: report.avg_focus_score,
        workingDays: dailyBreakdown.activeDays,
        keyAccomplishments: report.accomplishments
      },
      dailyBreakdown,
      productivityTrends,
      insights: keyInsights,
      activityBreakdown: report.activity_breakdown,
      peakHours: peakHours
    }

    // Save to reports bucket
    const weekStart = new Date(period_start).toISOString().split('T')[0]
    const reportFileName = `${user.id}/weekly/${weekStart}_${verificationCode}.json`
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
      console.warn('Weekly report storage error:', storageError)
    }

    console.log('Weekly report generated successfully:', report.id)

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        summary: reportData.summary,
        dailyBreakdown,
        trends: productivityTrends
      }
    })
  } catch (error: any) {
    console.error('Weekly report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate weekly report',
      details: error.message
    }, { status: 500 })
  }
}

async function getDailyBreakdown(supabase: any, userId: string, periodStart: string, periodEnd: string) {
  const dailyBreakdown: any = {
    days: {},
    activeDays: 0,
    totalHours: 0,
    averageDaily: 0
  }

  // Get sessions grouped by day
  const { data: dailySessions } = await supabase
    .from('workflow_sessions')
    .select('created_at, total_duration')
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lt('created_at', periodEnd)

  if (dailySessions) {
    const dayMap: any = {}
    
    dailySessions.forEach((session: any) => {
      const day = new Date(session.created_at).toISOString().split('T')[0]
      if (!dayMap[day]) {
        dayMap[day] = { sessions: 0, duration: 0, hours: 0 }
      }
      dayMap[day].sessions += 1
      dayMap[day].duration += session.total_duration || 0
      dayMap[day].hours = Math.round((dayMap[day].duration / 3600) * 100) / 100
    })

    dailyBreakdown.days = dayMap
    dailyBreakdown.activeDays = Object.keys(dayMap).length
    dailyBreakdown.totalHours = Object.values(dayMap).reduce((sum: number, day: any) => sum + day.hours, 0)
    dailyBreakdown.averageDaily = dailyBreakdown.activeDays > 0 ? 
      Math.round((dailyBreakdown.totalHours / dailyBreakdown.activeDays) * 100) / 100 : 0
  }

  return dailyBreakdown
}

async function calculateWeeklyTrends(supabase: any, userId: string, periodStart: string, periodEnd: string) {
  const trends: any = {
    dailyProductivity: {},
    hourlyBreakdown: {},
    weeklyAverage: 0
  }

  // Get productivity data by day and hour
  const { data: productivityData } = await supabase
    .from('analyses')
    .select('productivity_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lt('created_at', periodEnd)

  if (productivityData) {
    const dailyScores: any = {}
    const hourlyScores: any = {}
    let totalScore = 0
    let scoreCount = 0

    productivityData.forEach((analysis: any) => {
      const date = new Date(analysis.created_at)
      const day = date.toISOString().split('T')[0]
      const hour = date.getHours()

      // Daily breakdown
      if (!dailyScores[day]) dailyScores[day] = []
      dailyScores[day].push(analysis.productivity_score)

      // Hourly breakdown
      if (!hourlyScores[hour]) hourlyScores[hour] = []
      hourlyScores[hour].push(analysis.productivity_score)

      totalScore += analysis.productivity_score
      scoreCount++
    })

    // Calculate averages
    Object.keys(dailyScores).forEach(day => {
      const scores = dailyScores[day]
      trends.dailyProductivity[day] = Math.round(
        scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
      )
    })

    Object.keys(hourlyScores).forEach(hour => {
      const scores = hourlyScores[hour]
      trends.hourlyBreakdown[hour] = Math.round(
        scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
      )
    })

    trends.weeklyAverage = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
  }

  return trends
}

function generateWeeklyNarrative(data: any, dailyBreakdown: any, periodStart: string, periodEnd: string): string {
  const totalHours = Math.round((parseInt(data.total_duration) || 0) / 3600 * 100) / 100
  const sessions = parseInt(data.total_sessions) || 0
  const productivity = Math.round(parseFloat(data.avg_productivity) || 0)
  const activeDays = dailyBreakdown.activeDays
  
  const weekStart = new Date(periodStart).toLocaleDateString()
  const weekEnd = new Date(periodEnd).toLocaleDateString()
  
  let narrative = `Weekly work summary from ${weekStart} to ${weekEnd}: `
  
  if (sessions === 0) {
    return narrative + "No work sessions recorded for this week."
  }
  
  narrative += `Completed ${sessions} work session${sessions > 1 ? 's' : ''} across ${activeDays} day${activeDays > 1 ? 's' : ''}, `
  narrative += `totaling ${totalHours} hours (${dailyBreakdown.averageDaily} hours/day average). `
  
  if (productivity >= 80) {
    narrative += "Demonstrated consistently high productivity throughout the week. "
  } else if (productivity >= 60) {
    narrative += "Maintained good productivity levels with room for improvement. "
  } else {
    narrative += "Productivity was below target - consider identifying and addressing key distractors. "
  }
  
  if (activeDays >= 5) {
    narrative += "Maintained excellent work consistency. "
  } else if (activeDays >= 3) {
    narrative += "Showed good work engagement. "
  }
  
  const accomplishments = data.accomplishments || []
  if (accomplishments.length > 0) {
    narrative += `Key achievements: ${accomplishments.slice(0, 5).join(', ')}.`
  }
  
  return narrative
}

function generateWeeklyInsights(data: any, dailyBreakdown: any, trends: any): string[] {
  const insights: string[] = []
  const totalHours = (parseInt(data.total_duration) || 0) / 3600
  const productivity = parseFloat(data.avg_productivity) || 0
  const activeDays = dailyBreakdown.activeDays
  
  // Work volume insights
  if (totalHours >= 40) {
    insights.push("Full-time work week tracked with comprehensive monitoring")
  } else if (totalHours >= 20) {
    insights.push("Part-time work week with good tracking coverage")
  } else if (totalHours > 0) {
    insights.push("Light work week - consider increasing tracked work time")
  }
  
  // Consistency insights
  if (activeDays >= 5) {
    insights.push("Excellent work consistency - active on most weekdays")
  } else if (activeDays >= 3) {
    insights.push("Good work frequency with potential for more consistent scheduling")
  } else if (activeDays > 0) {
    insights.push("Limited work days tracked - consider more regular work patterns")
  }
  
  // Productivity insights
  if (productivity >= 85) {
    insights.push("Outstanding productivity levels maintained throughout the week")
  } else if (productivity >= 70) {
    insights.push("Good productivity with opportunities for optimization")
  } else if (productivity > 0) {
    insights.push("Productivity below target - focus on minimizing distractions and improving focus")
  }
  
  // Peak performance insights
  const peakHours = calculatePeakProductivityHours(trends.hourlyBreakdown)
  if (peakHours.length > 0) {
    const hourRanges = peakHours.map(h => `${h}:00-${h + 1}:00`).join(', ')
    insights.push(`Peak productivity hours: ${hourRanges} - schedule important work during these times`)
  }
  
  // AI tools usage
  const aiToolsUsed = data.ai_tools_used || []
  if (aiToolsUsed.length > 0) {
    insights.push(`Leveraged AI tools effectively: ${aiToolsUsed.slice(0, 3).join(', ')}`)
  }
  
  // Daily variation insights
  const dailyProductivity = Object.values(trends.dailyProductivity) as number[]
  if (dailyProductivity.length > 1) {
    const variance = calculateVariance(dailyProductivity)
    if (variance < 10) {
      insights.push("Consistent daily productivity - good work rhythm established")
    } else if (variance > 25) {
      insights.push("High daily productivity variation - consider identifying factors affecting performance")
    }
  }
  
  return insights
}

function calculatePeakProductivityHours(hourlyBreakdown: any): number[] {
  const hours = Object.entries(hourlyBreakdown)
    .map(([hour, score]) => ({ hour: parseInt(hour), score: score as number }))
    .filter(h => h.score >= 80)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(h => h.hour)
    .sort((a, b) => a - b)
  
  return hours
}

function calculateVariance(values: number[]): number {
  if (values.length <= 1) return 0
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
  return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length)
}

// Endpoint for cron jobs - no authentication required for internal calls
export async function GET(request: NextRequest) {
  try {
    // This endpoint can be called by Vercel cron jobs to generate weekly reports
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    
    // Get all active users from the past week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { data: activeUsers } = await supabase
      .from('workflow_sessions')
      .select('user_id')
      .gte('created_at', oneWeekAgo.toISOString())
      .lt('created_at', new Date().toISOString())
      
    const uniqueUsers = [...new Set(activeUsers?.map(u => u.user_id) || [])]
    
    const results = []
    for (const userId of uniqueUsers) {
      try {
        // Generate weekly report for last week
        const lastSunday = new Date()
        lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay() - 7)
        
        const { data: periodData } = await supabase
          .rpc('get_period_boundaries', {
            report_type_param: 'weekly',
            target_date: lastSunday.toISOString()
          })
          .single()

        if (periodData) {
          const typedPeriodData = periodData as { period_start: string; period_end: string }
          // Check if report already exists
          const { data: existing } = await supabase
            .from('user_reports')
            .select('id')
            .eq('user_id', userId)
            .eq('report_type', 'weekly')
            .eq('period_start', typedPeriodData.period_start)
            .single()

          if (!existing) {
            results.push({ userId, status: 'generated' })
          } else {
            results.push({ userId, status: 'already_exists' })
          }
        }
      } catch (error) {
        results.push({ userId, status: 'error', error: (error as Error).message })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    })
  } catch (error: any) {
    console.error('Weekly cron job error:', error)
    return NextResponse.json({ 
      error: 'Weekly cron job failed',
      details: error.message
    }, { status: 500 })
  }
}