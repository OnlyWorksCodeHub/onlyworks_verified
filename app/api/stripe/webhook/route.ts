import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateAccessCode, sendAccessCodeEmail, sendTrialEndingEmail } from '@/lib/stripe/utils'

let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return stripeClient
}

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
    console.error('Webhook signature verification failed:', err)
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
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.metadata?.customer_email
  if (!email) {
    console.error('No email found in checkout session')
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
    const { data: newCustomer } = await supabaseAdmin
      .from('customers')
      .insert({
        email: normalizedEmail,
        stripe_customer_id: stripeCustomerId,
      })
      .select('id')
      .single()
    customer = newCustomer
  }

  if (!customer) {
    console.error('Failed to get/create customer')
    return
  }

  // Get subscription details
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
    const subData = subscription as any

  // Create subscription record
  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      customer_id: customer.id,
      stripe_subscription_id: subscriptionId,
      status: subData.status,
      trial_end: subData.trial_end
        ? new Date(subData.trial_end * 1000).toISOString()
        : null,
      current_period_end: subData.current_period_end
        ? new Date(subData.current_period_end * 1000).toISOString()
        : null,
    }, { onConflict: 'stripe_subscription_id' })

  // Check if access code already exists for this customer
  const { data: existingCode } = await supabaseAdmin
    .from('access_codes')
    .select('code')
    .eq('customer_id', customer.id)
    .eq('is_active', true)
    .single()

  if (existingCode) {
    // Resend existing code
    await sendAccessCodeEmail(normalizedEmail, existingCode.code, subData.status === 'trialing')
    return
  }

  // Generate new access code
  const accessCode = generateAccessCode()

  // Determine expiration (null for paid, trial_end for trials)
  const expiresAt = subData.status === 'trialing' && subData.trial_end
    ? new Date(subData.trial_end * 1000).toISOString()
    : null

  // Store access code
  await supabaseAdmin.from('access_codes').insert({
    code: accessCode,
    customer_id: customer.id,
    email: normalizedEmail,
    is_active: true,
    expires_at: expiresAt,
  })

  // Send email with access code
  await sendAccessCodeEmail(normalizedEmail, accessCode, subData.status === 'trialing')
}

async function handleSubscriptionUpdate(subscription: any) {
  const stripeCustomerId = subscription.customer as string

  // Get customer from database with email
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id, email')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!customer) return

  // Update subscription record
  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    }, { onConflict: 'stripe_subscription_id' })

  // Update access code status based on subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    // Ensure access code is active and update expiration
    await supabaseAdmin
      .from('access_codes')
      .update({
        is_active: true,
        expires_at: subscription.status === 'trialing' && subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null
      })
      .eq('customer_id', customer.id)

    // Sync profile subscription status (for users who linked their access code)
    // This ensures trial->paid conversion updates the profile
    if (customer.email) {
      const subscriptionType = subscription.status === 'active' ? 'paid' : 'trial'
      const trialEndsAt = subscription.status === 'trialing' && subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null

      // Update any profiles with matching email
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_type: subscriptionType,
          subscription_status: 'active',
          trial_ends_at: trialEndsAt,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email.toLowerCase())

      console.log(`Profile synced for ${customer.email}: ${subscriptionType}`)
    }
  } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
    // Deactivate access codes
    await supabaseAdmin
      .from('access_codes')
      .update({ is_active: false })
      .eq('customer_id', customer.id)

    // Update profile subscription status
    if (customer.email) {
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email.toLowerCase())
    }
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  const stripeCustomerId = subscription.customer as string

  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (customer) {
    // Deactivate access codes
    await supabaseAdmin
      .from('access_codes')
      .update({ is_active: false })
      .eq('customer_id', customer.id)

    // Update subscription status
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
  }
}

async function handleTrialEnding(subscription: any) {
  const stripeCustomerId = subscription.customer as string

  // Get customer email
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('email')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!customer?.email) {
    console.error('No customer email found for trial ending notification')
    return
  }

  // Calculate days remaining
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null

  if (!trialEnd) {
    console.error('No trial end date in subscription')
    return
  }

  const now = new Date()
  const msRemaining = trialEnd.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000))

  // Send notification email
  await sendTrialEndingEmail(customer.email, daysRemaining)
  console.log(`Trial ending notification sent to ${customer.email} (${daysRemaining} days remaining)`)
}
