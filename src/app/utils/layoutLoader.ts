
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/shared/types/layout.types';
import { toast } from '@/shared/ui';
import { getErrorMessage } from '@/utils/errors';

export async function loadLayout(type: string, scope: string): Promise<Layout | null> {
  try {
    const response = await supabase
      .from('layout_skeletons')
      .select('*');

    // Then apply filters manually since the mock doesn't support chaining
    const filteredData = response.data?.filter(item => 
      item.type === type && 
      item.scope === scope && 
      item.is_active === true
    ) || [];

    const data = filteredData.length > 0 ? filteredData[0] : null;
    const responseError = response.error;

    if (responseError) throw new Error(getErrorMessage(responseError));
    
    if (!data) {
      console.warn(`No layout found for type=${type} scope=${scope}, providing default.`);
      // Return a minimal default layout to prevent render failures
      return {
        id: 'default-layout',
        name: 'Default Layout',
        type,
        scope,
        layout: [],
        meta: {},
        components: {}
      };
    }
    
    // If the data is present, we need to extract the layout data from layout_json
    const layoutData = data.layout_json || {};
    
    console.log('Layout loaded successfully:', data);
    
    // Transform the data to match the Layout type
    const transformedLayout: Layout = {
      id: data.id,
      name: data.name,
      type: data.type,
      scope: data.scope,
      layout: layoutData.layout || [],
      components: layoutData.components || {},
      meta: data.meta || {}
    };
    
    return transformedLayout;
  } catch (error) {
    console.error('Error loading layout:', error);
    toast({
      title: 'Error loading layout',
      description: getErrorMessage(error),
      variant: 'destructive'
    });
    
    // Return a minimal default layout to prevent render failures
    return {
      id: 'default-layout',
      name: 'Default Layout',
      type,
      scope,
      layout: [],
      components: {},
      meta: {}
    };
  }
}
