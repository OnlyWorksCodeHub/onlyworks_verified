// App version configuration and metadata
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
  version: '1.0.0',
  releaseDate: '2024-01-15',
  platforms: {
    mac: {
      arm64: {
        url: 'https://github.com/Namkha-yolo/onlyworks_desktop/releases/download/v1.0.0/OnlyWorks%20Desktop-1.0.0-arm64.dmg',
        size: '95MB',
      },
      intel: {
        url: '/downloads/OnlyWorks Desktop-1.0.0.dmg',
        size: '97MB',
      },
    },
    windows: {
      x64: {
        url: '/downloads/OnlyWorks Desktop Setup 1.0.0.exe',
        size: '74MB',
      },
    },
  },
  releaseNotes: [
    'Initial release of OnlyWorks Desktop',
    'Real-time productivity tracking',
    'AI-powered work analysis',
    'Verified report generation',
    'Privacy-focused design',
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
