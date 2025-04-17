
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/core/auth.types';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

/**
 * Auth bridge implementation
 */
class AuthBridgeClass {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  private _status: AuthStatus = AUTH_STATUS.GUEST;
  private _error: Error | null = null;
  
  // For simplicity, we'll return true (no auth checks)
  get isAuthenticated(): boolean {
    return true;
  }
  
  // Return a mock user with roles
  getUser(): UserProfile | null {
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User',
      roles: [ROLES.GUEST],
      userMetadata: {
        full_name: 'Demo User',
        avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  // Mock session management
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    return { user: this.getUser()! };
  }
  
  async refreshSession(): Promise<{ user_id: string } | null> {
    return { user_id: '1' };
  }
  
  // Mock auth methods with proper signatures
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  // Alias for signInWithEmail for compatibility
  async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return this.signInWithEmail(email, password);
  }
  
  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return { user: this.getUser(), error: null };
  }
  
  async signOut(): Promise<void> {
    // No-op
  }
  
  // Mock event subscription
  onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    return { unsubscribe: () => {} };
  }
  
  // Mock password reset
  async resetPassword(email: string): Promise<void> {
    // No-op
  }
  
  // Alias for getUser
  getProfile(): UserProfile | null {
    return this.getUser();
  }

  // Get user profile by ID (used in auth store)
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getUser();
  }
  
  // Status getter
  getStatus(): AuthStatus {
    return AUTH_STATUS.AUTHENTICATED;
  }
  
  // Error getter
  getError(): Error | null {
    return null;
  }
  
  // Status flags
  get isLoading(): boolean {
    return false;
  }
  
  get isInitialized(): boolean {
    return true;
  }
}

export const authBridge = new AuthBridgeClass();
