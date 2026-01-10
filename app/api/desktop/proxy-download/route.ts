import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://onlyworks-backend-server.onrender.com'

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

    // Forward to backend server
    const params = new URLSearchParams()
    params.set('url', url)
    if (filename) params.set('filename', filename)

    const backendUrl = `${BACKEND_URL}/api/desktop/proxy-download?${params.toString()}`

    const response = await fetch(backendUrl, {
      headers: {
        'User-Agent': 'OnlyWorks-Desktop-Downloader/1.0.0',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      let errorMessage = 'Failed to download file'
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // Get the content type and filename from the response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition')

    // Create headers for download
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    })

    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition)
    } else {
      const downloadFilename = filename || url.split('/').pop() || 'download'
      headers.set('Content-Disposition', `attachment; filename="${downloadFilename}"`)
    }

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
