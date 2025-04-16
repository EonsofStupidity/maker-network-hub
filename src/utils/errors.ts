
/**
 * Utility for safe error message extraction
 * Works with PostgrestError, Error objects, strings, or unknown types
 */
export function getErrorMessage(error: unknown): string {
  // Handle PostgrestError (from Supabase)
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle null or undefined
  if (error === null) {
    return 'Null error occurred';
  }
  
  if (error === undefined) {
    return 'Unknown error occurred';
  }
  
  // Fallback for any other type
  return 'An unexpected error occurred';
}
