import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminClient: SupabaseClient | null = null

// Admin client with service role for webhook operations
// This bypasses RLS - use only on server side!
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdminClient
}

// For backwards compatibility
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table)
}
