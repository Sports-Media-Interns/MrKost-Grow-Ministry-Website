import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Server-side Supabase client using the service role key.
 * Only use this in API routes / server components -- never expose to the browser.
 * Uses lazy singleton pattern to avoid creating a new client on every call.
 */
let _client: SupabaseClient<Database> | null = null;
let _checkedEnv = false;

export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (_checkedEnv && !_client) return null;

  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    _checkedEnv = true;

    if (!url || !key) {
      return null;
    }

    _client = createClient<Database>(url, key, {
      auth: { persistSession: false },
    });
  }

  return _client;
}

/** Reset the cached client (for testing only). */
export function _resetSupabaseClient(): void {
  _client = null;
  _checkedEnv = false;
}
