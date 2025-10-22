import { NextRequest, NextResponse } from 'next/server'
import { getLatestVersion } from '@/lib/app-versions'
import { supabaseServer } from '@/lib/supabase-server'

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

    const latestVersion = getLatestVersion()

    // Get download URL based on platform and architecture
    let downloadUrl: string | null = null
    let fileSize: string | null = null

    if (platform === 'mac') {
      if (arch === 'arm64') {
        downloadUrl = latestVersion.platforms.mac.arm64.url
        fileSize = latestVersion.platforms.mac.arm64.size
      } else if (arch === 'intel') {
        downloadUrl = latestVersion.platforms.mac.intel.url
        fileSize = latestVersion.platforms.mac.intel.size
      }
    } else if (platform === 'windows') {
      if (arch === 'x64') {
        downloadUrl = latestVersion.platforms.windows.x64.url
        fileSize = latestVersion.platforms.windows.x64.size
      }
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Invalid platform or architecture' },
        { status: 400 }
      )
    }

    // Track download analytics
    try {
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const ipAddress = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'Unknown'

      await supabaseServer.from('app_downloads').insert({
        version: latestVersion.version,
        platform,
        architecture: arch,
        user_agent: userAgent,
        ip_address: ipAddress,
        download_date: new Date().toISOString(),
      })
    } catch (analyticsError) {
      // Don't fail the download if analytics fails
      console.error('Analytics tracking error:', analyticsError)
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      version: latestVersion.version,
      size: fileSize,
      releaseDate: latestVersion.releaseDate,
    })
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
    const { data: downloads, error } = await supabaseServer
      .from('app_downloads')
      .select('*')
      .order('download_date', { ascending: false })
      .limit(100)

    if (error) throw error

    // Aggregate stats
    const stats = {
      total: downloads?.length || 0,
      byPlatform: {
        mac: downloads?.filter(d => d.platform === 'mac').length || 0,
        windows: downloads?.filter(d => d.platform === 'windows').length || 0,
      },
      byArchitecture: {
        arm64: downloads?.filter(d => d.architecture === 'arm64').length || 0,
        intel: downloads?.filter(d => d.architecture === 'intel').length || 0,
        x64: downloads?.filter(d => d.architecture === 'x64').length || 0,
      },
      recent: downloads?.slice(0, 10) || [],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Download stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download stats' },
      { status: 500 }
    )
  }
}
