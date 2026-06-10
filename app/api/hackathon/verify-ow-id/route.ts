import { NextRequest, NextResponse } from 'next/server'
import { lookupOwId, normaliseOwId } from '@/lib/hackathon/verification'

export async function POST(request: NextRequest) {
  try {
    const { owId } = await request.json()

    if (!owId || typeof owId !== 'string') {
      return NextResponse.json({ valid: false, error: 'OW ID required' }, { status: 400 })
    }

    const normalised = normaliseOwId(owId)
    if (!normalised) {
      return NextResponse.json(
        { valid: false, error: 'Not a valid OW ID format' },
        { status: 200 },
      )
    }

    const lookup = await lookupOwId(normalised)

    if (!lookup.reachable) {
      return NextResponse.json(
        { valid: false, error: 'Could not reach OnlyWorks', reachable: false },
        { status: 503 },
      )
    }

    if (!lookup.found) {
      return NextResponse.json(
        { valid: false, error: 'No OnlyWorks account with that ID', reachable: true },
        { status: 200 },
      )
    }

    return NextResponse.json({
      valid: true,
      owId: `OW-${normalised}`,
      handle: lookup.handle,
      displayName: lookup.displayName,
    })
  } catch (error) {
    console.error('OW ID verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
