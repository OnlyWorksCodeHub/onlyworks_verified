// App version configuration and metadata - v2.0.5
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

export const CURRENT_VERSION: AppVersion = {
  version: '2.8.0',
  releaseDate: '2026-02-18',
  platforms: {
    mac: {
      arm64: {
        url: 'https://github.com/Namkha-yolo/ONLYWORKS_DIST/releases/download/v2.8.0/OnlyWorks.Desktop-2.8.0-arm64.dmg',
        size: '113MB',
      },
      intel: {
        url: 'https://github.com/Namkha-yolo/ONLYWORKS_DIST/releases/download/v2.8.0/OnlyWorks.Desktop-2.8.0.dmg',
        size: '119MB',
      },
    },
    windows: {
      x64: {
        url: 'https://github.com/Namkha-yolo/ONLYWORKS_DIST/releases/download/v2.8.0/OnlyWorks.Desktop.Setup.2.8.0.exe',
        size: '85MB',
      },
    },
  },
  releaseNotes: [
    'Windows support — NSIS installer and portable .exe',
    'Real-time contextual assistant with floating overlay',
    'RAG-powered blocker detection and suggestions',
    'System-wide draggable assistant widget',
    'Fix permission prompts and UI improvements',
    'Auto-update improvements',
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

