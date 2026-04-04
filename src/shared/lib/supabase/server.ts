import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { supabaseServerEnv } from '@/shared/lib/supabase/env';

let supabaseServerClient: SupabaseClient | null = null;

/**
 * Creates a singleton Supabase client for server-only workflows.
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (supabaseServerClient) {
    return supabaseServerClient;
  }

  supabaseServerClient = createClient(
    supabaseServerEnv.SUPABASE_URL,
    supabaseServerEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return supabaseServerClient;
}
