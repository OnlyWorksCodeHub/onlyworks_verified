import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://onlyworks-backend-server.onrender.com'

export const dynamic = 'force-dynamic'

// GET /api/desktop/check-update?version=1.0.0&platform=mac&arch=arm64
export async function GET(request: NextRequest) {
  try {
    const currentVersion = request.nextUrl.searchParams.get('version')
    const platform = request.nextUrl.searchParams.get('platform')
    const arch = request.nextUrl.searchParams.get('arch')

    if (!currentVersion) {
      return NextResponse.json(
        { error: 'Current version is required' },
        { status: 400 }
      )
    }

    // Build query string
    const params = new URLSearchParams()
    params.set('version', currentVersion)
    if (platform) params.set('platform', platform)
    if (arch) params.set('arch', arch)

    const url = `${BACKEND_URL}/api/desktop/check-update?${params.toString()}`

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
        { error: 'Failed to check for updates' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Update check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 }
    )
  }
}
