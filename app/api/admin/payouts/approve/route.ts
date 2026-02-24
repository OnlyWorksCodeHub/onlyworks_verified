import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const { payout_id } = await req.json()

    if (!payout_id) {
      return NextResponse.json(
        { error: 'payout_id is required' },
        { status: 400 }
      )
    }

    // Update payout status to approved
    const { data, error } = await supabaseAdmin
      .from('partner_payouts')
      .update({
        status: 'approved',
        approval_date: new Date().toISOString(),
      })
      .eq('id', payout_id)
      .select()
      .single()

    if (error) {
      console.error('Error approving payout:', error)
      return NextResponse.json(
        { error: 'Failed to approve payout' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      payout: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
