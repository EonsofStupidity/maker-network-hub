
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Database } from '@/shared/types/database.types';

// Define a schema for validating Supabase configuration
export const SupabaseConfigSchema = z.object({
  supabaseUrl: z.string().url('Invalid Supabase URL'),
  supabaseKey: z.string().min(1, 'Supabase key is required'),
});

export type SupabaseConfig = z.infer<typeof SupabaseConfigSchema>;

// Hardcoded values - in a real production app, these would come from environment variables
const SUPABASE_URL = "https://kxeffcclfvecdvqpljbh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4";

// Validate the configuration
const validatedConfig = SupabaseConfigSchema.safeParse({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
});

// Initialize the Supabase client with proper error handling
let supabase: ReturnType<typeof createClient<Database>>;

if (validatedConfig.success) {
  try {
    supabase = createClient<Database>(
      validatedConfig.data.supabaseUrl,
      validatedConfig.data.supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'x-application-name': 'makers-impulse',
          },
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
    
    console.info('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Create a mock client that logs errors when methods are called
    supabase = createMockClient();
  }
} else {
  console.error('Invalid Supabase configuration:', validatedConfig.error.format());
  // Create a mock client as fallback
  supabase = createMockClient();
}

// Exportable function to initialize and test Supabase connection
export const initializeSupabase = async (): Promise<void> => {
  try {
    // Test the connection by making a simple query
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      throw new Error(`Supabase connection test failed: ${error.message}`);
    }
    
    console.info('Supabase connection established successfully');
  } catch (error) {
    console.error('Supabase initialization error:', error);
    // We don't throw here to allow the app to continue functioning
    // The error will be handled by the connection status hook
  }
};

// Create a mock client for fallback when Supabase is unavailable
function createMockClient() {
  const errorHandler = () => {
    return {
      data: null,
      error: { message: 'Supabase client not properly initialized' },
    };
  };
  
  return {
    from: () => ({
      select: () => errorHandler(),
      insert: () => errorHandler(),
      update: () => errorHandler(),
      delete: () => errorHandler(),
    }),
    auth: {
      getSession: async () => errorHandler(),
      getUser: async () => errorHandler(),
      signOut: async () => errorHandler(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: async () => errorHandler(),
        getPublicUrl: () => errorHandler(),
      }),
    },
    rpc: () => errorHandler(),
  } as unknown as ReturnType<typeof createClient<Database>>;
}

// Pre-initialize connection
initializeSupabase().catch(console.error);

export { supabase };
export default supabase;
