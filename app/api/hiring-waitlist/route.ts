import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    let body: {
      name?: string
      email?: string
      company?: string
      job_title?: string
      team_size?: string
    }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Trim first, then validate — never trust the client to have done it.
    const name = (body.name || '').trim()
    const email = (body.email || '').toLowerCase().trim()
    const company = body.company?.trim() || null
    const job_title = body.job_title?.trim() || null
    const team_size = body.team_size?.trim() || null

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('hiring_manager_waitlist')
      .insert({ name, email, company, job_title, team_size })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the hiring manager waitlist',
      data,
    })
  } catch (error) {
    console.error('Hiring waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    )
  }
}
