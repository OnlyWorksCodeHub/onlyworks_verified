import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAILS } from '@/lib/config'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }), user: null }
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user: null }
  }

  return { error: null, user: session.user }
}
