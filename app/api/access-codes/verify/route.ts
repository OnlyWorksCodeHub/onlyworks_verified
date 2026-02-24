import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code required' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()
    const supabase = getSupabaseAdmin()

    // Find access code
    const { data: accessCode, error: codeError } = await supabase
      .from('access_codes')
      .select('id, code, customer_id, is_active, expires_at, email')
      .eq('code', normalizedCode)
      .single()

    if (codeError || !accessCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid access code'
      }, { status: 404 })
    }

    // Check if code is active
    if (!accessCode.is_active) {
      return NextResponse.json({
        valid: false,
        error: 'This access code has been deactivated'
      }, { status: 403 })
    }

    // Check if code has expired
    if (accessCode.expires_at) {
      const expiresAt = new Date(accessCode.expires_at)
      if (expiresAt < new Date()) {
        return NextResponse.json({
          valid: false,
          error: 'This access code has expired. Please renew your subscription.'
        }, { status: 403 })
      }
    }

    // Get subscription status for this customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, trial_end, current_period_end')
      .eq('customer_id', accessCode.customer_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Calculate trial days remaining if trialing
    let trialDaysRemaining = null
    if (subscription?.status === 'trialing' && subscription?.trial_end) {
      const trialEnd = new Date(subscription.trial_end)
      const now = new Date()
      const msRemaining = trialEnd.getTime() - now.getTime()
      trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
    }

    return NextResponse.json({
      valid: true,
      status: subscription?.status || 'active',
      trialDaysRemaining,
      email: accessCode.email,
      message: subscription?.status === 'trialing'
        ? `Trial active - ${trialDaysRemaining} days remaining`
        : 'Subscription active'
    })

  } catch (error) {
    console.error('Access code verification error:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
