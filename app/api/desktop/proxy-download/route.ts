import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/desktop/proxy-download - Proxy downloads from external sources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const filename = searchParams.get('filename')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate that it's a GitHub release URL for security
    if (!url.includes('github.com') || !url.includes('/releases/download/')) {
      return NextResponse.json(
        { error: 'Only GitHub release URLs are allowed' },
        { status: 400 }
      )
    }

    // Fetch the file from GitHub
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OnlyWorks-Desktop-Downloader/1.0.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`)
    }

    // Get the content type and filename from the response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')

    // Extract filename from URL if not provided
    const downloadFilename = filename || url.split('/').pop() || 'download'

    // Create headers for download
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${downloadFilename}"`,
      'Cache-Control': 'no-cache',
    })

    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    // Stream the response
    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Proxy download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}