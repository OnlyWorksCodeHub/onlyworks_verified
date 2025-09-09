import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/logger'

export async function authenticateRequest(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // Get user from token or session
    const { data: { user }, error } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser()
    
    if (error || !user) {
      log.warn('Authentication failed', { error: error?.message })
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }
    
    return { user, error: null }
  } catch (error) {
    log.error('Authentication error', error)
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  }
}

export async function requireAuth(request: NextRequest) {
  const { user, error } = await authenticateRequest(request)
  if (error) return error
  return user!
}
