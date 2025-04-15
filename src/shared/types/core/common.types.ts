
export interface BaseEntity {
  id: string;
  created_at?: string; // Making this optional to match UserProfile
  updated_at?: string;
}
