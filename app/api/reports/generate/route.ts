import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { startDate, endDate } = await req.json()

    // Fetch all data for the period
    const [sessions, screenshots, analyses] = await Promise.all([
      supabase
        .from('workflow_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate),
      
      supabase
        .from('screenshots')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate),
      
      supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
    ])

    if (!analyses.data || analyses.data.length === 0) {
      return NextResponse.json({ 
        error: 'No data available for this period',
        tip: 'Make sure to record some sessions with screenshots first!'
      }, { status: 400 })
    }

    // Calculate comprehensive metrics
    const totalSessions = sessions.data?.length || 0
    const totalScreenshots = screenshots.data?.length || 0
    const totalHours = (totalScreenshots * 0.5) / 60 // 30 seconds per screenshot
    
    // Productivity metrics
    const productivityScores = analyses.data.map(a => a.productivity_score || 0)
    const avgProductivity = Math.round(
      productivityScores.reduce((a, b) => a + b, 0) / productivityScores.length
    )
    
    // Activity breakdown
    const activityTypes: { [key: string]: number } = {}
    analyses.data.forEach(a => {
      const type = a.activity_type || 'Unknown'
      activityTypes[type] = (activityTypes[type] || 0) + 1
    })
    
    // Applications usage
    const appUsage: { [key: string]: number } = {}
    const backgroundAppUsage: { [key: string]: number } = {}
    
    analyses.data.forEach(a => {
      // Foreground apps
      if (a.applications_detected && Array.isArray(a.applications_detected)) {
        a.applications_detected.forEach((app: string) => {
          appUsage[app] = (appUsage[app] || 0) + 1
        })
      }
      
      // Background apps
      if (a.background_apps && Array.isArray(a.background_apps)) {
        a.background_apps.forEach((app: string) => {
          backgroundAppUsage[app] = (backgroundAppUsage[app] || 0) + 1
        })
      }
    })
    
    // Sort apps by usage
    const topApps = Object.entries(appUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([app]) => app)
    
    const topBackgroundApps = Object.entries(backgroundAppUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([app]) => app)
    
    // Time-based analysis
    const hourlyProductivity: { [hour: number]: number[] } = {}
    analyses.data.forEach(a => {
      const hour = new Date(a.created_at).getHours()
      if (!hourlyProductivity[hour]) hourlyProductivity[hour] = []
      hourlyProductivity[hour].push(a.productivity_score || 0)
    })
    
    const peakHours = Object.entries(hourlyProductivity)
      .map(([hour, scores]) => ({
        hour: parseInt(hour),
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
    
    // Generate insights using GPT-4
    const insightsPrompt = `
    Based on this productivity data, provide 5 actionable insights:
    - Average productivity: ${avgProductivity}%
    - Total hours tracked: ${totalHours.toFixed(1)}
    - Top activities: ${Object.entries(activityTypes).slice(0, 3).map(([type, count]) => `${type} (${count})`).join(', ')}
    - Most used apps: ${topApps.slice(0, 5).join(', ')}
    - Background apps: ${topBackgroundApps.slice(0, 5).join(', ')}
    - Peak productivity hours: ${peakHours.map(h => `${h.hour}:00 (${h.avgScore}%)`).join(', ')}
    
    Provide specific, actionable recommendations.
    `
    
    let insights = []
    try {
      const insightResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: insightsPrompt }],
        max_tokens: 500
      })
      
      insights = insightResponse.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 5) || []
    } catch (error) {
      console.error('Failed to generate insights:', error)
      insights = [
        `Your average productivity is ${avgProductivity}%. ${avgProductivity >= 70 ? 'Great job!' : 'Room for improvement.'}`,
        `You tracked ${totalHours.toFixed(1)} hours across ${totalSessions} sessions.`,
        `Your most productive hours are around ${peakHours[0]?.hour || 9}:00.`,
        `You use ${topApps[0] || 'various apps'} the most.`,
        `Consider minimizing distractions from background apps like ${topBackgroundApps[0] || 'social media'}.`
      ]
    }
    
    // Save report to database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        date_range_start: startDate,
        date_range_end: endDate,
        total_sessions: totalSessions,
        total_screenshots: totalScreenshots,
        avg_productivity: avgProductivity,
        total_hours: totalHours,
        top_apps: topApps,
        background_apps: topBackgroundApps,
        productivity_breakdown: {
          activityTypes,
          hourlyProductivity: Object.fromEntries(
            Object.entries(hourlyProductivity).map(([hour, scores]) => [
              hour,
              Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            ])
          ),
          peakHours
        },
        insights,
        report_data: {
          appUsage,
          backgroundAppUsage,
          activityTypes
        }
      })
      .select()
      .single()
    
    if (reportError) {
      console.error('Failed to save report:', reportError)
    }
    
    // Generate detailed report text
    const reportText = `
# PRODUCTIVITY REPORT
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}

## EXECUTIVE SUMMARY
- **Total Sessions**: ${totalSessions}
- **Screenshots Analyzed**: ${totalScreenshots}
- **Hours Tracked**: ${totalHours.toFixed(1)} hours
- **Average Productivity**: ${avgProductivity}%
- **Productivity Grade**: ${avgProductivity >= 80 ? 'A' : avgProductivity >= 70 ? 'B' : avgProductivity >= 60 ? 'C' : avgProductivity >= 50 ? 'D' : 'F'}

## ACTIVITY BREAKDOWN
${Object.entries(activityTypes)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => `- **${type}**: ${count} captures (${Math.round(count / totalScreenshots * 100)}%)`)
  .join('\n')}

## APPLICATION USAGE

### Foreground Applications (Active Use)
${topApps.map((app, i) => `${i + 1}. **${app}**: ${appUsage[app]} times (${Math.round(appUsage[app] / totalScreenshots * 100)}%)`).join('\n')}

### Background Applications (Running but not active)
${topBackgroundApps.map((app, i) => `${i + 1}. **${app}**: ${backgroundAppUsage[app]} detections`).join('\n')}

## PEAK PRODUCTIVITY HOURS
${peakHours.map(h => {
  const hour = h.hour
  const timeStr = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
  return `- **${timeStr}**: ${h.avgScore}% average productivity`
}).join('\n')}

## KEY INSIGHTS & RECOMMENDATIONS
${insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

## DETAILED METRICS

### Productivity Distribution
- **Highly Productive (80-100%)**: ${analyses.data.filter(a => (a.productivity_score || 0) >= 80).length} captures
- **Productive (60-79%)**: ${analyses.data.filter(a => (a.productivity_score || 0) >= 60 && (a.productivity_score || 0) < 80).length} captures
- **Moderate (40-59%)**: ${analyses.data.filter(a => (a.productivity_score || 0) >= 40 && (a.productivity_score || 0) < 60).length} captures
- **Low (20-39%)**: ${analyses.data.filter(a => (a.productivity_score || 0) >= 20 && (a.productivity_score || 0) < 40).length} captures
- **Very Low (0-19%)**: ${analyses.data.filter(a => (a.productivity_score || 0) < 20).length} captures

### Session Statistics
- **Average Session Length**: ${totalSessions > 0 ? (totalHours / totalSessions).toFixed(1) : 0} hours
- **Screenshots per Session**: ${totalSessions > 0 ? Math.round(totalScreenshots / totalSessions) : 0}
- **Most Productive Session**: ${Math.max(...(sessions.data?.map(s => {
    const sessionAnalyses = analyses.data.filter(a => a.session_id === s.id)
    if (sessionAnalyses.length === 0) return 0
    return Math.round(sessionAnalyses.reduce((acc, a) => acc + (a.productivity_score || 0), 0) / sessionAnalyses.length)
  }) || [0]))}%

## RECOMMENDATIONS FOR IMPROVEMENT

${avgProductivity < 60 ? `
### ⚠️ Productivity Needs Attention
Your average productivity of ${avgProductivity}% is below optimal. Consider:
1. **Time blocking**: Dedicate specific hours to focused work
2. **Minimize distractions**: Close unnecessary tabs and applications
3. **Use the Pomodoro technique**: Work in 25-minute focused bursts
4. **Review your peak hours**: Schedule important work during ${peakHours[0]?.hour || 9}:00
` : avgProductivity < 80 ? `
### ✅ Good Productivity - Room for Excellence
Your average productivity of ${avgProductivity}% is good. To reach excellence:
1. **Optimize your environment**: Ensure proper lighting and minimal noise
2. **Batch similar tasks**: Group emails, meetings, and deep work
3. **Leverage your peak hours**: Do critical work at ${peakHours[0]?.hour || 9}:00
4. **Reduce background apps**: Limit ${topBackgroundApps[0] || 'social media'} usage
` : `
### 🌟 Excellent Productivity!
Your average productivity of ${avgProductivity}% is outstanding! Maintain by:
1. **Continuing current habits**: Your routine is working well
2. **Sharing knowledge**: Help team members improve their productivity
3. **Preventing burnout**: Ensure adequate breaks and rest
4. **Documenting processes**: Create guides for your most productive workflows
`}

### Background App Optimization
${topBackgroundApps.length > 0 ? `
You have ${topBackgroundApps.length} applications frequently running in background:
${topBackgroundApps.slice(0, 5).map(app => `- Close **${app}** when not needed`).join('\n')}

This could free up system resources and reduce distractions.
` : 'Great job keeping background applications minimal!'}

---
*This report is generated using AI analysis of ${totalScreenshots} screenshots across ${totalSessions} sessions.*
*For questions or support, contact support@only-works.com*
    `
    
    return NextResponse.json({
      success: true,
      report: {
        id: report?.id,
        summary: {
          totalSessions,
          totalScreenshots,
          totalHours: totalHours.toFixed(1),
          avgProductivity,
          grade: avgProductivity >= 80 ? 'A' : avgProductivity >= 70 ? 'B' : avgProductivity >= 60 ? 'C' : avgProductivity >= 50 ? 'D' : 'F'
        },
        activityBreakdown: activityTypes,
        topApps,
        backgroundApps: topBackgroundApps,
        peakHours,
        insights,
        fullReport: reportText
      }
    })
    
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
