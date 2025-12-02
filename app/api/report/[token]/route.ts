import { NextRequest, NextResponse } from 'next/server'
  import pako from 'pako'

  export const runtime = 'nodejs'
  export const dynamic = 'force-dynamic'

  export async function GET(
    request: NextRequest,
    { params }: { params: { token: string } }
  ) {
    const { token } = params

    try {
      console.log(`[Report API] Fetching report via backend for token: ${token}`)

      // Step 1: Get signed URL from backend (which has service role key)
      const backendUrl = `https://onlyworks-backend-server.onrender.com/api/batch/shared/${token}`

      console.log(`[Report API] Calling backend: ${backendUrl}`)
      const backendResponse = await fetch(backendUrl)

      if (!backendResponse.ok) {
        if (backendResponse.status === 404) {
          console.log('[Report API] Report not found on backend')
          return NextResponse.json(
            { error: 'Report not found' },
            { status: 404 }
          )
        }
        console.error('[Report API] Backend error:', backendResponse.status, backendResponse.statusText)
        return NextResponse.json(
          { error: 'Failed to fetch report from backend' },
          { status: 500 }
        )
      }

      const backendData = await backendResponse.json()

      if (!backendData.success || !backendData.data?.htmlUrl) {
        console.error('[Report API] Invalid backend response:', backendData)
        return NextResponse.json(
          { error: 'Invalid report data from backend' },
          { status: 500 }
        )
      }

      // Step 2: Fetch HTML from signed URL
      const { htmlUrl } = backendData.data
      console.log(`[Report API] Fetching HTML from signed URL`)

      const htmlResponse = await fetch(htmlUrl)

      if (!htmlResponse.ok) {
        console.error('[Report API] Failed to fetch HTML from signed URL:', htmlResponse.status)
        return NextResponse.json(
          { error: 'Failed to fetch report HTML' },
          { status: 500 }
        )
      }

      // Step 3: Decompress HTML content (files are stored as .html.gz)
      const htmlBuffer = await htmlResponse.arrayBuffer()
      const compressed = new Uint8Array(htmlBuffer)

      let html: string
      try {
        html = pako.ungzip(compressed, { to: 'string' })
        console.log('[Report API] Successfully decompressed report HTML')
      } catch (decompressError) {
        console.log('[Report API] File not compressed, using as-is')
        html = new TextDecoder().decode(compressed)
      }

      console.log('[Report API] Successfully fetched report HTML via backend')

      // Step 4: Return HTML
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'X-Report-Token': token,
          'X-Backend-Proxy': 'true',
        },
      })

    } catch (error) {
      console.error('[Report API] Unexpected error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
