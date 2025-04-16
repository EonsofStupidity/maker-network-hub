
import { UserProfile, AuthStatus, AUTH_STATUS } from '@/shared/types/core/auth.types';

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
export interface IAuthBridge {
  // Status
  isAuthenticated: boolean;
  
  // Session management
  getCurrentSession: () => Promise<{ user: UserProfile } | null>;
  refreshSession: () => Promise<{ user_id: string } | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  
  // Account linking
  onAuthEvent: (callback: (event: any) => void) => { unsubscribe: () => void };
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User profile
  getUser: () => UserProfile | null;
  getProfile: () => UserProfile | null;
  
  // Additional methods for compatibility with atoms
  getStatus?: () => AuthStatus;
  getError?: () => Error | null;
  isLoading?: boolean;
  isInitialized?: boolean;
}

class AuthBridgeClass implements IAuthBridge {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  private _status: AuthStatus = AUTH_STATUS.GUEST;
  private _error: Error | null = null;
  
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
  
  get isLoading(): boolean {
    return this._status === AUTH_STATUS.LOADING;
  }
  
  get isInitialized(): boolean {
    return this._status !== AUTH_STATUS.LOADING;
  }
  
  getUser(): UserProfile | null {
    return this._user;
  }
  
  getProfile(): UserProfile | null {
    return this._user;
  }
  
  getStatus(): AuthStatus {
    return this._status;
  }
  
  getError(): Error | null {
    return this._error;
  }
  
  setUser(user: UserProfile | null): void {
    this._user = user;
    this._isAuthenticated = !!user;
    this._status = user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.GUEST;
  }
  
  setStatus(status: AuthStatus): void {
    this._status = status;
  }
  
  setError(error: Error | null): void {
    this._error = error;
    if (error) {
      this._status = AUTH_STATUS.ERROR;
    }
  }
  
  async getCurrentSession(): Promise<{ user: UserProfile } | null> {
    if (!this._user) return null;
    return { user: this._user };
  }
  
  async refreshSession(): Promise<{ user_id: string } | null> {
    if (!this._user) return null;
    return { user_id: this._user.id };
  }
  
  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    try {
      // Mock implementation for now
      const mockUser: UserProfile = {
        id: '1',
        email,
        displayName: 'Test User',
        avatarUrl: 'https://ui-avatars.com/api/?name=Test+User',
        createdAt: new Date().toISOString(),
        roles: ['GUEST']
      };
      
      this.setUser(mockUser);
      return { user: mockUser, error: null };
    } catch (error) {
      this.setError(error instanceof Error ? error : new Error('Unknown error'));
      return { user: null, error: this._error };
    }
  }
  
  async signUp(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    return this.signInWithEmail(email, password);
  }
  
  async signOut(): Promise<void> {
    this.setUser(null);
  }
  
  onAuthEvent(callback: (event: any) => void): { unsubscribe: () => void } {
    return { unsubscribe: () => {} };
  }
  
  async resetPassword(email: string): Promise<void> {
    // Mock implementation
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this._user;
  }
}

export const AuthBridge = new AuthBridgeClass();
export const authBridge = AuthBridge;
