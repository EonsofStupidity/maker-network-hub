
// Import the main Supabase client
import { supabase as appSupabase } from '../../../../integrations/supabase/client';

// Re-export the app's Supabase client
export const supabase = appSupabase;

// For typing purposes
export type Database = any;
