import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const getCurrentUser = async () => {
  // First get the auth user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    // Return null user without error for missing sessions on public pages
    if (authError?.message?.includes('Auth session missing') || authError?.message?.includes('session missing')) {
      return { user: null, error: null }
    }
    return { user: null, error: authError }
  }

  // Then fetch the corresponding web_users record
  const { data: webUser, error: webUserError } = await supabase
    .from('web_users')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .single()

  if (webUserError || !webUser) {
    console.error('Failed to fetch web_users record:', webUserError)
    return { user: null, error: webUserError }
  }

  // Return web_users record with auth metadata
  return {
    user: {
      ...webUser,
      auth_id: authUser.id,
      email_verified: authUser.email_confirmed_at ? true : false
    },
    error: null
  }
}

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signInWithGoogle = async (redirectPath = '/dashboard') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`
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
    .select('id, report_date, title, session_duration, executive_summary, lines_written, lines_deleted, files_modified_count, errors_encountered_count, screenshot_count, processing_time_ms, created_at, updated_at')
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

// Email-based sharing functions using shared_reports table

export const shareReportViaEmail = async (reportId, recipientEmail, expiresInDays = 30) => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const { data, error } = await supabase
    .from('shared_reports')
    .insert({
      report_id: reportId,
      recipient_email: recipientEmail.toLowerCase(),
      expires_at: expiresAt.toISOString()
    })
    .select('id, share_token, expires_at')
    .single()

  return { shareData: data, error }
}

export const getSharedReport = async (shareToken) => {
  // First get the share record
  const { data: shareRecord, error: shareError } = await supabase
    .from('shared_reports')
    .select(`
      id,
      report_id,
      recipient_email,
      expires_at,
      view_count,
      shared_by_user_id,
      reports!inner (
        *
      )
    `)
    .eq('share_token', shareToken)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (shareError || !shareRecord) {
    return { report: null, shareInfo: null, error: shareError || { message: 'Share not found or expired' } }
  }

  // Increment view count
  await supabase
    .from('shared_reports')
    .update({ view_count: (shareRecord.view_count || 0) + 1 })
    .eq('id', shareRecord.id)

  return {
    report: shareRecord.reports,
    shareInfo: {
      id: shareRecord.id,
      recipientEmail: shareRecord.recipient_email,
      expiresAt: shareRecord.expires_at,
      viewCount: shareRecord.view_count + 1,
      sharedByUserId: shareRecord.shared_by_user_id
    },
    error: null
  }
}

export const getUserSharedReports = async (userId) => {
  const { data, error } = await supabase
    .from('shared_reports')
    .select(`
      id,
      recipient_email,
      share_token,
      expires_at,
      view_count,
      created_at,
      reports!inner (
        id,
        title,
        report_date,
        lines_written,
        files_modified_count
      )
    `)
    .eq('shared_by_user_id', userId)
    .order('created_at', { ascending: false })

  return { sharedReports: data, error }
}

export const revokeSharedReport = async (shareId, userId) => {
  const { error } = await supabase
    .from('shared_reports')
    .delete()
    .eq('id', shareId)
    .eq('shared_by_user_id', userId)

  return { error }
}

export const getSharedReportsForRecipient = async (recipientEmail) => {
  const { data, error } = await supabase
    .from('shared_reports')
    .select(`
      id,
      share_token,
      expires_at,
      view_count,
      created_at,
      reports!inner (
        id,
        title,
        report_date,
        lines_written,
        files_modified_count
      ),
      auth_users!shared_reports_shared_by_user_id_fkey (
        email
      )
    `)
    .eq('recipient_email', recipientEmail.toLowerCase())
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  return { receivedReports: data, error }
}

export const extendShareExpiry = async (shareId, userId, expiresInDays = 30) => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const { data, error } = await supabase
    .from('shared_reports')
    .update({ expires_at: expiresAt.toISOString() })
    .eq('id', shareId)
    .eq('shared_by_user_id', userId)
    .select('expires_at')
    .single()

  return { newExpiryDate: data?.expires_at, error }
}

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

// Session queries
export const getUserSessions = async (userId, limit = 100) => {
  const { data, error } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('session_start', { ascending: false })
    .limit(limit)

  return { sessions: data, error }
}

export const getSession = async (sessionId, userId) => {
  const { data, error } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  return { session: data, error }
}

export const getSessionReport = async (sessionId, userId) => {
  // Get session data and any associated report
  const { data: session, error: sessionError } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (sessionError || !session) {
    return { report: null, error: sessionError }
  }

  // Look for a report on the same date as the session
  const sessionDate = new Date(session.session_start).toISOString().split('T')[0]
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .eq('report_date', sessionDate)
    .single()

  // Return the report if found, otherwise return the session data as a minimal report
  if (report) {
    return { report, error: null }
  } else {
    // Create a minimal report structure from session data
    const minimalReport = {
      id: session.id,
      title: `Session Report - ${sessionDate}`,
      report_date: sessionDate,
      session_duration: session.total_active_duration || 0,
      executive_summary: `Work session from ${new Date(session.session_start).toLocaleTimeString()} to ${new Date(session.session_end).toLocaleTimeString()}`,
      lines_written: 0,
      lines_deleted: 0,
      files_modified_count: 0,
      errors_encountered_count: 0,
      screenshot_count: session.screenshot_count || 0,
      created_at: session.created_at,
      updated_at: session.updated_at
    }
    return { report: minimalReport, error: null }
  }
}