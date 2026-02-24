import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAccessCode, sendAccessCodeEmail, sendTrialEndingEmail } from '@/lib/stripe/utils'
import { logger } from '@/lib/logger'
import { getStripe } from '@/lib/stripe/client'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    logger.error('Webhook signature verification failed', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialEnding(event.data.object as Stripe.Subscription)
        break
    }
  } catch (error) {
    logger.error('Webhook handler error', { error: error instanceof Error ? (error as Error).message : String(error) })
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.metadata?.customer_email
  if (!email) {
    logger.error('No email found in checkout session')
    return
  }

  const normalizedEmail = email.toLowerCase()
  const stripeCustomerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get or create customer record
  let { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (!customer) {
    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from('customers')
      .insert({
        email: normalizedEmail,
        stripe_customer_id: stripeCustomerId,
      })
      .select('id')
      .single()
    if (insertError) {
      logger.error('Failed to insert customer', { error: insertError.message, email: normalizedEmail })
    }
    customer = newCustomer
  }

  if (!customer) {
    logger.error('Failed to get/create customer', { email: normalizedEmail })
    return
  }

  // Get subscription details
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId)

  // Create subscription record
  const { error: upsertSubError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      customer_id: customer.id,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_end: subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null,
    }, { onConflict: 'stripe_subscription_id' })
  if (upsertSubError) {
    logger.error('Failed to upsert subscription in checkout', { error: upsertSubError.message, subscriptionId })
  }

  // Check if access code already exists for this customer
  const { data: existingCode } = await supabaseAdmin
    .from('access_codes')
    .select('code')
    .eq('customer_id', customer.id)
    .eq('is_active', true)
    .single()

  if (existingCode) {
    // Resend existing code
    await sendAccessCodeEmail(normalizedEmail, existingCode.code, subscription.status === 'trialing')
    return
  }

  // Generate new access code
  const accessCode = generateAccessCode()

  // Determine expiration (null for paid, trial_end for trials)
  const expiresAt = subscription.status === 'trialing' && subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null

  // Store access code
  const { error: insertCodeError } = await supabaseAdmin.from('access_codes').insert({
    code: accessCode,
    customer_id: customer.id,
    email: normalizedEmail,
    is_active: true,
    expires_at: expiresAt,
  })
  if (insertCodeError) {
    logger.error('Failed to insert access code', { error: insertCodeError.message, email: normalizedEmail })
  }

  // Send email with access code
  await sendAccessCodeEmail(normalizedEmail, accessCode, subscription.status === 'trialing')
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string

  // Get customer from database with email and attribution
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id, email, source_partner')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!customer) return

  // Update subscription record
  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_end: subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null,
    }, { onConflict: 'stripe_subscription_id' })
  if (upsertError) {
    logger.error('Failed to upsert subscription', { error: upsertError.message, subscriptionId: subscription.id })
  }

  // Update access code status based on subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    // Ensure access code is active and update expiration
    const { error: updateCodeError } = await supabaseAdmin
      .from('access_codes')
      .update({
        is_active: true,
        expires_at: subscription.status === 'trialing' && subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null
      })
      .eq('customer_id', customer.id)
    if (updateCodeError) {
      logger.error('Failed to update access code', { error: updateCodeError.message, customerId: customer.id })
    }

    // Create partner payout if customer has source_partner and becomes paid subscriber
    if (subscription.status === 'active' && customer.source_partner) {
      // Check if payout already exists for this customer
      const { data: existingPayout } = await supabaseAdmin
        .from('partner_payouts')
        .select('id')
        .eq('customer_id', customer.id)
        .single()

      if (!existingPayout) {
        // Create pending payout
        const { error: payoutError } = await supabaseAdmin
          .from('partner_payouts')
          .insert({
            partner_id: customer.source_partner,
            customer_id: customer.id,
            amount: 10.00,
            status: 'pending',
            subscription_date: new Date().toISOString(),
          })
        if (payoutError) {
          logger.error('Failed to insert partner payout', { error: payoutError.message, partnerId: customer.source_partner })
        } else {
          logger.info('Created partner payout', { partnerId: customer.source_partner, customerId: customer.id, amount: 10.00 })
        }
      }
    }

    // Sync profile subscription status (for users who linked their access code)
    // This ensures trial->paid conversion updates the profile
    if (customer.email) {
      const subscriptionType = subscription.status === 'active' ? 'paid' : 'trial'
      const trialEndsAt = subscription.status === 'trialing' && subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null

      // Update any profiles with matching email
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_type: subscriptionType,
          subscription_status: 'active',
          trial_ends_at: trialEndsAt,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email.toLowerCase())
      if (profileError) {
        logger.error('Failed to sync profile subscription', { error: profileError.message, email: customer.email })
      } else {
        logger.info('Profile synced', { email: customer.email, subscriptionType })
      }
    }
  } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
    // Deactivate access codes
    const { error: deactivateError } = await supabaseAdmin
      .from('access_codes')
      .update({ is_active: false })
      .eq('customer_id', customer.id)
    if (deactivateError) {
      logger.error('Failed to deactivate access codes', { error: deactivateError.message, customerId: customer.id })
    }

    // Update profile subscription status
    if (customer.email) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email.toLowerCase())
      if (profileError) {
        logger.error('Failed to update profile status', { error: profileError.message, email: customer.email })
      }
    }
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string

  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (customer) {
    // Deactivate access codes
    const { error: deactivateError } = await supabaseAdmin
      .from('access_codes')
      .update({ is_active: false })
      .eq('customer_id', customer.id)
    if (deactivateError) {
      logger.error('Failed to deactivate access codes on cancel', { error: deactivateError.message, customerId: customer.id })
    }

    // Update subscription status
    const { error: updateSubError } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
    if (updateSubError) {
      logger.error('Failed to update subscription status on cancel', { error: updateSubError.message, subscriptionId: subscription.id })
    }
  }
}

async function handleTrialEnding(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string

  // Get customer email
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('email')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!customer?.email) {
    logger.error('No customer email found for trial ending notification')
    return
  }

  // Calculate days remaining
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null

  if (!trialEnd) {
    logger.error('No trial end date in subscription', { subscriptionId: subscription.id })
    return
  }

  const now = new Date()
  const msRemaining = trialEnd.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000))

  // Send notification email
  await sendTrialEndingEmail(customer.email, daysRemaining)
  logger.info('Trial ending notification sent', { email: customer.email, daysRemaining })
}
