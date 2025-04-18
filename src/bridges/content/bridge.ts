import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Define content page schema
export const ContentPageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean().default(true),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export type ContentPage = z.infer<typeof ContentPageSchema>;

// Define the shape of ContentBridge using Zod schema
export const ContentBridgeSchema = z.object({
  initialize: z.function().returns(z.promise(z.void())),
  getPage: z.function().args(z.string()).returns(z.promise(z.union([z.custom<ContentPage>(), z.null()]))),
  getAllPages: z.function().returns(z.promise(z.array(z.custom<ContentPage>()))),
  isLoading: z.boolean(),
  hasError: z.boolean(),
  getError: z.function().returns(z.union([z.custom<Error>(), z.null()])),
  refreshContent: z.function().returns(z.promise(z.void())),
});

// Export the type of ContentBridge
export type IContentBridge = z.infer<typeof ContentBridgeSchema>;

/**
 * ContentBridge provides content management functionality
 * without exposing direct access to the underlying store or API
 */
class ContentBridgeClass implements IContentBridge {
  private _pages: ContentPage[] = [];
  private _isLoading = false;
  private _error: Error | null = null;
  
  get isLoading(): boolean {
    return this._isLoading;
  }
  
  get hasError(): boolean {
    return this._error !== null;
  }
  
  getError(): Error | null {
    return this._error;
  }
  
  async initialize(): Promise<void> {
    this._isLoading = true;
    try {
      // Fetch content pages from Supabase
      console.log('Content bridge initializing - fetching from Supabase...');
      
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Failed to fetch content: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('No content pages found in database');
        // If no content is found, we'll still return an empty array
        this._pages = [];
      } else {
        // Transform the data to match our ContentPage type
        this._pages = data.map(page => ({
          id: page.id,
          slug: page.slug,
          title: page.title,
          content: page.content,
          published: page.published,
          updatedAt: page.updated_at,
          createdAt: page.created_at
        }));
        
        console.log(`Loaded ${this._pages.length} content pages from Supabase`);
      }
      
      console.log('Content bridge initialized successfully');
    } catch (error) {
      this._error = error as Error;
      console.error('Content bridge initialization error:', error);
      // Fallback to empty content when there's an error
      this._pages = [];
    } finally {
      this._isLoading = false;
    }
  }
  
  async getPage(slug: string): Promise<ContentPage | null> {
    try {
      // First check local cache
      const cachedPage = this._pages.find(p => p.slug === slug);
      if (cachedPage) return cachedPage;
      
      // If not in cache, fetch directly from Supabase
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
        
      if (error) {
        console.error(`Error fetching page with slug ${slug}:`, error);
        return null;
      }
      
      if (!data) return null;
      
      // Transform to our ContentPage type
      const page: ContentPage = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        content: data.content,
        published: data.published,
        updatedAt: data.updated_at,
        createdAt: data.created_at
      };
      
      // Add to cache
      const existingIndex = this._pages.findIndex(p => p.id === page.id);
      if (existingIndex >= 0) {
        this._pages[existingIndex] = page;
      } else {
        this._pages.push(page);
      }
      
      return page;
    } catch (error) {
      console.error(`Failed to get page ${slug}:`, error);
      return null;
    }
  }
  
  async getAllPages(): Promise<ContentPage[]> {
    // If we already have pages cached, return them
    if (this._pages.length > 0) {
      return [...this._pages];
    }
    
    // Otherwise fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Failed to fetch all pages: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Transform and cache the results
      this._pages = data.map(page => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        published: page.published,
        updatedAt: page.updated_at,
        createdAt: page.created_at
      }));
      
      return [...this._pages];
    } catch (error) {
      console.error('Error fetching all pages:', error);
      return [];
    }
  }
  
  async refreshContent(): Promise<void> {
    this._isLoading = true;
    try {
      // Clear cache and re-fetch from Supabase
      this._pages = [];
      
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Failed to refresh content: ${error.message}`);
      }
      
      // Transform and update cache
      this._pages = data.map(page => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        content: page.content,
        published: page.published,
        updatedAt: page.updated_at,
        createdAt: page.created_at
      }));
      
      console.log(`Refreshed ${this._pages.length} content pages`);
    } catch (error) {
      this._error = error as Error;
      console.error('Content refresh error:', error);
    } finally {
      this._isLoading = false;
    }
  }
}

export const contentBridge = new ContentBridgeClass();
export const useContentBridge = () => contentBridge;

// Validate at runtime in development
if (process.env.NODE_ENV === 'development') {
  try {
    ContentBridgeSchema.parse(contentBridge);
  } catch (error) {
    console.error('ContentBridge fails schema validation:', error);
  }
}
