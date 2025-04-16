
import { supabase } from '@/integrations/supabase/client';
import { Layout, LayoutSchema } from '@/shared/types/layout.types';
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
    );

    const data = filteredData?.length > 0 ? filteredData[0] : null;
    const responseError = response.error;

    if (responseError) throw new Error(getErrorMessage(responseError));
    
    if (!data) return null;
    
    // Validate the data with Zod
    const validatedLayout = LayoutSchema.parse(data);
    return validatedLayout;
  } catch (error) {
    console.error('Error loading layout:', error);
    toast({
      title: 'Error loading layout',
      description: getErrorMessage(error),
      variant: 'destructive'
    });
    return null;
  }
}
