import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { APP_URL } from '@/lib/config'

export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const { name, contact_email } = await req.json()

    // Validate input
    if (!name || !contact_email) {
      return NextResponse.json(
        { error: 'Name and contact_email are required' },
        { status: 400 }
      )
    }

    // Generate unique code from name
    let uniqueCode = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50)

    // Check if code exists, add suffix if needed
    let suffix = 1
    let finalCode = uniqueCode

    while (true) {
      const { data: existing } = await supabaseAdmin
        .from('partners')
        .select('id')
        .eq('unique_code', finalCode)
        .single()

      if (!existing) break // Code is unique

      finalCode = `${uniqueCode}_${suffix}`
      suffix++
    }

    // Create partner
    const { data: partner, error } = await supabaseAdmin
      .from('partners')
      .insert({
        name,
        contact_email,
        unique_code: finalCode,
        status: 'active' // Auto-approve for now
      })
      .select()
      .single()

    if (error) {
      console.error('Partner creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create partner' },
        { status: 500 }
      )
    }

    // Generate full URL
    const baseUrl = APP_URL
    const partnerLink = `${baseUrl}/verify-skills?src=${finalCode}`

    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        unique_code: partner.unique_code,
        link: partnerLink,
        status: partner.status
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
