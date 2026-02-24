import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to setup - AuthProvider will handle routing based on profile state
      return NextResponse.redirect(`${origin}/p/setup`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
