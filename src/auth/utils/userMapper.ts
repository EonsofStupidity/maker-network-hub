
import { UserProfile } from '@/shared/types/core/auth.types';
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
      role === ROLES.GUEST ||
      role === ROLES.FOLLOWER ||
      role === ROLES.MAKER ||
      role === ROLES.MOD ||
      role === ROLES.ADMIN ||
      role === ROLES.SUPER_ADMIN
    ) as UserRole[];
  
  // Always include GUEST role as a fallback
  if (validRoles.length === 0) {
    validRoles.push(ROLES.GUEST);
  }
  
  return {
    id: user.id,
    email: user.email || '',
    displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastSignInAt: user.last_sign_in_at,
    bio: user.user_metadata?.bio,
    name: user.user_metadata?.full_name,
    userMetadata: user.user_metadata,
    appMetadata: user.app_metadata,
    roles: validRoles
  };
}
