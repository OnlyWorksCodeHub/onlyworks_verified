import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

export const dynamic = 'force-dynamic'

// POST /api/desktop/download - Track download and return file URL
export async function POST(request: NextRequest) {
  try {
    const { platform, arch } = await request.json()

    if (!platform || !arch) {
      return NextResponse.json(
        { error: 'Platform and architecture are required' },
        { status: 400 }
      )
    }

    // Forward to backend server
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'Unknown'

    const response = await fetch(`${BACKEND_URL}/api/desktop/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Agent': userAgent,
        'X-Forwarded-For': ipAddress,
      },
      body: JSON.stringify({ platform, arch }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      let errorMessage = 'Failed to process download request'
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
      return NextResponse.json(
        { error: errorMessage, available: errorData.available },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}

// GET /api/desktop/download - Get download stats (admin only)
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/desktop/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch download stats' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Download stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download stats' },
      { status: 500 }
    )
  }
}
