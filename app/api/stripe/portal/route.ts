import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { getStripe } from '@/lib/stripe/client'
import { APP_URL } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Look up customer by email
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', normalizedEmail)
      .single()

    if (!customer?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found for this email' },
        { status: 404 }
      )
    }

    // Create Stripe billing portal session
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: APP_URL,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    logger.error('Portal error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
