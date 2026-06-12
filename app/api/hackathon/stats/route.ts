import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { count, error } = await getSupabaseAdmin()
      .from('hackathon_registrations')
      .select('*', { count: 'exact', head: true })
    if (error) throw error
    return NextResponse.json(
      { registered: count ?? 0 },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    )
  } catch (error) {
    console.error('Hackathon stats error:', error)
    return NextResponse.json({ registered: null }, { status: 503 })
  }
}
