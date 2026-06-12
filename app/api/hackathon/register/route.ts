import { randomInt } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import {
  VERIFIED_COOKIE,
  isEmailVerified,
  lookupOwId,
  normaliseOwId,
} from '@/lib/hackathon/verification'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SERIAL_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function makeSerial(): string {
  let s = ''
  for (let i = 0; i < 4; i++) s += SERIAL_CHARS[randomInt(SERIAL_CHARS.length)]
  return `OW-WEIRD-${s}`
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function confirmationEmailHtml(name: string, serial: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f1ece2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1b18;">
  <div style="max-width: 520px; margin: 0 auto; padding: 40px 24px;">
    <div style="border: 2px solid #1c1b18; padding: 32px; background-color: #f1ece2;">
      <p style="margin: 0; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: #807d72;">ONLYHACKS for the ONLYWEIRD &rsquo;26 &middot; Hosted by OnlyWorks &times; Orbis</p>
      <h1 style="margin: 16px 0 0; font-size: 26px; line-height: 1.2;">You&rsquo;re in, ${escapeHtml(name)}.</h1>
      <p style="margin: 20px 0 0; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: #807d72;">Builder serial</p>
      <p style="margin: 6px 0 0; font-size: 34px; font-weight: 800; letter-spacing: 0.06em; color: #e63a13;">${serial}</p>
      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #4a4842;">
        Keep this serial — it goes on your badge, your submission, and your trophy if you somehow win.
        The 48-hour build window opens <strong style="color: #1c1b18;">Thursday 18 June &middot; 09:00 ET</strong>
        and closes <strong style="color: #1c1b18;">Saturday 20 June &middot; 09:00 ET</strong>, with in-person finals in NYC that evening.
        Discord and calendar details land in this inbox before kickoff.
      </p>
      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #4a4842;">
        Schedule: <a href="https://www.only-works.com/hackathon/schedule" style="color: #e63a13;">only-works.com/hackathon/schedule</a><br />
        Questions: <a href="mailto:weird@only-works.com" style="color: #e63a13;">weird@only-works.com</a>
      </p>
    </div>
    <p style="margin: 16px 0 0; font-size: 11px; text-align: center; color: #807d72;">&copy; ${new Date().getFullYear()} OnlyWorks &middot; you are receiving this because you registered for ONLYWEIRD &rsquo;26</p>
  </div>
</body>
</html>
`
}

// Best-effort: Resend v6 reports failures via the resolved { error } field
// (it does not throw), and the SDK has no built-in timeout — bound it so a
// hung send can't stall the registration response.
async function sendConfirmationEmail(email: string, name: string, serial: string): Promise<void> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await Promise.race([
      resend.emails.send({
        from: 'OnlyWorks <noreply@only-works.com>',
        to: email,
        subject: `You're in — ONLYWEIRD '26 · ${serial}`,
        html: confirmationEmailHtml(name, serial),
      }),
      new Promise<{ error: { message: string } }>(resolve =>
        setTimeout(() => resolve({ error: { message: 'send timed out after 5s' } }), 5000),
      ),
    ])
    if (result.error) {
      console.error('Registration confirmation email failed:', result.error)
    }
  } catch (emailError) {
    console.error('Registration confirmation email failed:', emailError)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim().slice(0, 120)
    const email = String(body.email ?? '').trim().toLowerCase()
    const rawOwId = String(body.owId ?? '').trim()

    if (!name || !EMAIL_PATTERN.test(email) || !rawOwId || body.agree !== true) {
      return NextResponse.json({ ok: false, error: 'Fill out the required fields before submitting.' }, { status: 400 })
    }

    if (!isEmailVerified(request.cookies.get(VERIFIED_COOKIE)?.value, email)) {
      return NextResponse.json(
        { ok: false, error: 'Verify your email with the 6-digit code before submitting.' },
        { status: 401 },
      )
    }

    const normalised = normaliseOwId(rawOwId)
    if (!normalised) {
      return NextResponse.json({ ok: false, error: 'Not a valid OW ID format' }, { status: 400 })
    }

    // Re-check the OW ID server-side. If OnlyWorks is reachable and says the
    // account doesn't exist, reject; if unreachable, accept and flag the row
    // for a later backcheck — the form promises "we'll re-check on submit".
    const lookup = await lookupOwId(normalised)
    if (lookup.reachable && !lookup.found) {
      return NextResponse.json(
        { ok: false, error: 'That OW ID could not be verified. Check your OnlyWorks dashboard and try again.' },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdmin()

    const { data: existing, error: existingError } = await supabase
      .from('hackathon_registrations')
      .select('serial')
      .eq('email', email)
      .limit(1)
    if (!existingError && existing && existing.length > 0) {
      // Re-send the confirmation — re-registering is usually someone
      // recovering a lost serial, and the success screen promises an email.
      await sendConfirmationEmail(email, name, existing[0].serial)
      return NextResponse.json({ ok: true, serial: existing[0].serial, already: true })
    }

    const serial = makeSerial()
    const { error: insertError } = await supabase.from('hackathon_registrations').insert({
      name,
      email,
      ow_id: `OW-${normalised}`,
      ow_verified: lookup.found,
      github: String(body.github ?? '').trim() || null,
      blurb: String(body.blurb ?? '').trim().slice(0, 280) || null,
      team: body.team === 'team' ? 'team' : 'solo',
      team_name: String(body.teamName ?? '').trim() || null,
      attending: ['in-person', 'maybe', 'remote'].includes(body.attending) ? body.attending : 'maybe',
      referrer: String(body.referrer ?? '').trim() || null,
      serial,
    })
    if (insertError) {
      console.error('Hackathon registration insert failed:', insertError)
      return NextResponse.json(
        { ok: false, error: 'Could not save your registration right now. Try again in a moment.' },
        { status: 503 },
      )
    }

    // Best-effort confirmation email — registration already succeeded.
    await sendConfirmationEmail(email, name, serial)

    return NextResponse.json({ ok: true, serial })
  } catch (error) {
    console.error('Hackathon registration error:', error)
    return NextResponse.json({ ok: false, error: 'Registration failed' }, { status: 500 })
  }
}
