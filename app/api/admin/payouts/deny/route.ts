import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { payout_id, reason } = await req.json()

    if (!payout_id || !reason) {
      return NextResponse.json(
        { error: 'payout_id and reason are required' },
        { status: 400 }
      )
    }

    // Update payout status to denied
    const { data, error } = await supabaseAdmin
      .from('partner_payouts')
      .update({
        status: 'denied',
        denial_reason: reason,
      })
      .eq('id', payout_id)
      .select()
      .single()

    if (error) {
      console.error('Error denying payout:', error)
      return NextResponse.json(
        { error: 'Failed to deny payout' },
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
