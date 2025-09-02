import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  console.log('Callback hit!')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Code received:', code)
  
  if (!code) {
    console.log('No code, redirecting to login')
    return NextResponse.redirect(`${requestUrl.origin}/login`)
  }
  
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Exchange result:', { data, error })
    
    if (error) {
      console.error('Exchange failed:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${error.message}`)
    }
    
    // Force redirect to dashboard with full URL
    const dashboardUrl = new URL('/dashboard', requestUrl.origin)
    console.log('Redirecting to:', dashboardUrl.toString())
    
    return NextResponse.redirect(dashboardUrl)
    
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_error`)
  }
}
