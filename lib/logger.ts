// Simple logger that works on both client and server
export const log = {
  info: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta || '')
    } else if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, meta)
    }
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString()
    if (typeof window === 'undefined') {
      console.error(`[ERROR] ${timestamp} ${message}`, error || '')
    } else {
      console.error(`[ERROR] ${message}`, error)
    }
  },
  warn: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta || '')
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, meta)
    }
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString()
      if (typeof window === 'undefined') {
        console.log(`[DEBUG] ${timestamp} ${message}`, meta || '')
      } else {
        console.log(`[DEBUG] ${message}`, meta)
      }
    }
  },
}
