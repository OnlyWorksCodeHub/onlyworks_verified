// App version configuration — dynamically resolved from GitHub releases
export interface AppVersion {
  version: string
  releaseDate: string
  platforms: {
    mac: {
      arm64: {
        url: string
        size: string
        checksum?: string
      }
      intel: {
        url: string
        size: string
        checksum?: string
      }
    }
    windows: {
      x64: {
        url: string
        size: string
        checksum?: string
      }
    }
  }
  releaseNotes: string[]
  minOS: {
    mac: string
    windows: string
  }
}

const GITHUB_OWNER = 'Namkha-yolo'
const GITHUB_REPO = 'ONLYWORKS_DIST'
const CURRENT_VERSION_NUMBER = '3.11.0'
const GITHUB_RELEASE_BASE = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest/download`

// Fallback when GitHub API is unreachable
export const CURRENT_VERSION: AppVersion = {
  version: CURRENT_VERSION_NUMBER,
  releaseDate: '2026-04-27',
  platforms: {
    mac: {
      arm64: {
        url: `${GITHUB_RELEASE_BASE}/OnlyWorks.Desktop-${CURRENT_VERSION_NUMBER}-arm64.dmg`,
        size: '110MB',
      },
      intel: {
        url: `${GITHUB_RELEASE_BASE}/OnlyWorks.Desktop-${CURRENT_VERSION_NUMBER}-x64.dmg`,
        size: '117MB',
      },
    },
    windows: {
      x64: {
        url: `${GITHUB_RELEASE_BASE}/OnlyWorks.Desktop.Setup.${CURRENT_VERSION_NUMBER}.exe`,
        size: '87MB',
      },
    },
  },
  releaseNotes: [
    'New session recovery — interrupted sessions (crash, force-quit, low battery) now auto-finalize and generate their report on next launch, or in the background if you never relaunch',
    'Closing the window on macOS or refreshing the app no longer resets the active session button',
    'OW Profile verified skills redesigned — each skill now expands to show evidence from your actual work',
    'Fixed: macOS window controls no longer overlap the SESSION indicator in the sidebar',
    'Removed the non-functional Language dropdown from Settings (proper localization is planned for a future release)',
  ],
  minOS: {
    mac: '10.15',
    windows: '10',
  },
}

// Version history for update checks
export const VERSION_HISTORY: AppVersion[] = [CURRENT_VERSION]

export function getLatestVersion(): AppVersion {
  return CURRENT_VERSION
}

export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0
    const part2 = parts2[i] || 0

    if (part1 > part2) return 1
    if (part1 < part2) return -1
  }

  return 0
}

export function isUpdateAvailable(currentVersion: string, latestVersion: string): boolean {
  return compareVersions(latestVersion, currentVersion) > 0
}
