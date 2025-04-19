
import { UserProfile } from '@/shared/types/core/auth.types';
import { User } from '@supabase/supabase-js';

export function mapUserToProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastSignIn: user.last_sign_in_at,
    bio: user.user_metadata?.bio,
    name: user.user_metadata?.full_name,
    userMetadata: user.user_metadata,
    appMetadata: user.app_metadata,
    roles: user.app_metadata?.roles || []
  };
}
