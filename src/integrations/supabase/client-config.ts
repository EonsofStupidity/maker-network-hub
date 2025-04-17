
/**
 * Supabase client configuration
 * Centralizes configuration settings for consistent behavior across the application
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configure Supabase client with simplified settings
export function configureSupabaseClient(
  supabaseUrl: string, 
  supabaseKey: string
): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: localStorage
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js/2.x',
      },
    }
  });
}
