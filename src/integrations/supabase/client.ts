
/**
 * Supabase client wrapper
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
      const response: SupabaseResponse = { data: null, error: null };
      return {
        ...response,
        eq: (column: string, value: any) => ({
          ...response,
          single: () => Promise.resolve<SupabaseResponse>(response),
          maybeSingle: () => Promise.resolve<SupabaseResponse>(response),
          limit: (limit: number) => ({
            ...response,
            maybeSingle: () => Promise.resolve<SupabaseResponse>(response),
            single: () => Promise.resolve<SupabaseResponse>(response),
            order: (column: string, { ascending }: { ascending: boolean }) => 
              Promise.resolve<SupabaseResponse>({ data: [], error: null }),
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => 
            Promise.resolve<SupabaseResponse>({ data: [], error: null }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          ...response,
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
      data: { session: { user: null } }, 
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
      data: { user: null }, 
      error: null 
    }),
    signOut: () => Promise.resolve<{ error: { message: string } | null }>({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
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
            id: 'mock-user-id', 
            email: email, 
            app_metadata: { roles: [] }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }, 
          session: { 
            user: { 
              id: 'mock-user-id', 
              email: email, 
              app_metadata: { roles: [] }, 
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
            id: 'mock-user-id', 
            email: email, 
            app_metadata: { roles: [] }, 
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }, 
          session: { 
            user: { 
              id: 'mock-user-id', 
              email: email, 
              app_metadata: { roles: [] }, 
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
            id: 'mock-user-id', 
            email: 'user@example.com', 
            app_metadata: { roles: [] }, 
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
