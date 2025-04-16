
/**
 * Supabase client configuration
 * Centralizes configuration settings for consistent behavior across the application
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

// Define retry settings
const RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 500; // ms
const TIMEOUT = 15000; // 15 seconds

// Circuit breaker for Supabase API calls
const apiCircuitBreaker = new CircuitBreaker('supabase-api', {
  maxFailures: 5,
  resetTimeout: 30000, // 30 seconds
});

// Configure Supabase client with retries
export function configureSupabaseClient(
  supabaseUrl: string, 
  supabaseKey: string
): SupabaseClient {
  // Enhanced client with retry capability and circuit breaker
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
        // Apply timeout to all requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        try {
          // Use circuit breaker pattern to prevent cascading failures
          return await apiCircuitBreaker.execute(async () => {
            let attempts = 0;
            
            while (attempts < RETRY_ATTEMPTS) {
              try {
                // Add abort controller to the request
                const requestInit = {
                  ...init,
                  signal: controller.signal
                };

                return await fetch(input, requestInit);
              } catch (error) {
                attempts++;
                
                // Don't retry if we hit a timeout or user abort
                if (error instanceof DOMException && error.name === 'AbortError') {
                  throw new Error('Request timed out or aborted');
                }
                
                console.warn(`Supabase request failed (attempt ${attempts}/${RETRY_ATTEMPTS}):`, error);
                
                if (attempts >= RETRY_ATTEMPTS) {
                  throw error;
                }
                
                // Exponential backoff with jitter
                const baseDelay = RETRY_DELAY * Math.pow(2, attempts - 1);
                const jitter = Math.random() * 100;
                await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
              }
            }
            
            // This should never be reached due to the throw in the loop,
            // but TypeScript needs a return here
            throw new Error('Max retry attempts reached');
          }, 
          // Fallback function if circuit breaker is open
          () => {
            throw new Error('Supabase API circuit breaker open - too many failures');
          });
        } finally {
          clearTimeout(timeoutId);
        }
      }
    }
  });
  
  return client;
}
