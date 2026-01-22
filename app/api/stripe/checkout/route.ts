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
    const { email, priceId, attribution } = await request.json()

    console.log('Checkout request:', { email, priceId, hasStripeKey: !!process.env.STRIPE_SECRET_KEY, attribution })

    if (!email || !priceId) {
      console.error('Missing required fields:', { email: !!email, priceId: !!priceId })
      return NextResponse.json(
        { error: 'Email and priceId are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if customer exists in database
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id, source_partner')
      .eq('email', normalizedEmail)
      .single()

    let stripeCustomerId: string

    if (existingCustomer?.stripe_customer_id) {
      // Verify customer still exists in Stripe
      try {
        await getStripe().customers.retrieve(existingCustomer.stripe_customer_id)
        stripeCustomerId = existingCustomer.stripe_customer_id

        // Update attribution if provided and not already set
        if (attribution?.source_partner && !existingCustomer.source_partner) {
          await supabaseAdmin
            .from('customers')
            .update({
              source_partner: attribution.source_partner,
              attribution_date: new Date().toISOString(),
              attribution_locked: true,
              first_opt_in: attribution.first_opt_in || false,
              future_opt_in: attribution.future_opt_in || false,
            })
            .eq('email', normalizedEmail)
        }
      } catch {
        // Customer doesn't exist in Stripe anymore, create a new one
        console.log('Stale customer ID, creating new Stripe customer')
        const stripeCustomer = await getStripe().customers.create({
          email: normalizedEmail,
          metadata: { source: 'onlyworks_website' }
        })
        stripeCustomerId = stripeCustomer.id

        // Prepare update data with new customer ID and attribution
        const updateData: any = { stripe_customer_id: stripeCustomerId }

        if (attribution?.source_partner && !existingCustomer.source_partner) {
          updateData.source_partner = attribution.source_partner
          updateData.attribution_date = new Date().toISOString()
          updateData.attribution_locked = true
          updateData.first_opt_in = attribution.first_opt_in || false
          updateData.future_opt_in = attribution.future_opt_in || false
        }

        // Update database with new customer ID
        await supabaseAdmin
          .from('customers')
          .update(updateData)
          .eq('email', normalizedEmail)
      }
    } else {
      // Create new Stripe customer
      const stripeCustomer = await getStripe().customers.create({
        email: normalizedEmail,
        metadata: { source: 'onlyworks_website' }
      })
      stripeCustomerId = stripeCustomer.id

      // Prepare customer data with attribution
      const customerData: any = {
        email: normalizedEmail,
        stripe_customer_id: stripeCustomerId,
      }

      // Add attribution fields if provided
      if (attribution?.source_partner) {
        customerData.source_partner = attribution.source_partner
        customerData.attribution_date = new Date().toISOString()
        customerData.attribution_locked = true
        customerData.first_opt_in = attribution.first_opt_in || false
        customerData.future_opt_in = attribution.future_opt_in || false
      }

      // Save customer to database
      await supabaseAdmin
        .from('customers')
        .upsert(customerData, { onConflict: 'email' })
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    )
  }
}
