import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { valid: false, error: 'Email required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = getSupabaseAdmin()

    // Find customer by email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, email, stripe_customer_id')
      .eq('email', normalizedEmail)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({
        valid: false,
        error: 'No account found with this email. Start a free trial to get access.',
        needsTrial: true
      })
    }

    // Check for active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('id, status, trial_end, current_period_end')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (subError || !subscription) {
      return NextResponse.json({
        valid: false,
        error: 'No active subscription found. Start a free trial to get access.',
        needsTrial: true
      })
    }

    // Check subscription status
    const validStatuses = ['active', 'trialing']
    if (!validStatuses.includes(subscription.status)) {
      return NextResponse.json({
        valid: false,
        error: 'Your subscription has expired. Please renew to continue.',
        expired: true
      })
    }

    // Calculate trial days remaining if trialing
    let trialDaysRemaining = null
    if (subscription.status === 'trialing' && subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end * 1000) // Stripe uses Unix timestamps
      const now = new Date()
      const msRemaining = trialEnd.getTime() - now.getTime()
      trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
    }

    return NextResponse.json({
      valid: true,
      status: subscription.status,
      trialDaysRemaining,
      message: subscription.status === 'trialing'
        ? `Trial active - ${trialDaysRemaining} days remaining`
        : 'Subscription active'
    })

  } catch (error) {
    console.error('Subscription verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
