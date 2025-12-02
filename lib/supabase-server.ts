 import { createClient } from '@supabase/supabase-js'

  // Use anon key for server-side operations (mainly for shared_reports table access)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  // Warn if env vars are missing (won't fail build, will fail at runtime if used)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('WARNING: Supabase environment variables not set - using placeholders for build')
  }

  export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  /**
   * Database types for shared_reports table
   */
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
      lines_written?: number
      files_modified?: number
      originalSize?: number
      compressedSize?: number
      compressionRatio?: number
      uploadedAt?: string
      signed_url?: string
    } | null
  }
