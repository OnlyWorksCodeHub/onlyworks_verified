import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Determine the correct origin based on environment
  let origin = requestUrl.origin
  
  // Force production URL if we detect localhost in production
  if (process.env.NODE_ENV === 'production' || origin.includes('only-works.com')) {
    origin = 'https://only-works.com'
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
      }
    } catch (error) {
      console.error('Callback error:', error)
      return NextResponse.redirect(`${origin}/login?error=callback_failed`)
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(`${origin}/dashboard`)
}
