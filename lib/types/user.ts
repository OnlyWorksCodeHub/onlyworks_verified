export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  profession: string | null
  company: string | null
  avatar_url: string | null
  preferences: {
    feedback_style: 'encouraging' | 'direct' | 'analytical' | 'balanced'
    notification_frequency: 'realtime' | 'session_end' | 'daily'
  }
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    company?: string
    profession?: string
  }
}
