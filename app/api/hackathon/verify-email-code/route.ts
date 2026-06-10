import { NextRequest, NextResponse } from 'next/server'
import {
  CODE_COOKIE,
  MAX_VERIFY_ATTEMPTS,
  VERIFIED_COOKIE,
  VERIFIED_TTL_SECONDS,
  CodeTokenData,
  VerifiedTokenData,
  sha256,
  signToken,
  verifyToken,
} from '@/lib/hackathon/verification'

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

    const normalisedEmail = String(email).trim().toLowerCase()
    const now = Math.floor(Date.now() / 1000)

    const data = verifyToken<CodeTokenData>(request.cookies.get(CODE_COOKIE)?.value)
    if (!data || data.exp < now) {
      return NextResponse.json(
        { valid: false, error: 'Code expired or not found. Request a new one.' },
        { status: 200 },
      )
    }
    if (data.e !== sha256(normalisedEmail)) {
      return NextResponse.json(
        { valid: false, error: 'Code was sent to a different email. Request a new one.' },
        { status: 200 },
      )
    }
    if (data.att >= MAX_VERIFY_ATTEMPTS) {
      return NextResponse.json(
        { valid: false, error: 'Too many wrong attempts. Request a new code.' },
        { status: 200 },
      )
    }

    if (data.c !== sha256(String(code).trim())) {
      // Re-sign the cookie with the attempt counter bumped so guessing is bounded.
      const bumped = signToken({ ...data, att: data.att + 1 } satisfies CodeTokenData)
      const response = NextResponse.json(
        { valid: false, error: 'Code does not match. Check your inbox and try again.' },
        { status: 200 },
      )
      response.cookies.set(CODE_COOKIE, bumped, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/hackathon',
        maxAge: Math.max(data.exp - now, 1),
      })
      return response
    }

    const verifiedToken = signToken({
      e: sha256(normalisedEmail),
      exp: now + VERIFIED_TTL_SECONDS,
    } satisfies VerifiedTokenData)

    const response = NextResponse.json({ valid: true })
    response.cookies.set(VERIFIED_COOKIE, verifiedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/hackathon',
      maxAge: VERIFIED_TTL_SECONDS,
    })
    // The code is single-use: drop it once verified.
    response.cookies.set(CODE_COOKIE, '', { path: '/api/hackathon', maxAge: 0 })
    return response
  } catch (error) {
    console.error('Email code verify error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
