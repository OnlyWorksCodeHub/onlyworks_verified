import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAILS } from '@/lib/config'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const supabase = createClient()
  // getUser() round-trips to the Auth server and verifies the JWT signature.
  // getSession() only reads the (forgeable) cookie, so it must not gate access.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }), user: null }
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user: null }
  }

  return { error: null, user }
}
