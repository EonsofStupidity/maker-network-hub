
/**
 * Supabase client configuration
 * Centralizes configuration settings for consistent behavior across the application
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define retry settings
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 500; // ms

// Configure Supabase client with retries
export function configureSupabaseClient(
  supabaseUrl: string, 
  supabaseKey: string
): SupabaseClient {
  // Enhanced client with retry capability
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: localStorage
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      // Add request hooks for retries on network errors
      fetch: async (input, init) => {
        let attempts = 0;
        
        while (attempts < RETRY_ATTEMPTS) {
          try {
            return await fetch(input, init);
          } catch (error) {
            attempts++;
            console.warn(`Supabase request failed (attempt ${attempts}/${RETRY_ATTEMPTS}):`, error);
            
            if (attempts >= RETRY_ATTEMPTS) {
              throw error;
            }
            
            // Exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, attempts - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        // This should never be reached due to the throw in the loop,
        // but TypeScript needs a return here
        throw new Error('Max retry attempts reached');
      }
    }
  });
  
  return client;
}
