
/**
 * Supabase client wrapper
 * Centralized mock client for development and testing
 */

// Define base types for responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// Create a reusable Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      // Create a mock response
      const mockResponse: SupabaseResponse = { 
        data: table === 'layout_skeletons' ? [{
          id: 'mock-layout-id',
          name: 'Default Layout',
          description: 'Default layout for application',
          type: 'page',
          scope: 'site',
          is_locked: false,
          version: 1,
          is_active: true,
          layout_json: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }] : [],
        error: null 
      };
      
      return {
        ...mockResponse,
        eq: (column: string, value: any) => ({
          ...mockResponse,
          single: () => Promise.resolve<SupabaseResponse>(mockResponse),
          maybeSingle: () => Promise.resolve<SupabaseResponse>(mockResponse),
          limit: (limit: number) => ({
            ...mockResponse,
            maybeSingle: () => Promise.resolve<SupabaseResponse>(mockResponse),
            single: () => Promise.resolve<SupabaseResponse>(mockResponse),
            order: (column: string, { ascending }: { ascending: boolean }) => 
              Promise.resolve<SupabaseResponse>({ data: [], error: null }),
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => 
            Promise.resolve<SupabaseResponse>({ data: [], error: null }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          ...mockResponse,
          limit: (limit: number) => 
            Promise.resolve<SupabaseResponse>({ data: [], error: null }),
        }),
        limit: (limit: number) => 
          Promise.resolve<SupabaseResponse>({ data: [], error: null }),
      };
    },
    insert: (data: any) => ({
      select: (columns: string) => ({
        ...{ data: {}, error: null },
        single: () => Promise.resolve<SupabaseResponse>({ data: {}, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns: string) => ({
          ...{ data: {}, error: null },
          single: () => Promise.resolve<SupabaseResponse>({ data: {}, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => 
        Promise.resolve<SupabaseResponse>({ data: null, error: null }),
    }),
    upsert: (data: any) => ({
      select: (columns: string) => ({
        ...{ data: {}, error: null },
        single: () => Promise.resolve<SupabaseResponse>({ data: {}, error: null }),
      }),
    }),
  }),
  auth: {
    getSession: () => Promise.resolve<{ 
      data: { 
        session: { 
          user: { 
            id: string; 
            email: string; 
            app_metadata: { roles?: string[] } & Record<string, any>; 
            user_metadata: Record<string, any>;
            aud: string;
            created_at: string;
          } | null 
        } | null 
      }; 
      error: { message: string } | null 
    }>({ 
      data: { 
        session: { 
          user: { 
            id: 'system-user-id', 
            email: 'system@internal.app', 
            app_metadata: { 
              roles: ['SUPER_ADMIN'] 
            }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } 
        }
      }, 
      error: null 
    }),
    getUser: () => Promise.resolve<{ 
      data: { 
        user: { 
          id: string; 
          email: string; 
          app_metadata: { roles?: string[] } & Record<string, any>; 
          user_metadata: Record<string, any>;
          aud: string;
          created_at: string;
        } | null 
      }; 
      error: { message: string } | null 
    }>({ 
      data: { 
        user: { 
          id: 'system-user-id', 
          email: 'system@internal.app', 
          app_metadata: { 
            roles: ['SUPER_ADMIN'] 
          }, 
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } 
      }, 
      error: null 
    }),
    signOut: () => Promise.resolve<{ error: { message: string } | null }>({ error: null }),
    onAuthStateChange: (callback: any) => {
      // Immediately call the callback with authenticated session to simulate already logged in
      setTimeout(() => {
        callback('SIGNED_IN', {
          user: {
            id: 'system-user-id',
            email: 'system@internal.app',
            app_metadata: { roles: ['SUPER_ADMIN'] },
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        });
      }, 0);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
    signInWithPassword: ({ email, password }: { email: string, password: string }) => 
      Promise.resolve<{ 
        data: { 
          user: { 
            id: string; 
            email: string; 
            app_metadata: { roles?: string[] } & Record<string, any>; 
            user_metadata: Record<string, any>;
            aud: string;
            created_at: string;
          } | null; 
          session: { 
            user: { 
              id: string; 
              email: string; 
              app_metadata: { roles?: string[] } & Record<string, any>; 
              user_metadata: Record<string, any>;
              aud: string;
              created_at: string;
            } | null 
          } | null 
        }; 
        error: { message: string } | null 
      }>({ 
        data: { 
          user: { 
            id: 'system-user-id', 
            email: 'system@internal.app', 
            app_metadata: { roles: ['SUPER_ADMIN'] }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }, 
          session: { 
            user: { 
              id: 'system-user-id', 
              email: 'system@internal.app', 
              app_metadata: { roles: ['SUPER_ADMIN'] }, 
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString()
            } 
          } 
        }, 
        error: null 
      }),
    signUp: ({ email, password, options }: { email: string, password: string, options?: any }) => 
      Promise.resolve<{ 
        data: { 
          user: { 
            id: string; 
            email: string; 
            app_metadata: { roles?: string[] } & Record<string, any>; 
            user_metadata: Record<string, any>;
            aud: string;
            created_at: string;
          } | null; 
          session: { 
            user: { 
              id: string; 
              email: string; 
              app_metadata: { roles?: string[] } & Record<string, any>; 
              user_metadata: Record<string, any>;
              aud: string;
              created_at: string;
            } | null 
          } | null 
        }; 
        error: { message: string } | null 
      }>({
        data: { 
          user: { 
            id: 'system-user-id', 
            email: 'system@internal.app', 
            app_metadata: { roles: ['SUPER_ADMIN'] }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }, 
          session: { 
            user: { 
              id: 'system-user-id', 
              email: 'system@internal.app', 
              app_metadata: { roles: ['SUPER_ADMIN'] }, 
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString()
            } 
          }  
        }, 
        error: null 
      }),
    resetPasswordForEmail: (email: string) => 
      Promise.resolve<{ data: {}; error: { message: string } | null }>({ data: {}, error: null }),
    updateUser: (updates: any) => 
      Promise.resolve<{ 
        data: { 
          user: { 
            id: string; 
            email: string; 
            app_metadata: { roles?: string[] } & Record<string, any>; 
            user_metadata: Record<string, any>;
            aud: string;
            created_at: string;
          } 
        }; 
        error: { message: string } | null 
      }>({ 
        data: { 
          user: { 
            id: 'system-user-id', 
            email: 'system@internal.app', 
            app_metadata: { roles: ['SUPER_ADMIN'] }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } 
        }, 
        error: null 
      }),
    signInWithOAuth: ({ provider }: { provider: string }) => 
      Promise.resolve<{ data: {}; error: { message: string } | null }>({ data: {}, error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => 
        Promise.resolve<SupabaseResponse>({ data: null, error: null }),
      getPublicUrl: (path: string) => 
        ({ data: { publicUrl: '' }, error: null }),
    }),
  },
};

export default supabase;
