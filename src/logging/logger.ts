import { supabase } from '@/integrations/supabase/client';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';

// Example function with the error
export async function logToDatabase(level: LogLevel, category: LogCategory, message: string, details?: any) {
  try {
    const { error: responseError } = await supabase
      .from('application_logs')
      .insert({
        level,
        category,
        message,
        details: details || {}
      })
      .select('id');
      
    if (responseError) {
      console.error('Failed to log to database:', responseError.message);
    }
    
    return true;
  } catch (err) {
    console.error('Logging error:', err);
    return false;
  }
}

// Export other functions as needed
