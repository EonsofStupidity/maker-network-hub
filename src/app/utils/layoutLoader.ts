
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui/use-toast';
import { Layout, LayoutSkeleton, mapSkeletonToLayout } from '@/shared/types/core/layout.types';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { z } from 'zod';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

// ZOD validation schema for layout component
const LayoutComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()).default({}),
  children: z.array(z.lazy(() => LayoutComponentSchema)).optional(),
});

// ZOD validation schema for layout structure
const LayoutSkeletonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  scope: z.string(),
  layout_json: z.object({
    components: z.record(LayoutComponentSchema).default({}),
    layout: z.array(z.object({
      id: z.string(),
      parentId: z.string().optional(),
      position: z.number(),
      componentId: z.string()
    })).default([])
  }).default({ components: {}, layout: [] }),
  is_locked: z.boolean().default(false),
  version: z.number().default(1),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().optional()
});

// Create a circuit breaker for layout loading
const layoutCircuitBreaker = new CircuitBreaker('layout-loader', {
  maxFailures: 3,
  resetTimeout: 10000, // 10 seconds
});

// Cache for layouts to avoid repeated loading
const layoutCache = new Map<string, {
  layout: Layout;
  timestamp: number;
}>();

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Create a type for the cache key
type CacheKey = `${string}:${string}`;

/**
 * Load a layout from Supabase with caching, validation, and offline support
 */
export async function loadLayout(type: string, scope: string): Promise<Layout | null> {
  const cacheKey: CacheKey = `${type}:${scope}`;
  
  try {
    // Check cache first
    const cached = layoutCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRY_MS) {
      logBridge.info(LogCategory.SYSTEM, 'Using cached layout', {
        details: { type, scope, cacheAge: now - cached.timestamp }
      });
      return cached.layout;
    }

    // Not in cache or cache expired, load from API
    logBridge.info(LogCategory.SYSTEM, 'Loading layout from Supabase', {
      details: { type, scope }
    });
    
    // Use circuit breaker for API call
    const response = await layoutCircuitBreaker.execute(
      async () => {
        const { data, error } = await supabase
          .from('layout_skeletons')
          .select('*')
          .eq('type', type)
          .eq('scope', scope)
          .eq('is_active', true)
          .maybeSingle();
          
        if (error) throw new Error(error.message);
        return data;
      },
      // Fallback function if circuit is open
      () => {
        logBridge.warn(LogCategory.SYSTEM, 'Circuit open, using fallback empty data', {
          details: { circuitName: 'layout-loader' }
        });
        return null;
      }
    );
    
    if (!response) {
      logBridge.warn(LogCategory.SYSTEM, 'No active layout found', {
        details: { type, scope }
      });
      return null;
    }
    
    // Validate data with Zod schema
    const validationResult = LayoutSkeletonSchema.safeParse(response);
    
    if (!validationResult.success) {
      throw new Error(`Layout validation failed: ${validationResult.error.message}`);
    }
    
    const validatedSkeleton = validationResult.data;
    
    // Convert from database format to our app format
    const mappedLayout = mapSkeletonToLayout(validatedSkeleton);
    
    // Update cache
    layoutCache.set(cacheKey, {
      layout: mappedLayout,
      timestamp: now
    });
    
    logBridge.info(LogCategory.SYSTEM, 'Layout loaded successfully', {
      details: { layoutId: response.id, type, scope }
    });
    
    return mappedLayout;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logBridge.error(LogCategory.SYSTEM, 'Layout loading error', {
      details: { error: errorMessage, type, scope }
    });
    
    // Don't display error to user, let the caller handle it
    return null;
  }
}

/**
 * Clear layout cache entry or all cache
 */
export function clearLayoutCache(type?: string, scope?: string): void {
  if (type && scope) {
    const cacheKey: CacheKey = `${type}:${scope}`;
    layoutCache.delete(cacheKey);
    logBridge.info(LogCategory.SYSTEM, 'Layout cache cleared for specific key', {
      details: { type, scope }
    });
  } else {
    layoutCache.clear();
    logBridge.info(LogCategory.SYSTEM, 'Full layout cache cleared');
  }
}
