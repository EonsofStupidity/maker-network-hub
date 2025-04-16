
import { supabase } from '@/integrations/supabase/client';
import { Layout, LayoutSchema } from '@/shared/types/layout.types';
import { toast } from '@/shared/ui';

export async function loadLayout(type: string, scope: string): Promise<Layout | null> {
  try {
    const { data, error: responseError } = await supabase
      .from('layout_skeletons')
      .select('*')
      .eq('type', type)
      .eq('scope', scope)
      .eq('is_active', true)
      .maybeSingle();

    if (responseError) throw responseError;
    
    // Validate the data with Zod
    const validatedLayout = LayoutSchema.parse(data);
    return validatedLayout;
  } catch (error) {
    console.error('Error loading layout:', error);
    toast({
      title: 'Error loading layout',
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'destructive'
    });
    return null;
  }
}
