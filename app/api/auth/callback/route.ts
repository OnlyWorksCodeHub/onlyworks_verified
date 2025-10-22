import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth exchange error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin))
      }
    } catch (err) {
      console.error('Auth callback error:', err)
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin))
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect('https://www.only-works.com/dashboard')
}
