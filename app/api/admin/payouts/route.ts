import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('partner_payouts')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: payouts, error } = await query

    if (error) {
      console.error('Error fetching payouts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payouts' },
        { status: 500 }
      )
    }

    // Fetch partner names and customer emails separately
    const formattedPayouts = await Promise.all(payouts.map(async (p) => {
      // Get partner name
      const { data: partner } = await supabaseAdmin
        .from('partners')
        .select('name')
        .eq('unique_code', p.partner_id)
        .single()

      // Get customer email
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('email')
        .eq('id', p.customer_id)
        .single()

      return {
        ...p,
        partner_name: partner?.name,
        customer_email: customer?.email,
      }
    }))

    return NextResponse.json({
      success: true,
      count: payouts.length,
      payouts: formattedPayouts
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
