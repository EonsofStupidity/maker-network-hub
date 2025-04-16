
/**
 * Supabase client wrapper
 */

// Create a reusable Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      return {
        data: null,
        error: null,
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: {}, error: null }),
          maybeSingle: () => Promise.resolve({ data: {}, error: null }),
          limit: (limit: number) => ({
            data: [],
            error: null,
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            data: [],
            error: null,
          }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          data: [],
          error: null,
        }),
        limit: (limit: number) => ({
          data: [],
          error: null,
        }),
      };
    },
    insert: (data: any) => ({
      select: (columns: string = '*') => ({
        data: {},
        error: null,
        single: () => Promise.resolve({ data: {}, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns: string = '*') => ({
          data: {},
          error: null,
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
    onAuthStateChange: (callback: Function) => ({
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: null, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' }, error: null }),
    }),
  },
};

export default supabase;
