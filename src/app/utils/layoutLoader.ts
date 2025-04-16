
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui/use-toast';
import { Layout, LayoutSkeleton } from '@/shared/types/core/layout.types';
import { getErrorMessage } from '@/utils/errors';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

/**
 * Maps a LayoutSkeleton from the database to the Layout format needed by the app
 */
function mapSkeletonToLayout(skeleton: LayoutSkeleton): Layout {
  return {
    id: skeleton.id,
    name: skeleton.name,
    description: skeleton.description,
    type: skeleton.type,
    scope: skeleton.scope,
    components: skeleton.layout_json?.components || {},
    layout: skeleton.layout_json?.layout || [],
    meta: {
      version: skeleton.version,
      isLocked: skeleton.is_locked,
      isActive: skeleton.is_active,
      createdAt: skeleton.created_at,
      updatedAt: skeleton.updated_at,
      createdBy: skeleton.created_by
    }
  };
}

export async function loadLayout(type: string, scope: string): Promise<Layout | null> {
  try {
    logBridge.info(LogCategory.SYSTEM, 'Loading layout', {
      details: { type, scope }
    });
    
    const response = await supabase
      .from('layout_skeletons')
      .select('*');
    
    // Since we can't chain eq with the mock, we'll filter manually
    const data = response.data?.find(item => 
      item.type === type && 
      item.scope === scope && 
      item.is_active === true
    );
    
    const responseError = response.error;
    
    if (responseError) {
      throw new Error(getErrorMessage(responseError));
    }
    
    if (data) {
      const mappedLayout = mapSkeletonToLayout(data as LayoutSkeleton);
      
      logBridge.info(LogCategory.SYSTEM, 'Layout loaded successfully', {
        details: { layoutId: data.id, type, scope }
      });
      
      return mappedLayout;
    } else {
      logBridge.warn(LogCategory.SYSTEM, 'No active layout found', {
        details: { type, scope }
      });
      return null;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logBridge.error(LogCategory.SYSTEM, 'Layout loading error', {
      details: { error: errorMessage, type, scope }
    });
    
    toast({
      title: "Error loading layout",
      description: getErrorMessage(error),
      variant: "destructive"
    });
    
    return null;
  }
}

export async function saveLayout(layout: Layout): Promise<boolean> {
  try {
    // Convert from our app's Layout format to the database LayoutSkeleton format
    const layoutSkeleton: Partial<LayoutSkeleton> = {
      id: layout.id,
      name: layout.name,
      description: layout.description,
      type: layout.type,
      scope: layout.scope,
      is_active: layout.meta?.isActive ?? true,
      is_locked: layout.meta?.isLocked ?? false,
      version: layout.meta?.version ?? 1,
      layout_json: {
        components: layout.components,
        layout: layout.layout
      }
    };
    
    const response = await supabase
      .from('layout_skeletons')
      .upsert(layoutSkeleton)
      .select('*');

    const responseError = response.error;
    if (responseError) {
      throw new Error(getErrorMessage(responseError));
    }

    toast({
      title: "Layout saved",
      description: "The layout has been updated successfully"
    });

    return true;
  } catch (error) {
    toast({
      title: "Error saving layout",
      description: getErrorMessage(error),
      variant: "destructive"
    });
    return false;
  }
}
