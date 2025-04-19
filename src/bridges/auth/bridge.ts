import { z } from 'zod';
import { UserProfile, AUTH_STATUS } from '@/shared/types/core/auth.types';
import { supabase } from '@/integrations/supabase/client';
import { mapUserToProfile } from '@/auth/utils/userMapper';

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
      console.log('Auth bridge initializing with Supabase...');
      
      // Get the current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session?.user) {
        // Map the Supabase user to our UserProfile format
        const userProfile = mapUserToProfile(session.user);
        this.hydrateUser(userProfile);
      } else {
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
  
  async login(email: string, password: string): Promise<any> {
    this._isLoading = true;
    try {
      // Use actual Supabase auth
      console.log(`Logging in with ${email}...`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = mapUserToProfile(data.user);
        this.hydrateUser(userProfile);
        return userProfile;
      } else {
        throw new Error('Login failed - no user returned');
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
      // Use actual Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
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
