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

// Mock user for local development
const MOCK_USER: UserProfile = {
  id: '1',
  email: 'dev@example.com',
  displayName: 'Dev User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    lastLogin: new Date().toISOString()
  }
};

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
  
  hydrateUser(user: UserProfile): void {
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
      console.log('Auth bridge initializing with local data...');
      
      // Auto-login in development with mock user
      if (process.env.NODE_ENV === 'development') {
        // Automatically log in as mock user
        this.hydrateUser(MOCK_USER);
      } else {
        // In production would check local storage or cookies
        this.setGuest();
      }
      
      this._isInitialized = true;
    } catch (error) {
      this._error = error as Error;
      this._status = AUTH_STATUS.ERROR;
      this.setGuest(); // Still set guest mode on error
      throw error;
    } finally {
      this._isLoading = false;
    }
  }
  
  async login(email: string, password: string): Promise<UserProfile> {
    this._isLoading = true;
    try {
      console.log(`Logging in with ${email}...`);
      
      // Mock login - in real app would call auth provider
      if (email === 'dev@example.com' && password === 'password') {
        const userProfile = MOCK_USER;
        this.hydrateUser(userProfile);
        return userProfile;
      } else {
        throw new Error('Invalid credentials');
      }
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
      // Mock logout - in real app would call auth provider
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
    this._isLoading = true;
    try {
      // Mock password reset - in real app would call auth provider
      console.log(`Password reset requested for ${email}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development, just log the request
      console.log(`Reset password email would be sent to ${email}`);
    } catch (error) {
      this._error = error as Error;
      throw error;
    } finally {
      this._isLoading = false;
    }
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
