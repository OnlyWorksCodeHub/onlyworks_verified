import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

export const dynamic = 'force-dynamic'

// GET /api/desktop/version - Get latest version info
export async function GET(request: NextRequest) {
  try {
    const currentVersion = request.nextUrl.searchParams.get('current')
    const platform = request.nextUrl.searchParams.get('platform')

    // Build query string
    const params = new URLSearchParams()
    if (currentVersion) params.set('current', currentVersion)
    if (platform) params.set('platform', platform)

    const queryString = params.toString()
    const url = `${BACKEND_URL}/api/desktop/version${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch version information' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Version API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version information' },
      { status: 500 }
    )
  }
}
