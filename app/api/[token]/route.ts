/**
   * API Route: Fetch and serve report content
   * GET /api/report/[token]
   * 
   * Security: Uses service role to access storage (bypasses
   RLS)
   * Validates token from database before serving content
   */

  import { NextRequest, NextResponse } from 'next/server'
  import { supabaseServer, type SharedReport } from
  '@/lib/supabase-server'
  import pako from 'pako'

  export const runtime = 'nodejs'
  export const dynamic = 'force-dynamic'

  export async function GET(
    request: NextRequest,
    { params }: { params: { token: string } }
  ) {
    const { token } = params

    try {
      console.log(`[Report API] Fetching report for token: 
  ${token}`)

      // Step 1: Validate token from database
      const { data: report, error: dbError } = await
  supabaseServer
        .from('shared_reports')
        .select('*')
        .eq('token', token)
        .single<SharedReport>()

      if (dbError || !report) {
        console.error('[Report API] Report not found:',
  dbError)
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        )
      }

      // Step 2: Check if expired
      if (report.expires_at && new Date(report.expires_at) <
   new Date()) {
        console.log('[Report API] Report expired:',
  report.expires_at)
        return NextResponse.json(
          {
            error: 'expired',
            message: 'This report link has expired',
            expiresAt: report.expires_at
          },
          { status: 410 }
        )
      }

      // Step 3: Check if revoked
      if (report.is_revoked) {
        console.log('[Report API] Report revoked')
        return NextResponse.json(
          {
            error: 'revoked',
            message: 'This report link has been revoked by 
  the owner'
          },
          { status: 403 }
        )
      }

      // Step 4: Fetch report from storage
      console.log(`[Report API] Fetching from storage: 
  ${report.storage_path}`)

      const { data: fileData, error: storageError } = await
  supabaseServer.storage
        .from('reports')
        .download(report.storage_path)

      if (storageError || !fileData) {
        console.error('[Report API] Storage error:',
  storageError)
        return NextResponse.json(
          { error: 'Failed to fetch report from storage' },
          { status: 500 }
        )
      }

      // Step 5: Decompress HTML
      const arrayBuffer = await fileData.arrayBuffer()
      const compressed = new Uint8Array(arrayBuffer)

      let html: string
      try {
        // Try to decompress (if it's gzipped)
        html = pako.ungzip(compressed, { to: 'string' })
        console.log('[Report API] Decompressed 
  successfully')
      } catch (decompressError) {
        // If decompression fails, treat as uncompressed
        console.log('[Report API] Not compressed, using 
  as-is')
        html = new TextDecoder().decode(compressed)
      }

      // Step 6: Increment view counter (async, don't wait)
      supabaseServer
        .from('shared_reports')
        .update({
          view_count: (report.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString(),
        })
        .eq('id', report.id)
        .then(() => console.log('[Report API] View counter 
  incremented'))
        .catch((error) => console.error('[Report API] Failed
   to increment view counter:', error))

      // Step 7: Return HTML
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'private, no-cache, no-store, 
  must-revalidate',
          'X-Report-ID': report.id,
          'X-View-Count': String(report.view_count + 1),
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
