import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

const OW_ID_PATTERN = /^[A-Z0-9]{4,12}$/

export async function POST(request: NextRequest) {
  try {
    const { owId } = await request.json()

    if (!owId || typeof owId !== 'string') {
      return NextResponse.json({ valid: false, error: 'OW ID required' }, { status: 400 })
    }

    const normalised = owId.replace(/^OW-?/i, '').toUpperCase().trim()

    if (!OW_ID_PATTERN.test(normalised)) {
      return NextResponse.json(
        { valid: false, error: 'Not a valid OW ID format' },
        { status: 200 },
      )
    }

    // TODO(weird@only-works.com): replace with real backend endpoint once shipped.
    // Expected contract: GET /api/users/by-ow-id/:id → { exists: bool, handle?: string, displayName?: string }
    const response = await fetch(`${BACKEND_URL}/api/users/by-ow-id/${encodeURIComponent(normalised)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Short timeout — registration flow can't wait.
      signal: AbortSignal.timeout(4000),
    }).catch(() => null)

    if (!response || !response.ok) {
      // Backend unreachable or rejected. Surface a clear status so the client can
      // distinguish "format ok, account not found" from "we couldn't check right now".
      const status = response?.status === 404 ? 200 : 503
      return NextResponse.json(
        {
          valid: false,
          error: response?.status === 404 ? 'No OnlyWorks account with that ID' : 'Could not reach OnlyWorks',
          reachable: !!response,
        },
        { status },
      )
    }

    const data = await response.json().catch(() => ({}))

    return NextResponse.json({
      valid: true,
      owId: `OW-${normalised}`,
      handle: data.handle ?? null,
      displayName: data.displayName ?? null,
    })
  } catch (error) {
    console.error('OW ID verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
