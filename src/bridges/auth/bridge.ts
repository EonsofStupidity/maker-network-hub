
import { z } from 'zod';
import { UserProfile, AUTH_STATUS } from '@/shared/types/core/auth.types';

// Define the shape of AuthBridge using Zod schema
export const AuthBridgeSchema = z.object({
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  isInitialized: z.boolean(),
  getUser: z.function().returns(z.union([z.custom<UserProfile>(), z.null()])),
  getStatus: z.function().returns(z.string()),
  getError: z.function().returns(z.union([z.custom<Error>(), z.null()])),
  hydrateUser: z.function().args(z.any()).returns(z.void()),
  setGuest: z.function().args().returns(z.void()),
  initialize: z.function().returns(z.promise(z.void())),
  login: z.function().args(z.string(), z.string()).returns(z.promise(z.any())),
  logout: z.function().returns(z.promise(z.void())),
  resetPassword: z.function().args(z.string()).returns(z.promise(z.void())),
});

// Export the type of AuthBridge
export type IAuthBridge = z.infer<typeof AuthBridgeSchema>;

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
class AuthBridgeClass implements IAuthBridge {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  private _status: string = AUTH_STATUS.GUEST;
  private _error: Error | null = null;
  private _isInitialized = false;
  private _isLoading = false;
  
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
  
  get isLoading(): boolean {
    return this._isLoading;
  }
  
  get isInitialized(): boolean {
    return this._isInitialized;
  }
  
  getUser(): UserProfile | null {
    return this._user;
  }
  
  getStatus(): string {
    return this._status;
  }
  
  getError(): Error | null {
    return this._error;
  }
  
  hydrateUser(user: any): void {
    this._user = user;
    this._isAuthenticated = !!user;
    this._status = user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.GUEST;
    this._isInitialized = true;
  }
  
  setGuest(): void {
    this._user = null;
    this._isAuthenticated = false;
    this._status = AUTH_STATUS.GUEST;
    this._isInitialized = true;
  }
  
  async initialize(): Promise<void> {
    this._isLoading = true;
    try {
      // This would typically fetch the user's session
      console.log('Auth bridge initializing...');
      
      // For now, we'll set as guest
      this.setGuest();
      
      this._isInitialized = true;
    } catch (error) {
      this._error = error as Error;
      this._status = AUTH_STATUS.ERROR;
      throw error;
    } finally {
      this._isLoading = false;
    }
  }
  
  async login(email: string, password: string): Promise<any> {
    this._isLoading = true;
    try {
      // Mock login - in real app this would call Supabase auth
      console.log(`Logging in with ${email}...`);
      const mockUser = {
        id: '123',
        email,
        displayName: 'Test User'
      };
      
      this.hydrateUser(mockUser);
      return mockUser;
    } catch (error) {
      this._error = error as Error;
      this._status = AUTH_STATUS.ERROR;
      throw error;
    } finally {
      this._isLoading = false;
    }
  }
  
  async logout(): Promise<void> {
    this._isLoading = true;
    try {
      // Mock logout - in real app this would call Supabase auth signOut
      console.log('Logging out...');
      this.setGuest();
    } catch (error) {
      this._error = error as Error;
      this._status = AUTH_STATUS.ERROR;
      throw error;
    } finally {
      this._isLoading = false;
    }
  }
  
  async resetPassword(email: string): Promise<void> {
    console.log(`Reset password for ${email}...`);
    // Mock implementation - would call Supabase resetPasswordForEmail
  }
}

export const authBridge = new AuthBridgeClass();
export const useAuthBridge = () => authBridge;

// Validate at runtime in development
if (process.env.NODE_ENV === 'development') {
  try {
    AuthBridgeSchema.parse(authBridge);
  } catch (error) {
    console.error('AuthBridge fails schema validation:', error);
  }
}
