
/**
 * Supabase client wrapper
 * Singleton implementation with better logging and initialization
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define base types for responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// Singleton state
let supabaseInstance: SupabaseClient | null = null;
let isMockClient = false;
let isInitialized = false;

// Exported flag to check if using mock
export const isUsingMockClient = (): boolean => isMockClient;

// Create an offline-friendly mock client for development
const createMockClient = () => {
  console.warn('Creating mock Supabase client - limited functionality available');
  
  isMockClient = true;
  
  // Return a properly typed mock client that satisfies the SupabaseClient interface
  return createClient('https://example.com', 'mock-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

/**
 * Initialize the Supabase client
 * This should be called early in the application bootstrap process
 */
export const initializeSupabase = (): boolean => {
  if (isInitialized) {
    console.info('Supabase client already initialized');
    return true;
  }
  
  try {
    // Hard-coded fallback values for development/testing
    const FALLBACK_SUPABASE_URL = "https://kxeffcclfvecdvqpljbh.supabase.co";
    const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4";

    // Determine if we should use mock or real Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;
    
    console.info('Initializing Supabase client', { url: supabaseUrl });
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'supabase.auth.token',
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js/2.x',
          },
        }
      });
      
      isInitialized = true;
      isMockClient = false;
      console.info('Supabase client initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Error creating Supabase client, falling back to mock', error);
      
      supabaseInstance = createMockClient();
      isInitialized = true;
      
      return false;
    }
  } catch (error) {
    console.error('Critical error initializing Supabase client', error);
    
    // Still create a mock client as last resort
    supabaseInstance = createMockClient();
    isInitialized = true;
    
    return false;
  }
};

/**
 * Get the Supabase client instance
 * Will initialize the client if not already initialized
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!isInitialized) {
    initializeSupabase();
  }
  
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized');
  }
  
  return supabaseInstance;
};

// Export a getter function for lazy initialization
export const supabase = getSupabaseClient();
export default supabase;
