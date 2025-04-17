
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

// Local asset paths for fallback
const LOCAL_ASSETS = {
  placeholder1: '/images/placeholder-1.jpg',
  placeholder2: '/images/placeholder-2.jpg',
  placeholder3: '/images/placeholder-3.jpg',
  logo: '/images/logo.png',
  default: '/images/placeholder.jpg'
};

export type AssetKey = keyof typeof LOCAL_ASSETS;

/**
 * Get the URL for an asset, trying Supabase storage first with local fallbacks
 */
export async function getAssetUrl(
  bucketName: string = 'public_assets',
  path: string,
  fallbackKey: AssetKey = 'default'
): Promise<string> {
  try {
    // Try to get from Supabase storage first
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    
    if (data?.publicUrl) {
      return data.publicUrl;
    }
    
    throw new Error('No public URL available');
  } catch (error) {
    // Log error and use local fallback
    logBridge.warn(LogCategory.SYSTEM, 'Failed to load asset from Supabase storage', {
      details: {
        bucket: bucketName,
        path,
        error: error instanceof Error ? error.message : String(error)
      }
    });
    
    // Return the local fallback path
    return LOCAL_ASSETS[fallbackKey] || LOCAL_ASSETS.default;
  }
}

/**
 * Load an image with fallbacks - returns a Promise that resolves to the image URL
 */
export function loadImage(
  path: string,
  bucketName: string = 'public_assets',
  fallbackKey: AssetKey = 'default'
): Promise<string> {
  return getAssetUrl(bucketName, path, fallbackKey);
}

/**
 * Check if an asset exists in Supabase storage
 */
export async function checkAssetExists(bucketName: string, path: string): Promise<boolean> {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return !!data?.publicUrl;
  } catch (error) {
    return false;
  }
}
