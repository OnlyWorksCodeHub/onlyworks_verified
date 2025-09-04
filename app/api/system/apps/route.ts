import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // This is a simplified version - in production you'd use system APIs
    // For browser-based apps, we can only detect some information
    
    const detectedApps = [
      'Chrome',
      'Visual Studio Code',
      'Slack',
      'Spotify',
      'Terminal',
      'Finder',
      'OnlyWorks'
    ]
    
    // You could enhance this by:
    // 1. Using node-active-win package (requires server-side)
    // 2. Using system commands via exec
    // 3. Browser APIs for tab detection
    
    return NextResponse.json({ 
      apps: detectedApps,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      apps: [],
      error: 'Could not detect apps' 
    }, { status: 200 })
  }
}
