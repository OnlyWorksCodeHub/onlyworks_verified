import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const res = await fetch(`${BACKEND_URL}/api/talent-community/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Invalid or expired link' },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, data: data.data })
  } catch (err) {
    console.error('Talent community verify proxy error:', err)
    return NextResponse.json({ error: 'Failed to reach server' }, { status: 502 })
  }
}
