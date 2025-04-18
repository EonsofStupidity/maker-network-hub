
import { z } from 'zod';

// Define a schema for Supabase errors
export const SupabaseErrorSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
  details: z.any().optional(),
  code: z.string().or(z.number()).optional(),
  hint: z.string().optional(),
});

export type SupabaseError = z.infer<typeof SupabaseErrorSchema>;

// Define a generic schema for Supabase responses
export const SupabaseResponseSchema = z.object({
  data: z.any().nullable(),
  error: SupabaseErrorSchema.nullable(),
  status: z.number().optional(),
  statusText: z.string().optional(),
  count: z.number().optional(),
});

export type SupabaseResponse = z.infer<typeof SupabaseResponseSchema>;

// Define a generic schema for typed Supabase data responses
export const SupabaseDataResponseSchema = <T extends z.ZodType>(dataSchema: T) => 
  SupabaseResponseSchema.extend({
    data: dataSchema.nullable(),
  });

// Helper function to create response validators with specific data schemas
export function createResponseValidator<T extends z.ZodType>(dataSchema: T) {
  return SupabaseDataResponseSchema(dataSchema);
}

// Schema for session data
export const SupabaseSessionSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    app_metadata: z.record(z.any()).optional(),
    user_metadata: z.record(z.any()).optional(),
    aud: z.string().optional(),
    created_at: z.string().optional(),
  }).nullable(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  expires_at: z.number().optional(),
  expires_in: z.number().optional(),
});

export type SupabaseSession = z.infer<typeof SupabaseSessionSchema>;
