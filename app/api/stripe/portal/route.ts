import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return stripeClient
}

/**
 * Create a Stripe Customer Portal session
 * POST /api/stripe/portal
 * Body: { email: string }
 * Returns: { url: string } - The portal URL to redirect the user to
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Look up customer in database
    const { data: customer, error: dbError } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', normalizedEmail)
      .single()

    if (dbError || !customer?.stripe_customer_id) {
      console.error('Customer not found:', { email: normalizedEmail, dbError })
      return NextResponse.json(
        { error: 'No subscription found for this email. Please contact support.' },
        { status: 404 }
      )
    }

    // Verify customer exists in Stripe
    try {
      await getStripe().customers.retrieve(customer.stripe_customer_id)
    } catch {
      console.error('Stripe customer not found:', customer.stripe_customer_id)
      return NextResponse.json(
        { error: 'Subscription record not found. Please contact support.' },
        { status: 404 }
      )
    }

    // Create billing portal session
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'}/`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create portal session', details: errorMessage },
      { status: 500 }
    )
  }
}
