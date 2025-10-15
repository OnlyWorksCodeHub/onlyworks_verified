import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(`Missing environment variables`)
  }

  export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  export interface SharedReport {
    id: string
    user_id: string
    token: string
    storage_path: string
    title: string | null
    recipient_email: string | null
    recipient_name: string | null
    created_at: string
    expires_at: string | null
    is_revoked: boolean
    view_count: number
    last_viewed_at: string | null
    metadata: {
      date?: string
      developer?: string
      duration?: string
      originalSize?: number
      compressedSize?: number
      compressionRatio?: number
      uploadedAt?: string
      signed_url?: string
    } | null
  }
