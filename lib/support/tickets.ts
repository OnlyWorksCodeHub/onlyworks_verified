// Shared contract for the support-ticket feature — imported by the API routes,
// the user submission page (/support/tickets), and the admin triage dashboard
// (/admin/tickets). Keep this free of server-only imports so the client pages
// can use the same constants/types.

/** Private Supabase Storage bucket holding ticket attachments (screenshots / clips). */
export const SUPPORT_BUCKET = 'support-attachments'

export const TICKET_CATEGORIES = [
  { value: 'bug', label: 'Bug — something broke' },
  { value: 'install', label: 'Install / permissions' },
  { value: 'account', label: 'Account / billing' },
  { value: 'question', label: 'General question' },
  { value: 'other', label: 'Something else' },
] as const
export type TicketCategory = (typeof TICKET_CATEGORIES)[number]['value']
export const TICKET_CATEGORY_VALUES: string[] = TICKET_CATEGORIES.map((c) => c.value)
export function ticketCategoryLabel(value: string): string {
  return TICKET_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export const TICKET_STATUSES = ['open', 'in_progress', 'resolved'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
}

export const TICKET_PRIORITIES = ['low', 'normal', 'high'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

// Upload limits. Videos are allowed, so the per-file cap is generous; uploads go
// straight to Storage from the browser (signed URLs), bypassing the serverless
// request-body limit.
export const MAX_ATTACHMENTS = 5
export const MAX_ATTACHMENT_BYTES = 50 * 1024 * 1024 // 50 MB / file
export const MAX_TOTAL_BYTES = 150 * 1024 * 1024 // 150 MB total

// Concrete allowlist (NOT a `image/` prefix) so active formats like image/svg+xml
// — which can carry <script> and execute when opened from a signed URL — are
// rejected at every layer. Keep this in sync with the bucket's allowed_mime_types
// in supabase/migrations/20260629_support_tickets.sql.
export const ALLOWED_ATTACHMENT_TYPES = [
  'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v',
] as const

export const MAX_NAME_LEN = 120
export const MAX_SUBJECT_LEN = 140
export const MAX_MESSAGE_LEN = 4000

export function isAllowedAttachmentType(type: string): boolean {
  return (ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(type.toLowerCase())
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** A file the user uploaded, as stored on a ticket row (path is inside SUPPORT_BUCKET). */
export interface TicketAttachment {
  path: string
  name: string
  type: string
  size: number
}

/** Same, plus a short-lived signed view URL minted server-side for the admin UI. */
export interface TicketAttachmentSigned extends TicketAttachment {
  signedUrl: string | null
}

export interface SupportTicket {
  id: string
  created_at: string
  updated_at: string
  ref: string
  name: string | null
  email: string
  category: string
  subject: string
  message: string
  status: string
  priority: string
  attachments: TicketAttachment[]
  admin_notes: string | null
  user_id: string | null
  ow_id: string | null
  app_version: string | null
  user_agent: string | null
}

/** Shape returned by GET /api/admin/tickets (attachments carry signed URLs). */
export interface SupportTicketWithSignedUrls extends Omit<SupportTicket, 'attachments'> {
  attachments: TicketAttachmentSigned[]
}
