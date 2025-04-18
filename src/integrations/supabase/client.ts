
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Database } from '@/shared/types/database.types';

// Validate environment variables
const ConfigSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseKey: z.string().min(1),
});

const SUPABASE_URL = "https://kxeffcclfvecdvqpljbh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZWZmY2NsZnZlY2R2cXBsamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjIwMTMsImV4cCI6MjA1MDk5ODAxM30.4O56xT1rUNnwrIzr3xHIHXPfa_pIMHyjQXjIoo9H4K4";

const config = ConfigSchema.parse({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
});

export const supabase = createClient<Database>(config.supabaseUrl, config.supabaseKey, {
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
});

// Pre-initialize connection
supabase.auth.getSession().catch(console.error);

export default supabase;
