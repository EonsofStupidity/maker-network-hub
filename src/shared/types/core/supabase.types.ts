
import { z } from 'zod';

export const SupabaseErrorSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
  details: z.any().optional(),
});

export type SupabaseError = z.infer<typeof SupabaseErrorSchema>;

export const SupabaseResponseSchema = z.object({
  data: z.any().nullable(),
  error: SupabaseErrorSchema.nullable(),
});

export type SupabaseResponse = z.infer<typeof SupabaseResponseSchema>;
