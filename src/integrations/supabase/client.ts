
/**
 * Supabase client wrapper
 * Singleton implementation with better logging and initialization
 */
import { configureSupabaseClient } from './client-config';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define base types for responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// Singleton instance
let supabaseClient: SupabaseClient | null = null;
let isInitialized = false;
let isMockClient = false;

// Create an offline-friendly mock client for development
const createMockClient = () => {
  logBridge.warn(LogCategory.SYSTEM, 'Creating mock Supabase client', {
    details: { reason: 'Missing environment variables or initialization failure' }
  });
  
  isMockClient = true;
  
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => {
        const mockResponse: SupabaseResponse = { 
          data: [], 
          error: null 
        };
        
        logBridge.info(LogCategory.SYSTEM, 'Mock Supabase select operation', {
          details: { table, columns }
        });
        
        return {
          eq: () => ({
            single: () => Promise.resolve<SupabaseResponse>(mockResponse),
            maybeSingle: () => Promise.resolve<SupabaseResponse>(mockResponse),
          }),
          single: () => Promise.resolve<SupabaseResponse>(mockResponse),
          maybeSingle: () => Promise.resolve<SupabaseResponse>(mockResponse),
        };
      },
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve<SupabaseResponse>({ data, error: null }),
        }),
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve<SupabaseResponse>({ data, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve<SupabaseResponse>({ data: null, error: null }),
      }),
    }),
    auth: {
      getSession: () => {
        logBridge.info(LogCategory.AUTH, 'Mock auth.getSession called');
        return Promise.resolve({ 
          data: { session: null }, 
          error: null 
        });
      },
      onAuthStateChange: (callback: any) => {
        logBridge.info(LogCategory.AUTH, 'Mock auth.onAuthStateChange registered');
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                logBridge.info(LogCategory.AUTH, 'Mock auth subscription unsubscribed');
              },
            },
          },
        };
      },
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
};

/**
 * Initialize the Supabase client
 * This should be called early in the application bootstrap process
 */
export const initializeSupabase = (): boolean => {
  if (isInitialized) {
    logBridge.info(LogCategory.SYSTEM, 'Supabase client already initialized');
    return true;
  }
  
  try {
    // Hard-coded fallback values for development/testing
    const FALLBACK_SUPABASE_URL = "https://kxeffcclfvecdvqpljbh.supabase.co";
    const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4";

    // Determine if we should use mock or real Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;
    
    logBridge.info(LogCategory.SYSTEM, 'Initializing Supabase client', {
      details: { url: supabaseUrl }
    });
    
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
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
      logBridge.info(LogCategory.SYSTEM, 'Supabase client initialized successfully', {
        details: { isMock: false }
      });
      
      return true;
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error creating Supabase client, falling back to mock', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      supabaseClient = createMockClient();
      isInitialized = true;
      
      return false;
    }
  } catch (error) {
    logBridge.error(LogCategory.SYSTEM, 'Critical error initializing Supabase client', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Still create a mock client as last resort
    supabaseClient = createMockClient();
    isInitialized = true;
    
    return false;
  }
};

/**
 * Get the Supabase client instance
 * Will initialize the client if not already initialized
 */
export const getSupabaseClient = (): any => {
  if (!isInitialized) {
    initializeSupabase();
  }
  
  return supabaseClient;
};

/**
 * Check if the current Supabase client is a mock
 */
export const isUsingMockClient = (): boolean => {
  return isMockClient;
};

// Export the getter method as the default
export const supabase = getSupabaseClient();
export default supabase;
