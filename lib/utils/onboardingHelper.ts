import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  user_role?: 'manager' | 'member' | null
  onboarding_completed_at?: string | null
  current_team_id?: string | null
  preferences?: Record<string, any>
}

/**
 * Check if a user needs to complete onboarding
 * Returns true if user_role is null/undefined
 */
export async function needsOnboarding(userId: string): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error checking onboarding status:', error)
      return true // Default to showing onboarding if error
    }

    return !profile?.user_role
  } catch (error) {
    console.error('Error in needsOnboarding:', error)
    return true
  }
}

/**
 * Get user profile with onboarding-related fields
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, user_role, onboarding_completed_at, current_team_id, preferences')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return profile as UserProfile
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

/**
 * Complete onboarding by setting user role and timestamp
 */
export async function completeOnboarding(
  userId: string,
  role: 'manager' | 'member',
  teamId?: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const updates: any = {
      user_role: role,
      onboarding_completed_at: new Date().toISOString(),
    }

    if (teamId) {
      updates.current_team_id = teamId
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      console.error('Error completing onboarding:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in completeOnboarding:', error)
    return { success: false, error }
  }
}

/**
 * Determine where user should be redirected based on their profile
 */
export function getRedirectPath(profile: UserProfile | null): string {
  if (!profile || !profile.user_role) {
    return '/onboarding'
  }

  // Redirect based on role
  if (profile.user_role === 'manager') {
    return '/workspace'
  }

  return '/dashboard'
}
