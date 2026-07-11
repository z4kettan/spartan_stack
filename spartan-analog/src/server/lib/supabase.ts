import { createClient } from '@supabase/supabase-js';

/** Service-role client for server-side operations (bypasses RLS). */
export function createServerSupabaseClient() {
  return createClient(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!
  );
}

/** Anon client for server-side operations that respect RLS. */
export function createAnonSupabaseClient() {
  return createClient(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_ANON_KEY']!
  );
}
