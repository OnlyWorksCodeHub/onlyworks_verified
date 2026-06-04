import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_PATTERN = /^\d{6}$/

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !EMAIL_PATTERN.test(String(email).trim())) {
      return NextResponse.json({ valid: false, error: 'Valid email required' }, { status: 400 })
    }
    if (!code || !CODE_PATTERN.test(String(code).trim())) {
      return NextResponse.json({ valid: false, error: 'Enter the 6-digit code from your email' }, { status: 400 })
    }

    // TODO(weird@only-works.com): replace with real backend endpoint once shipped.
    // Expected contract: POST /api/hackathon/email-codes/verify { email, code } → 200 { valid: true }
    // Backend: look up the most recent code for { email }, check it hasn't expired or been used,
    // mark consumed on success. On failure, return { valid: false, error: '...' }.
    const response = await fetch(`${BACKEND_URL}/api/hackathon/email-codes/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(email).trim().toLowerCase(),
        code: String(code).trim(),
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!response) {
      return NextResponse.json({ valid: false, error: 'Could not reach OnlyWorks' }, { status: 503 })
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok || !data.valid) {
      return NextResponse.json(
        { valid: false, error: data.error || 'Code does not match. Check your inbox and try again.' },
        { status: response.status === 404 ? 200 : response.status },
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Email code verify error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
