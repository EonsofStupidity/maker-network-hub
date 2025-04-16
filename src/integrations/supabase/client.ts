
/**
 * Supabase client wrapper
 */

// Create a reusable Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        limit: (limit: number) => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        data: null,
        error: null,
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        data: [],
        error: null,
      }),
    }),
    insert: (data: any) => ({
      select: (columns: string) => ({
        single: () => Promise.resolve({ data: {}, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns: string) => ({
          single: () => Promise.resolve({ data: {}, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithPassword: ({ email, password }: { email: string, password: string }) => 
      Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: ({ email, password, options }: { email: string, password: string, options?: any }) => 
      Promise.resolve({ data: { user: null, session: null }, error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' }, error: null }),
    }),
  },
};

export default supabase;
