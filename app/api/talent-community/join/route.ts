import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, target_roles, target_locations, self_reported_skills } = body

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
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

    const res = await fetch(`${BACKEND_URL}/api/talent-community/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        full_name: String(full_name).trim(),
        target_roles: Array.isArray(target_roles) ? target_roles : [],
        target_locations: Array.isArray(target_locations) ? target_locations : [],
        self_reported_skills: Array.isArray(self_reported_skills) ? self_reported_skills : [],
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to join Talent Community' },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, message: data.message || 'Check your inbox' })
  } catch (err) {
    console.error('Talent community join proxy error:', err)
    return NextResponse.json(
      { error: 'Failed to reach server' },
      { status: 502 }
    )
  }
}
