import { UserProfile, UserMetadata, AppMetadata } from '@/shared/types/core/auth.types';
import { User } from '@supabase/supabase-js';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';

/**
 * Maps Supabase user to our internal UserProfile format
 */
export function mapUserToProfile(user: User): UserProfile {
  // Extract roles from app_metadata if available
  const appRoles = user.app_metadata?.roles || [];
  
  // Validate roles against our system roles
  const validRoles = appRoles
    .filter(role => 
      Object.values(ROLES).includes(role as UserRole)
    ) as UserRole[];
  
  // Always include GUEST role as a fallback
  if (validRoles.length === 0) {
    validRoles.push(ROLES.GUEST);
  }
  
  // Type-safe metadata
  const userMetadata: UserMetadata = user.user_metadata || {};
  const appMetadata: AppMetadata = user.app_metadata || {};
  
  return {
    id: user.id,
    email: user.email || '',
    displayName: userMetadata.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: userMetadata.avatar_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastSignIn: user.last_sign_in_at,
    bio: userMetadata.bio,
    name: userMetadata.full_name,
    userMetadata,
    appMetadata,
    roles: validRoles
  };
}
