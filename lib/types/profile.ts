export interface ProfileData {
  full_name?: string
  name?: string
  ow_id: string
  job_title?: string
  company?: string
  avatar_url?: string
  bio?: string
  member_since?: string
  is_profile_public: boolean
  badge: 'verified' | 'trial' | 'previously_verified' | 'none'
}

export interface StatsData {
  total_verified_hours?: number
  total_sessions?: number
  avg_productivity_score?: number
  avg_focus_score?: number
  current_streak?: number
  longest_streak?: number
  top_apps?: Array<{ name: string; hours: number }>
  limited?: boolean
  previously_verified?: boolean
}

export interface ReportData {
  id: string
  title: string
  date: string
  share_token: string
}

export interface PrivacySettings {
  show_name?: boolean
  show_company?: boolean
  show_title?: boolean
  show_hours?: boolean
  show_apps?: boolean
  show_scores?: boolean
  show_streaks?: boolean
  show_stats?: boolean
  show_streak?: boolean
  show_reports?: boolean
  is_profile_public?: boolean
}

export type BadgeStatus = 'verified' | 'trial' | 'previously_verified' | 'none'
