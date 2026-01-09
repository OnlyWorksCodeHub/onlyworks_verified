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

export async function POST(request: NextRequest) {
  try {
    const { email, priceId } = await request.json()

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Email and priceId are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if customer exists in database
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', normalizedEmail)
      .single()

    let stripeCustomerId: string

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id
    } else {
      // Create new Stripe customer
      const stripeCustomer = await getStripe().customers.create({
        email: normalizedEmail,
        metadata: { source: 'onlyworks_website' }
      })
      stripeCustomerId = stripeCustomer.id

      // Save customer to database
      await supabaseAdmin
        .from('customers')
        .upsert({
          email: normalizedEmail,
          stripe_customer_id: stripeCustomerId,
        }, { onConflict: 'email' })
    }

    // Create checkout session with 14-day trial
    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan_type: 'pro',
          customer_email: normalizedEmail,
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'}/downloads?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'}/pricing?canceled=true`,
      metadata: {
        customer_email: normalizedEmail,
        plan_type: 'pro',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
