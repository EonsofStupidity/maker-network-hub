
import { UserRole } from './shared.types';
import { BaseEntity, User } from './base.types';

// Extended user profile 
export interface UserProfile extends User {
  full_name?: string;
  bio?: string;
  theme_preference?: string;
  notifications_enabled?: boolean;
  email_verified?: boolean;
  last_active?: string;
  roles?: UserRole[];
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  preferences?: {
    dark_mode?: boolean;
    email_notifications?: boolean;
    display_language?: string;
  };
}

export interface UserActivity extends BaseEntity {
  user_id: string;
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
