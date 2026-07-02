// Admin email addresses with access to admin routes
export const ADMIN_EMAILS = [
  'team@only-works.com',
]

export const BACKEND_URL = process.env.BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://onlyworks-backend-server.onrender.com'

// Public website URL (used for share links, Stripe redirects, metadata, etc.)
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'

// Pro plan deferred to a later step. Flip to true (or set NEXT_PUBLIC_PRO_ENABLED=true)
// to re-enable the subscription/billing UI. The Stripe API routes + webhook are
// intentionally left intact so existing subscribers and the desktop app keep working.
export const PRO_ENABLED = process.env.NEXT_PUBLIC_PRO_ENABLED === 'true'

// Paid hiring toolkit (job posts, auto-match, hiring-manager company profile)
// is deferred. Until it ships, the free journey is search + view + waitlist only,
// and /hiring/profile shows a "coming soon" state instead of an orphaned form
// whose backend record no flow ever creates. Flip to true (or set
// NEXT_PUBLIC_HIRING_TOOLKIT_ENABLED=true) to re-enable it.
export const HIRING_TOOLKIT_ENABLED = process.env.NEXT_PUBLIC_HIRING_TOOLKIT_ENABLED === 'true'
