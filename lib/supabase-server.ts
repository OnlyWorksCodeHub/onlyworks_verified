/**
   * Server-side Supabase client with service role key
   * Used for privileged operations (bypasses RLS)
   */

  import { createClient } from '@supabase/supabase-js'

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing required environment variables: 
  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  /**
   * Create a Supabase client with service role privileges
   * This bypasses Row Level Security (RLS) policies
   * 
   * WARNING: Only use this on the server side!
   * Never expose the service role key to the client.
   */
  export const supabaseServer = createClient(supabaseUrl,
  supabaseServiceRoleKey, {
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
      originalSize?: number
      compressedSize?: number
      compressionRatio?: number
      uploadedAt?: string
      signed_url?: string
    } | null
  }
