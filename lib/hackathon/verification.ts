import { createHmac, createHash, timingSafeEqual } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { BACKEND_URL } from '@/lib/config'

// Stateless email-code verification for the ONLYWEIRD registration flow.
// The 6-digit code is never stored server-side: we hand the browser an
// HMAC-signed cookie holding hashes of { email, code } plus an expiry, and
// verify against it. Works across serverless instances with no table.

export const CODE_COOKIE = 'ow_hk_ec'
export const VERIFIED_COOKIE = 'ow_hk_ev'
export const CODE_TTL_SECONDS = 10 * 60
export const VERIFIED_TTL_SECONDS = 60 * 60
export const RESEND_COOLDOWN_SECONDS = 60
export const MAX_VERIFY_ATTEMPTS = 5

function getSecret(): string {
  const secret = process.env.HACKATHON_CODE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new Error('No HACKATHON_CODE_SECRET or SUPABASE_SERVICE_ROLE_KEY configured')
  return secret
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hmac(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function signToken(data: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function verifyToken<T = Record<string, unknown>>(token: string | undefined): T | null {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot < 1) return null
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = hmac(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

export interface CodeTokenData {
  e: string // sha256(email)
  c: string // sha256(code)
  exp: number // unix seconds
  sent: number // unix seconds of last send (resend cooldown)
  att: number // failed verify attempts so far
}

export interface VerifiedTokenData {
  e: string // sha256(email)
  exp: number
}

export function isEmailVerified(token: string | undefined, email: string): boolean {
  const data = verifyToken<VerifiedTokenData>(token)
  if (!data) return false
  if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return false
  return data.e === sha256(email.trim().toLowerCase())
}

export interface OwIdLookup {
  reachable: boolean
  found: boolean
  handle: string | null
  displayName: string | null
}

const OW_ID_PATTERN = /^[A-Z0-9]{4,12}$/

export function normaliseOwId(raw: string): string | null {
  const normalised = raw.replace(/^OW-?/i, '').toUpperCase().trim()
  return OW_ID_PATTERN.test(normalised) ? normalised : null
}

// Checks Supabase first (same DB the desktop backend writes profiles to),
// then falls back to the backend's public ow-profile endpoint. "Unreachable"
// only when neither source could be consulted.
export async function lookupOwId(normalised: string): Promise<OwIdLookup> {
  let anySourceReachable = false

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('profiles')
      .select('*')
      .in('ow_id', [normalised, `OW-${normalised}`])
      .limit(1)
    if (!error) {
      anySourceReachable = true
      const row = data?.[0]
      if (row) {
        return {
          reachable: true,
          found: true,
          handle: row.username ?? row.handle ?? null,
          displayName: row.display_name ?? row.full_name ?? row.name ?? null,
        }
      }
    }
  } catch {
    // fall through to backend
  }

  const response = await fetch(
    `${BACKEND_URL}/api/profiles/${encodeURIComponent(normalised)}/ow-profile`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
    },
  ).catch(() => null)

  if (response) {
    anySourceReachable = true
    if (response.ok) {
      const data = await response.json().catch(() => ({} as Record<string, unknown>))
      const profile = (data?.profile ?? data?.data ?? data) as Record<string, unknown>
      return {
        reachable: true,
        found: true,
        handle: (profile?.username as string) ?? (profile?.handle as string) ?? null,
        displayName: (profile?.display_name as string) ?? (profile?.displayName as string) ?? null,
      }
    }
  }

  return { reachable: anySourceReachable, found: false, handle: null, displayName: null }
}
