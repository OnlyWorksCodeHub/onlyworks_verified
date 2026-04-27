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
  const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    logger.error('exchangeCodeForSession failed', { message: error.message, status: error.status })
    return NextResponse.redirect(`${origin}/login?error=signup_failed`)
  }

  // Decide where to send the user: returning users with a complete profile
  // go to /p/edit; new users go to /p/setup. The /p/setup page is also
  // gated client-side as a safety net, but doing it server-side avoids the
  // visible flash through the onboarding form for returning users.
  const accessToken = sessionData?.session?.access_token
  let nextPath = '/p/setup'

  if (accessToken) {
    try {
      const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'

      // Exchange Supabase token for backend JWT (same flow as AuthProvider)
      const tokenRes = await fetch(`${backendUrl}/api/auth/website/website-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabase_access_token: accessToken }),
      })
      const tokenData = tokenRes.ok ? await tokenRes.json() : null
      const backendToken = tokenData?.success ? tokenData?.data?.token : null

      if (backendToken) {
        const profileRes = await fetch(`${backendUrl}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        if (profileRes.ok) {
          const profileBody = await profileRes.json()
          const profile = profileBody?.data ?? profileBody
          const alreadySetUp =
            profile?.profile_complete === true ||
            (typeof profile?.full_name === 'string' && profile.full_name.trim().length > 0 && profile?.ow_id)
          if (alreadySetUp) nextPath = '/p/edit'
        }
      }
    } catch (err) {
      // Non-fatal — fall through to /p/setup, which has its own guard.
      logger.warn('Profile routing check failed in auth callback (falling through)', {
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.redirect(`${origin}${nextPath}`)
}
