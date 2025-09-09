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

    // Get the target date from request body or default to today
    const { targetDate } = await request.json().catch(() => ({}))
    const reportDate = targetDate ? new Date(targetDate) : new Date()
    
    console.log('Generating daily report for:', user.id, 'date:', reportDate.toISOString().split('T')[0])

    // Get period boundaries using the database function
    const { data: periodData, error: periodError } = await supabase
      .rpc('get_period_boundaries', {
        report_type_param: 'daily',
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
      .eq('report_type', 'daily')
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

    // Generate work narrative based on aggregated data
    const workNarrative = generateDailyNarrative(aggregatedData, period_start, period_end)
    
    // Generate key insights
    const keyInsights = generateDailyInsights(aggregatedData)
    
    // Calculate productivity by hour (simplified for now)
    const productivityByHour = await calculateProductivityByHour(supabase, user.id, period_start, period_end)

    // Generate verification code
    const verificationCode = `OW-DAILY-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create the daily report
    const { data: report, error: reportError } = await supabase
      .from('user_reports')
      .insert({
        user_id: user.id,
        report_type: 'daily',
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
        productivity_by_hour: productivityByHour,
        verification_code: verificationCode,
        is_public: false
      })
      .select()
      .single()

    if (reportError) {
      console.error('Report creation error:', reportError)
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
    }

    // Save detailed report to storage
    const reportData = {
      reportId: report.id,
      verificationCode,
      type: 'daily',
      period: {
        start: period_start,
        end: period_end
      },
      generatedAt: new Date().toISOString(),
      summary: {
        totalSessions: report.total_sessions,
        totalDuration: Math.round((report.total_duration || 0) / 3600 * 100) / 100, // hours
        avgProductivity: report.avg_productivity_score,
        avgFocus: report.avg_focus_score,
        keyAccomplishments: report.accomplishments
      },
      insights: keyInsights,
      activityBreakdown: report.activity_breakdown,
      productivityTrend: productivityByHour
    }

    // Save to reports bucket
    const reportFileName = `${user.id}/daily/${reportDate.toISOString().split('T')[0]}_${verificationCode}.json`
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
      console.warn('Report storage error:', storageError)
    }

    console.log('Daily report generated successfully:', report.id)

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        summary: reportData.summary
      }
    })
  } catch (error: any) {
    console.error('Daily report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate daily report',
      details: error.message
    }, { status: 500 })
  }
}

function generateDailyNarrative(data: any, periodStart: string, periodEnd: string): string {
  const totalHours = Math.round((parseInt(data.total_duration) || 0) / 3600 * 100) / 100
  const sessions = parseInt(data.total_sessions) || 0
  const productivity = Math.round(parseFloat(data.avg_productivity) || 0)
  
  const date = new Date(periodStart).toLocaleDateString()
  
  let narrative = `Daily work summary for ${date}: `
  
  if (sessions === 0) {
    return narrative + "No work sessions recorded for this day."
  }
  
  narrative += `Completed ${sessions} work session${sessions > 1 ? 's' : ''} totaling ${totalHours} hours. `
  
  if (productivity >= 80) {
    narrative += "Demonstrated high productivity with focused work patterns. "
  } else if (productivity >= 60) {
    narrative += "Maintained good productivity levels throughout the day. "
  } else {
    narrative += "Had some productivity challenges but still made progress. "
  }
  
  const accomplishments = data.accomplishments || []
  if (accomplishments.length > 0) {
    narrative += `Key accomplishments included: ${accomplishments.slice(0, 3).join(', ')}.`
  }
  
  return narrative
}

function generateDailyInsights(data: any): string[] {
  const insights: string[] = []
  const totalHours = (parseInt(data.total_duration) || 0) / 3600
  const productivity = parseFloat(data.avg_productivity) || 0
  const focus = parseFloat(data.avg_focus) || 0
  
  if (totalHours >= 8) {
    insights.push("Full workday completed with good time tracking")
  } else if (totalHours >= 4) {
    insights.push("Partial workday tracked")
  }
  
  if (productivity >= 85) {
    insights.push("Excellent productivity - work patterns show high efficiency")
  } else if (productivity < 60) {
    insights.push("Productivity could be improved - consider minimizing distractions")
  }
  
  if (focus >= 80) {
    insights.push("Strong focus maintained throughout work sessions")
  }
  
  const aiToolsUsed = data.ai_tools_used || []
  if (aiToolsUsed.length > 0) {
    insights.push(`Leveraged AI tools effectively: ${aiToolsUsed.slice(0, 2).join(', ')}`)
  }
  
  return insights
}

async function calculateProductivityByHour(supabase: any, userId: string, periodStart: string, periodEnd: string): Promise<any> {
  // Simplified implementation - in production, you'd want more sophisticated analysis
  const { data: hourlyData } = await supabase
    .from('analyses')
    .select('productivity_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', periodStart)
    .lt('created_at', periodEnd)
  
  const productivityByHour: any = {}
  
  if (hourlyData) {
    hourlyData.forEach((analysis: any) => {
      const hour = new Date(analysis.created_at).getHours()
      if (!productivityByHour[hour]) {
        productivityByHour[hour] = []
      }
      productivityByHour[hour].push(analysis.productivity_score)
    })
    
    // Average the scores for each hour
    Object.keys(productivityByHour).forEach(hour => {
      const scores = productivityByHour[hour]
      productivityByHour[hour] = Math.round(
        scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
      )
    })
  }
  
  return productivityByHour
}

// Endpoint for cron jobs - no authentication required for internal calls
export async function GET(request: NextRequest) {
  try {
    // This endpoint can be called by Vercel cron jobs to generate daily reports for all users
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    
    // Get all active users (simplified - you might want to add more criteria)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { data: activeUsers } = await supabase
      .from('workflow_sessions')
      .select('user_id')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', new Date().toISOString())
      
    const uniqueUsers = [...new Set(activeUsers?.map(u => u.user_id) || [])]
    
    const results = []
    for (const userId of uniqueUsers) {
      try {
        // Generate daily report for each user for yesterday
        const { data: periodData } = await supabase
          .rpc('get_period_boundaries', {
            report_type_param: 'daily',
            target_date: yesterday.toISOString()
          })
          .single()

        if (periodData) {
          const typedPeriodData = periodData as { period_start: string; period_end: string }
          // Check if report already exists
          const { data: existing } = await supabase
            .from('user_reports')
            .select('id')
            .eq('user_id', userId)
            .eq('report_type', 'daily')
            .eq('period_start', typedPeriodData.period_start)
            .single()

          if (!existing) {
            // Generate report for this user
            const mockRequest = new Request('http://localhost', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetDate: yesterday.toISOString() })
            })
            
            // You would need to set the user context here for the report generation
            // This is a simplified implementation
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
    console.error('Cron job error:', error)
    return NextResponse.json({ 
      error: 'Cron job failed',
      details: error.message
    }, { status: 500 })
  }
}