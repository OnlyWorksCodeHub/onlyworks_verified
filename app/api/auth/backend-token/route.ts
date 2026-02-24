import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { BACKEND_URL } from '@/lib/config'

export async function POST() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'No session' }, { status: 401 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/website/website-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabase_access_token: session.access_token }),
    })

    const data = await res.json()

    if (!data.success) {
      return NextResponse.json({ error: 'Backend auth failed' }, { status: 401 })
    }

    return NextResponse.json({ token: data.data.token, user: data.data.user })
  } catch (err) {
    logger.error('Backend token exchange failed', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 })
  }
}
