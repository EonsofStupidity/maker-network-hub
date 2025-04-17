
/**
 * Supabase client wrapper
 * Simplified implementation for better reliability
 */
import { configureSupabaseClient } from './client-config';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { createClient } from '@supabase/supabase-js';

// Define base types for responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// Create an offline-friendly mock client for development
const createMockClient = () => {
  logBridge.info(LogCategory.SYSTEM, 'Creating mock Supabase client');
  
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => {
        const mockResponse: SupabaseResponse = { 
          data: [], 
          error: null 
        };
        
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
      getSession: () => Promise.resolve({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: (callback: any) => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
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

// Determine if we should use mock or real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let baseClient;

if (supabaseUrl && supabaseKey) {
  try {
    logBridge.info(LogCategory.SYSTEM, 'Initializing Supabase client', {
      details: { url: supabaseUrl }
    });
    
    baseClient = createClient(supabaseUrl, supabaseKey, {
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
  } catch (error) {
    logBridge.error(LogCategory.SYSTEM, 'Error creating Supabase client, falling back to mock', {
      error: error instanceof Error ? error.message : String(error)
    });
    baseClient = createMockClient();
  }
} else {
  logBridge.warn(LogCategory.SYSTEM, 'Supabase environment variables missing, using mock client');
  baseClient = createMockClient();
}

// Export the client
export const supabase = baseClient;
export default supabase;
