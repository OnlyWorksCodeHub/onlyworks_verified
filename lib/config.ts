// Admin email addresses with access to admin routes
export const ADMIN_EMAILS = [
  'team@only-works.com',
]

export const BACKEND_URL = process.env.BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'

// Public website URL (used for share links, Stripe redirects, metadata, etc.)
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'
