import { NextRequest, NextResponse } from 'next/server'
import { getLatestVersion, isUpdateAvailable } from '@/lib/app-versions'

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

    const latestVersion = getLatestVersion()
    const updateAvailable = isUpdateAvailable(currentVersion, latestVersion.version)

    if (!updateAvailable) {
      return NextResponse.json({
        updateAvailable: false,
        currentVersion,
        latestVersion: latestVersion.version,
        message: 'You are running the latest version',
      })
    }

    // Get download URL for the platform
    let downloadUrl: string | null = null

    if (platform && arch) {
      if (platform === 'mac') {
        if (arch === 'arm64') {
          downloadUrl = latestVersion.platforms.mac.arm64.url
        } else if (arch === 'intel') {
          downloadUrl = latestVersion.platforms.mac.intel.url
        }
      } else if (platform === 'windows' && arch === 'x64') {
        downloadUrl = latestVersion.platforms.windows.x64.url
      }
    }

    return NextResponse.json({
      updateAvailable: true,
      currentVersion,
      latestVersion: latestVersion.version,
      releaseDate: latestVersion.releaseDate,
      releaseNotes: latestVersion.releaseNotes,
      downloadUrl,
      message: `Update available: ${latestVersion.version}`,
    })
  } catch (error) {
    console.error('Update check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 }
    )
  }
}
