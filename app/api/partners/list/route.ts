import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { APP_URL } from '@/lib/config'

export async function GET() {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const { data: partners, error } = await supabaseAdmin
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching partners:', error)
      return NextResponse.json(
        { error: 'Failed to fetch partners' },
        { status: 500 }
      )
    }

    // Generate links for each partner
    const baseUrl = APP_URL
    const partnersWithLinks = partners.map(p => ({
      ...p,
      link: `${baseUrl}/verify-skills?src=${p.unique_code}`
    }))

    return NextResponse.json({
      success: true,
      count: partners.length,
      partners: partnersWithLinks
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
