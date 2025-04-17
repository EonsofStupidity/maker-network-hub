
/**
 * Supabase client wrapper
 * Simplified implementation for better reliability
 */
import { configureSupabaseClient } from './client-config';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

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
        // Mock response based on table name
        const mockResponse: SupabaseResponse = { 
          data: [], 
          error: null 
        };
        
        return {
          ...mockResponse,
          eq: () => ({
            ...mockResponse,
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
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  };
};

// Determine if we should use mock or real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create either a real Supabase client or a mock one
let baseClient;

if (supabaseUrl && supabaseKey) {
  logBridge.info(LogCategory.SYSTEM, 'Initializing Supabase client', {
    details: { url: supabaseUrl }
  });
  baseClient = configureSupabaseClient(supabaseUrl, supabaseKey);
} else {
  logBridge.warn(LogCategory.SYSTEM, 'Supabase environment variables missing, using mock client');
  baseClient = createMockClient();
}

// Export the client
export const supabase = baseClient;
export default supabase;
