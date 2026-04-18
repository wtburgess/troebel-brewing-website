import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the service role key.
 * Only use in API routes / server actions — never expose to the browser.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Server-side Supabase client using the anon key (read-only public access).
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
