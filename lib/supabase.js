import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

// Report queries
export const getUserReports = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('reports')
    .select('id, report_date, title, developer, session_duration, executive_summary, lines_written, lines_deleted, files_modified_count, errors_encountered_count, screenshot_count, processing_time_ms, created_at, updated_at')
    .eq('user_id', userId)
    .order('report_date', { ascending: false })
    .limit(limit)

  return { reports: data, error }
}

export const getReport = async (reportId, userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', userId)
    .single()

  return { report: data, error }
}

export const getReportByDate = async (userId, reportDate) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .eq('report_date', reportDate)
    .single()

  return { report: data, error }
}

// Sharing functions disabled - database missing required columns
// To enable sharing, add these columns to your reports table:
// share_token UUID, shared_at TIMESTAMP, share_expires_at TIMESTAMP, view_count INTEGER

// export const getSharedReport = async (shareToken) => {
//   const { data, error } = await supabase
//     .from('reports')
//     .select('*')
//     .eq('share_token', shareToken)
//     .single()

//   if (data && !error) {
//     // Increment view count
//     await supabase
//       .from('reports')
//       .update({ view_count: (data.view_count || 0) + 1 })
//       .eq('share_token', shareToken)
//   }

//   return { report: data, error }
// }

// export const shareReport = async (reportId, expiresInDays = 30) => {
//   const expiresAt = new Date()
//   expiresAt.setDate(expiresAt.getDate() + expiresInDays)

//   const { data, error } = await supabase
//     .from('reports')
//     .update({
//       shared_at: new Date().toISOString(),
//       share_expires_at: expiresAt.toISOString()
//     })
//     .eq('id', reportId)
//     .select('share_token')
//     .single()

//   return { shareToken: data?.share_token, error }
// }

// export const unshareReport = async (reportId) => {
//   const { error } = await supabase
//     .from('reports')
//     .update({
//       shared_at: null,
//       share_expires_at: null
//     })
//     .eq('id', reportId)

//   return { error }
// }

export const deleteReport = async (reportId, userId) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)
    .eq('user_id', userId)

  return { error }
}

// Analytics queries
export const getProductivityTrends = async (userId, days = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('reports')
    .select('report_date, lines_written, files_modified_count, errors_encountered_count, productivity_assessment')
    .eq('user_id', userId)
    .gte('report_date', startDate.toISOString().split('T')[0])
    .order('report_date', { ascending: true })

  return { trends: data, error }
}

export const getSessionSummaries = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('session_start', { ascending: false })
    .limit(limit)

  return { sessions: data, error }
}

export const getSystemActivityLogs = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('system_activity_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', startDate)
    .lte('timestamp', endDate)
    .order('timestamp', { ascending: false })

  return { activities: data, error }
}