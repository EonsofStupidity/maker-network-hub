
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Database } from '@/shared/types/database.types';

// Define a schema for validating Supabase configuration
export const SupabaseConfigSchema = z.object({
  supabaseUrl: z.string().url('Invalid Supabase URL'),
  supabaseKey: z.string().min(1, 'Supabase key is required'),
});

export type SupabaseConfig = z.infer<typeof SupabaseConfigSchema>;

// Initialize the Supabase client with proper error handling
export const supabase = createClient<Database>(
  'https://kxeffcclfvecdvqpljbh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Pre-initialize connection
export const initializeSupabase = async (): Promise<void> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    console.info('Supabase connection established successfully');
  } catch (error) {
    console.error('Supabase initialization error:', error);
  }
};

// Initialize connection
initializeSupabase().catch(console.error);

export { supabase as default };
