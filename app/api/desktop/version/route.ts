import { NextRequest, NextResponse } from 'next/server'
import { getLatestVersion, isUpdateAvailable } from '@/lib/app-versions'

export const dynamic = 'force-dynamic'

// GET /api/desktop/version - Get latest version info
export async function GET(request: NextRequest) {
  try {
    const latestVersion = getLatestVersion()

    // Check if client is checking for updates
    const currentVersion = request.nextUrl.searchParams.get('current')
    const platform = request.nextUrl.searchParams.get('platform')

    if (currentVersion) {
      const updateAvailable = isUpdateAvailable(currentVersion, latestVersion.version)

      return NextResponse.json({
        current: currentVersion,
        latest: latestVersion.version,
        updateAvailable,
        ...(updateAvailable && {
          download: platform
            ? latestVersion.platforms[platform as keyof typeof latestVersion.platforms]
            : null,
          releaseNotes: latestVersion.releaseNotes,
        }),
      })
    }

    // Return full version info
    return NextResponse.json({
      version: latestVersion.version,
      releaseDate: latestVersion.releaseDate,
      platforms: latestVersion.platforms,
      releaseNotes: latestVersion.releaseNotes,
      minOS: latestVersion.minOS,
    })
  } catch (error) {
    console.error('Version API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version information' },
      { status: 500 }
    )
  }
}
