import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
  })
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: unknown = null

    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => 'Failed to parse JSON')
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData().catch(() => null)
      if (formData) {
        body = Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [
            key,
            value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value
          ])
        )
      } else {
        body = 'Failed to parse FormData'
      }
    } else {
      body = await request.text().catch(() => 'Failed to read body')
    }

    return NextResponse.json({
      message: 'Debug POST received',
      timestamp: new Date().toISOString(),
      contentType,
      body,
      headers: Object.fromEntries(request.headers.entries()),
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Debug POST error',
      error: String(error),
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
