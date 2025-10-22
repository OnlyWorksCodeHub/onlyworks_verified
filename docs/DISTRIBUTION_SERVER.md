# OnlyWorks Distribution Server

The OnlyWorks Distribution Server is a Vercel-hosted API that manages desktop application downloads, version management, and update checking.

## Architecture

The distribution system consists of:

1. **Version Management** (`lib/app-versions.ts`)
2. **API Endpoints** (`app/api/desktop/*`)
3. **Download Tracking** (Supabase database)
4. **Client Integration** (Downloads page)

## API Endpoints

### 1. Get Version Information
```
GET /api/desktop/version
```

**Response:**
```json
{
  "version": "1.0.0",
  "releaseDate": "2024-01-15",
  "platforms": {
    "mac": {
      "arm64": { "url": "...", "size": "97MB" },
      "intel": { "url": "...", "size": "97MB" }
    },
    "windows": {
      "x64": { "url": "...", "size": "74MB" }
    }
  },
  "releaseNotes": [...],
  "minOS": {
    "mac": "10.15",
    "windows": "10"
  }
}
```

### 2. Check for Updates
```
GET /api/desktop/check-update?version=1.0.0&platform=mac&arch=arm64
```

**Response (Update Available):**
```json
{
  "updateAvailable": true,
  "currentVersion": "1.0.0",
  "latestVersion": "1.1.0",
  "releaseDate": "2024-02-01",
  "releaseNotes": [...],
  "downloadUrl": "/downloads/...",
  "message": "Update available: 1.1.0"
}
```

**Response (No Update):**
```json
{
  "updateAvailable": false,
  "currentVersion": "1.0.0",
  "latestVersion": "1.0.0",
  "message": "You are running the latest version"
}
```

### 3. Download Application
```
POST /api/desktop/download
Content-Type: application/json

{
  "platform": "mac",
  "arch": "arm64"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "/downloads/OnlyWorks Desktop-1.0.0-arm64.dmg",
  "version": "1.0.0",
  "size": "97MB",
  "releaseDate": "2024-01-15"
}
```

**Features:**
- Tracks download analytics (platform, architecture, IP, user agent)
- Returns proper download URL
- Logs to Supabase database

### 4. Get Download Statistics (Admin)
```
GET /api/desktop/download
```

**Response:**
```json
{
  "total": 1523,
  "byPlatform": {
    "mac": 892,
    "windows": 631
  },
  "byArchitecture": {
    "arm64": 623,
    "intel": 269,
    "x64": 631
  },
  "recent": [...]
}
```

## Database Schema

### `app_downloads` Table

```sql
CREATE TABLE app_downloads (
  id UUID PRIMARY KEY,
  version TEXT NOT NULL,
  platform TEXT NOT NULL,
  architecture TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  download_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
```

## Version Management

### Adding a New Version

1. Update `lib/app-versions.ts`:

```typescript
export const CURRENT_VERSION: AppVersion = {
  version: '1.1.0', // Increment version
  releaseDate: '2024-02-01',
  platforms: {
    mac: {
      arm64: {
        url: '/downloads/OnlyWorks Desktop-1.1.0-arm64.dmg',
        size: '98MB',
      },
      // ... other platforms
    }
  },
  releaseNotes: [
    'New feature: Real-time collaboration',
    'Bug fix: Fixed memory leak in tracker',
    'Improvement: 30% faster report generation',
  ],
  minOS: {
    mac: '10.15',
    windows: '10',
  }
}
```

2. Upload new app binaries to `/public/downloads/`

3. Deploy to Vercel

4. Desktop apps will automatically detect the update

## Client Integration

### Desktop App Update Checking

```typescript
// In your Electron app
async function checkForUpdates() {
  const currentVersion = app.getVersion()
  const platform = process.platform === 'darwin' ? 'mac' : 'windows'
  const arch = process.arch === 'arm64' ? 'arm64' : 'x64'

  const response = await fetch(
    `https://only-works.com/api/desktop/check-update?version=${currentVersion}&platform=${platform}&arch=${arch}`
  )

  const data = await response.json()

  if (data.updateAvailable) {
    // Show update notification
    showUpdateDialog({
      currentVersion: data.currentVersion,
      latestVersion: data.latestVersion,
      releaseNotes: data.releaseNotes,
      downloadUrl: data.downloadUrl,
    })
  }
}
```

### Web Download Integration

The downloads page (`app/downloads/page.tsx`) automatically:
- Fetches latest version info
- Tracks downloads via API
- Shows download progress
- Handles errors gracefully

## Analytics & Tracking

All downloads are tracked with:
- Version downloaded
- Platform (mac/windows)
- Architecture (arm64/intel/x64)
- User agent
- IP address
- Download timestamp

Access analytics at `/api/desktop/download` (admin access required).

## Security Considerations

1. **Access Control**: Downloads page requires access code
2. **Rate Limiting**: Consider implementing rate limiting for download API
3. **File Integrity**: Add checksums to app-versions.ts for verification
4. **RLS Policies**: Supabase Row Level Security enabled

## Deployment

The distribution server is deployed on Vercel alongside the main Next.js application. All API routes are serverless functions.

**Deploy Command:**
```bash
git push origin main
# Vercel auto-deploys
```

## File Structure

```
├── app/
│   ├── api/
│   │   └── desktop/
│   │       ├── version/route.ts        # Version info
│   │       ├── download/route.ts       # Download tracking
│   │       └── check-update/route.ts   # Update checking
│   └── downloads/page.tsx              # Download UI
├── lib/
│   └── app-versions.ts                 # Version configuration
├── public/
│   └── downloads/                      # App binaries
└── supabase/
    └── migrations/
        └── create_app_downloads_table.sql
```

## Future Enhancements

- [ ] Add auto-update functionality to desktop app
- [ ] Implement delta updates for smaller download sizes
- [ ] Add release channels (stable, beta, alpha)
- [ ] Implement download CDN for faster global delivery
- [ ] Add code signing verification
- [ ] Implement rollback mechanism
- [ ] Add A/B testing for updates
