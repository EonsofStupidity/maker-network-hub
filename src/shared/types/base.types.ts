
/**
 * Base entity interface for all database entities
 */
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Base user interface
 */
export interface User {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
