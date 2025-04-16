
// Shared Supabase client for chat module
import { supabase as appSupabase } from '@/integrations/supabase/client';

// Re-export the app's Supabase client for use in the chat module
export const supabase = appSupabase;

// Export Database type for typing purposes
export type Database = any;
