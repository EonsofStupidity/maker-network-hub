
import { z } from 'zod';

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
      // This would typically fetch content from an API
      console.log('Content bridge initializing...');
      
      // Mock data
      this._pages = [
        {
          id: '1',
          slug: 'home',
          title: 'Home Page',
          content: '# Welcome to MakersIMPULSE\n\nThis is the home page content.',
          published: true,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          slug: 'about',
          title: 'About Us',
          content: '# About MakersIMPULSE\n\nLearn more about our platform.',
          published: true,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
      
      console.log('Content bridge initialized');
    } catch (error) {
      this._error = error as Error;
      console.error('Content bridge initialization error:', error);
    } finally {
      this._isLoading = false;
    }
  }
  
  async getPage(slug: string): Promise<ContentPage | null> {
    const page = this._pages.find(p => p.slug === slug) || null;
    return page;
  }
  
  async getAllPages(): Promise<ContentPage[]> {
    return [...this._pages];
  }
  
  async refreshContent(): Promise<void> {
    this._isLoading = true;
    try {
      // This would typically re-fetch content from API
      console.log('Refreshing content...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
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
