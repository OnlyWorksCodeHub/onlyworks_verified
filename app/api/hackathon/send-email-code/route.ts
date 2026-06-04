import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 })
    }

    // TODO(weird@only-works.com): replace with real backend endpoint once shipped.
    // Expected contract: POST /api/hackathon/email-codes/send { email } → 200 { ok: true }
    // Backend is responsible for: generating a 6-digit code, storing { email, code, expires_at }
    // with a short TTL (~10 min), rate-limiting by email + IP, and dispatching the email
    // via the project's transactional sender. Returning the code to the client is never OK.
    const response = await fetch(`${BACKEND_URL}/api/hackathon/email-codes/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!response || !response.ok) {
      const status = response?.status === 429 ? 429 : 503
      const error = response?.status === 429
        ? 'Too many code requests. Wait a minute, then try again.'
        : 'Could not send a code right now. Try again in a moment.'
      return NextResponse.json({ ok: false, error }, { status })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Email code send error:', error)
    return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 500 })
  }
}
