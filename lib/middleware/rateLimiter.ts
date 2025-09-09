import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  key: string
  points: number
  duration: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for development (use Redis in production)
const store: RateLimitStore = {}

export async function rateLimit(
  request: NextRequest, 
  config: RateLimitConfig
): Promise<NextResponse | null> {
  try {
    const clientIP = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown'
    
    const key = `${config.key}:${clientIP}`
    const now = Date.now()
    const windowMs = config.duration * 1000
    
    const record = store[key]
    
    if (!record || now > record.resetTime) {
      // Reset or create new window
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      }
      return null
    }
    
    if (record.count >= config.points) {
      // Rate limit exceeded
      const resetInSeconds = Math.ceil((record.resetTime - now) / 1000)
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: resetInSeconds
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetInSeconds.toString(),
            'X-RateLimit-Limit': config.points.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      )
    }
    
    // Increment counter
    record.count += 1
    
    return null
  } catch (error) {
    // Don't fail request if rate limiting fails
    console.error('Rate limiting error:', error)
    return null
  }
}

// Cleanup old entries periodically (call this in a cron job in production)
export function cleanupRateLimitStore() {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key]
    }
  })
}