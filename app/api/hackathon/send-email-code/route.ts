import { randomInt } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  CODE_COOKIE,
  CODE_TTL_SECONDS,
  RESEND_COOLDOWN_SECONDS,
  CodeTokenData,
  sha256,
  signToken,
  verifyToken,
} from '@/lib/hackathon/verification'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function codeEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f1ece2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1b18;">
  <div style="max-width: 520px; margin: 0 auto; padding: 40px 24px;">
    <div style="border: 2px solid #1c1b18; padding: 32px; background-color: #f1ece2;">
      <p style="margin: 0; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: #807d72;">ONLYWEIRD &rsquo;26 &middot; Registration</p>
      <h1 style="margin: 16px 0 0; font-size: 22px; line-height: 1.2;">Your verification code.</h1>
      <p style="margin: 24px 0 0; font-size: 40px; font-weight: 800; letter-spacing: 0.18em; color: #e63a13;">${code}</p>
      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #4a4842;">
        Paste this into the registration form. It expires in 10 minutes.
        If you didn&rsquo;t request it, ignore this email — nothing happens without the code.
      </p>
    </div>
    <p style="margin: 16px 0 0; font-size: 11px; text-align: center; color: #807d72;">&copy; ${new Date().getFullYear()} OnlyWorks</p>
  </div>
</body>
</html>
`
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json({ ok: false, error: 'Valid email required' }, { status: 400 })
    }

    const normalisedEmail = email.trim().toLowerCase()
    const now = Math.floor(Date.now() / 1000)

    // Resend cooldown: the previous code cookie carries its send timestamp.
    const existing = verifyToken<CodeTokenData>(request.cookies.get(CODE_COOKIE)?.value)
    if (existing && existing.sent && now - existing.sent < RESEND_COOLDOWN_SECONDS) {
      return NextResponse.json(
        { ok: false, error: 'Too many code requests. Wait a minute, then try again.' },
        { status: 429 },
      )
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0')

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'OnlyWorks <noreply@only-works.com>',
      to: normalisedEmail,
      subject: `${code} is your ONLYWEIRD '26 code`,
      html: codeEmailHtml(code),
    })
    if (error) {
      console.error('Email code send failed:', error)
      return NextResponse.json(
        { ok: false, error: 'Could not send a code right now. Try again in a moment.' },
        { status: 503 },
      )
    }

    const token = signToken({
      e: sha256(normalisedEmail),
      c: sha256(code),
      exp: now + CODE_TTL_SECONDS,
      sent: now,
      att: 0,
    } satisfies CodeTokenData)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(CODE_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/hackathon',
      maxAge: CODE_TTL_SECONDS,
    })
    return response
  } catch (error) {
    console.error('Email code send error:', error)
    return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 500 })
  }
}
