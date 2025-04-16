
import { UserProfile } from '@/shared/types/core/auth.types';

export function mapUserToProfile(userData: any): UserProfile {
  if (!userData) {
    throw new Error('No user data provided');
  }

  // Handle Supabase user data structure
  if (userData.user) {
    userData = userData.user;
  }

  return {
    id: userData.id || '',
    email: userData.email || '',
    displayName: userData.user_metadata?.full_name || userData.email?.split('@')[0] || '',
    avatarUrl: userData.user_metadata?.avatar_url || '',
    created_at: userData.created_at || new Date().toISOString(),
    updated_at: userData.updated_at || new Date().toISOString(),
    last_sign_in_at: userData.last_sign_in_at || new Date().toISOString(),
    user_metadata: userData.user_metadata || {},
    app_metadata: userData.app_metadata || {}
  };
}
