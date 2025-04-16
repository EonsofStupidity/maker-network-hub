
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { HomeLayout } from '../types/layout.types';

export async function loadHomeLayout(): Promise<HomeLayout | null> {
  try {
    const { data, error: responseError } = await supabase
      .from('home_layout')
      .select('*')
      .maybeSingle();

    if (responseError) {
      throw new Error(responseError.message || 'Failed to load home layout');
    }

    return data as HomeLayout;
  } catch (error) {
    const { toast } = useToast();
    toast({
      title: "Error loading layout",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive"
    });
    return null;
  }
}

export async function saveHomeLayout(layout: Partial<HomeLayout>) {
  try {
    const { error: responseError } = await supabase
      .from('home_layout')
      .insert(layout)
      .select();

    if (responseError) {
      throw new Error(responseError.message);
    }

    const { toast } = useToast();
    toast({
      title: "Layout saved",
      description: "The layout has been updated successfully"
    });

    return true;
  } catch (error) {
    const { toast } = useToast();
    toast({
      title: "Error saving layout",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive"
    });
    return false;
  }
}
