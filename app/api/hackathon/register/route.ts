import { randomInt } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
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

    return NextResponse.json({ ok: true, serial })
  } catch (error) {
    console.error('Hackathon registration error:', error)
    return NextResponse.json({ ok: false, error: 'Registration failed' }, { status: 500 })
  }
}
