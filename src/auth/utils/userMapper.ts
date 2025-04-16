
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
    name: userData.user_metadata?.full_name || '',
    createdAt: userData.created_at || new Date().toISOString(),
    updatedAt: userData.updated_at || new Date().toISOString(),
    lastSignInAt: userData.last_sign_in_at || new Date().toISOString(),
    bio: userData.user_metadata?.bio || '',
    userMetadata: userData.user_metadata || {},
    appMetadata: userData.app_metadata || {}
  };
}
