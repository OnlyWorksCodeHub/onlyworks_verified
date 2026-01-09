import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Legacy hardcoded codes for backward compatibility
const LEGACY_CODES = ['ONLYWORKS', 'OW2025']

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code required' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    // Check legacy codes first
    if (LEGACY_CODES.includes(normalizedCode)) {
      return NextResponse.json({
        valid: true,
        type: 'legacy',
        message: 'Access granted'
      })
    }

    // Check database for access codes
    const supabase = createClient()

    const { data: accessCode, error } = await supabase
      .from('access_codes')
      .select('id, code, is_active, expires_at')
      .eq('code', normalizedCode)
      .single()

    if (error || !accessCode) {
      return NextResponse.json({ valid: false, error: 'Invalid access code' }, { status: 401 })
    }

    // Check if code is active
    if (!accessCode.is_active) {
      return NextResponse.json({
        valid: false,
        error: 'This access code has been deactivated'
      }, { status: 401 })
    }

    // Check expiration
    if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This access code has expired'
      }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      type: 'subscription',
      message: 'Access granted'
    })

  } catch (error) {
    console.error('Access code validation error:', error)
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 })
  }
}
