/**
 * Supabase client wrapper
 * Centralized client with improved resilience and offline capability
 */
import { configureSupabaseClient } from './client-config';
import { CircuitBreaker } from '@/utils/CircuitBreaker';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

// Define base types for responses
export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// Create a reusable Supabase circuit breaker
const supabaseCircuitBreaker = new CircuitBreaker('supabase-client', {
  maxFailures: 3,
  resetTimeout: 30000, // 30 seconds
  halfOpenAttemptsAllowed: 1,
});

// Define a mock implementation for development
const createMockClient = () => {
  logBridge.info(LogCategory.SYSTEM, 'Creating mock Supabase client');
  
  // We'll create a more robust mock client 
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => {
        // More intelligent mock response based on table name
        const mockResponse: SupabaseResponse = { 
          data: getTableMockData(table),
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
              Promise.resolve<SupabaseResponse>({ data: mockResponse.data?.slice(0, limit) || [], error: null }),
          }),
          limit: (limit: number) => 
            Promise.resolve<SupabaseResponse>({ 
              data: mockResponse.data?.slice(0, limit) || [], 
              error: null 
            }),
          single: () => Promise.resolve<SupabaseResponse>(getSingleMockResponse(table, mockResponse)),
          maybeSingle: () => Promise.resolve<SupabaseResponse>(getSingleMockResponse(table, mockResponse)),
        };
      },
      insert: (data: any) => ({
        select: (columns: string = '*') => ({
          ...{ data: {}, error: null },
          single: () => Promise.resolve<SupabaseResponse>({ data: {...data, id: crypto.randomUUID()}, error: null }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns: string = '*') => ({
            ...{ data: {}, error: null },
            single: () => Promise.resolve<SupabaseResponse>({ data: {...data}, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => 
          Promise.resolve<SupabaseResponse>({ data: null, error: null }),
      }),
      upsert: (data: any) => ({
        select: (columns: string = '*') => ({
          ...{ data: {}, error: null },
          single: () => Promise.resolve<SupabaseResponse>({ data: {...data, id: data.id || crypto.randomUUID()}, error: null }),
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
          Promise.resolve<SupabaseResponse>({ 
            data: { path, fullPath: `${bucket}/${path}` }, 
            error: null 
          }),
        getPublicUrl: (path: string) => 
          ({ data: { publicUrl: `https://example.com/storage/${bucket}/${path}` }, error: null }),
      }),
    },
  };
};

// Mock data for various tables
function getTableMockData(table: string): any {
  switch (table) {
    case 'layout_skeletons':
      return [{
        id: 'mock-layout-id',
        name: 'Default Layout',
        description: 'Default layout for application',
        type: 'page',
        scope: 'site',
        is_locked: false,
        version: 1,
        is_active: true,
        layout_json: {
          layout: [],
          components: {}
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    case 'settings':
      return {
        id: 'site-settings',
        siteTitle: 'MakersIMPULSE',
        siteDescription: 'Build something amazing',
        maintenanceMode: false,
        defaultTheme: 'cyberpunk'
      };
    case 'pages':
      return [
        {
          id: 'home-page',
          slug: 'home',
          title: 'Home',
          content: 'Welcome to MakersIMPULSE',
          published: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'about-page',
          slug: 'about',
          title: 'About',
          content: 'About our platform',
          published: true,
          created_at: new Date().toISOString()
        }
      ];
    case 'menus':
      return [
        {
          id: 'main-menu',
          name: 'Main Navigation',
          items: [
            { id: '1', label: 'Home', url: '/' },
            { id: '2', label: 'About', url: '/about' }
          ]
        }
      ];
    default:
      return [];
  }
}

// Helper to return a single item for maybeSingle() or single() calls
function getSingleMockResponse(table: string, response: SupabaseResponse): SupabaseResponse {
  const data = response.data;
  
  // If data is array with at least one item, return the first item
  if (Array.isArray(data) && data.length > 0) {
    return { data: data[0], error: null };
  }
  
  // If data is already an object (not array), return it
  if (data && !Array.isArray(data)) {
    return response;
  }
  
  // No data found
  return { data: null, error: null };
}

// Determine if we should use mock or real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a wrapper around Supabase that adds circuit breaker protection
function createSupabaseWrapper(client: any) {
  // Return a proxy that wraps client methods with circuit breaker
  return new Proxy(client, {
    get: (target, prop) => {
      // If the property is a function, wrap it with the circuit breaker
      if (typeof target[prop] === 'function') {
        return async (...args: any[]) => {
          return supabaseCircuitBreaker.execute(
            () => target[prop](...args),
            () => {
              logBridge.error(LogCategory.SYSTEM, 'Supabase circuit breaker open', {
                details: { method: prop.toString() }
              });
              throw new Error(`Supabase client circuit breaker open - method: ${prop.toString()}`);
            }
          );
        };
      }
      
      // For nested objects like auth, storage, etc.
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return createSupabaseWrapper(target[prop]);
      }
      
      // Otherwise return the property directly
      return target[prop];
    }
  });
}

// Create either a real Supabase client or a mock one
let baseClient;

if (supabaseUrl && supabaseKey) {
  logBridge.info(LogCategory.SYSTEM, 'Initializing real Supabase client', {
    details: { url: supabaseUrl }
  });
  baseClient = configureSupabaseClient(supabaseUrl, supabaseKey);
} else {
  logBridge.warn(LogCategory.SYSTEM, 'Supabase environment variables missing, using mock client');
  baseClient = createMockClient();
}

// Wrap the client with circuit breaker protection
export const supabase = createSupabaseWrapper(baseClient);

export default supabase;
