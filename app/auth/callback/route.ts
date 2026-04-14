import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

// Map Supabase's cryptic error codes to user-friendly messages the login page
// can render. Anything not in this map falls through to 'signup_failed'.
const ERROR_CODE_MAP: Record<string, string> = {
  access_denied: 'access_denied',
  server_error: 'signup_failed',
  unexpected_failure: 'signup_failed',
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const errorCode = searchParams.get('error_code')

  // Supabase sometimes surfaces errors in the query string directly (code flow)
  // and sometimes only in the hash fragment (implicit flow — invisible here).
  // Log whatever we can see so ops has something to correlate.
  if (errorParam || errorDescription) {
    logger.error('OAuth callback received error', {
      error: errorParam,
      errorCode,
      errorDescription,
    })
    const mapped = ERROR_CODE_MAP[errorParam || ''] || ERROR_CODE_MAP[errorCode || ''] || 'signup_failed'
    return NextResponse.redirect(`${origin}/login?error=${mapped}`)
  }

  if (!code) {
    // Most common cause: Supabase redirected with error in the hash fragment
    // (which the server can't read). The login page's client-side catcher
    // will parse the hash and show a friendly message.
    logger.warn('OAuth callback missing code', { url: request.url })
    return NextResponse.redirect(`${origin}/login?error=signup_failed`)
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    logger.error('exchangeCodeForSession failed', { message: error.message, status: error.status })
    return NextResponse.redirect(`${origin}/login?error=signup_failed`)
  }

  // Session established. AuthProvider handles the backend-token exchange
  // and profile routing from here.
  return NextResponse.redirect(`${origin}/p/setup`)
}
