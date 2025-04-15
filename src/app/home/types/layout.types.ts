
import { z } from 'zod';

export const SectionTypeEnum = z.enum([
  'hero',
  'featured',
  'categories',
  'posts',
  'db'
]);

export type SectionType = z.infer<typeof SectionTypeEnum>;

export interface HomeLayout {
  id: string;
  section_order: SectionType[];
  featured_override?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
}
