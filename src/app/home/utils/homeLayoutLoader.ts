
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui/use-toast';
import type { HomeLayout } from '../types/layout.types';
import { getErrorMessage } from '@/utils/errors';

export async function loadHomeLayout(): Promise<HomeLayout | null> {
  try {
    const response = await supabase
      .from('home_layout')
      .select('*');
      
    // Since we can't use maybeSingle with the mock, we'll handle it manually
    const data = response.data?.[0];
    const responseError = response.error;

    if (responseError) {
      throw new Error(getErrorMessage(responseError));
    }

    return data as HomeLayout;
  } catch (error) {
    toast({
      title: "Error loading layout",
      description: getErrorMessage(error),
      variant: "destructive"
    });
    return null;
  }
}

export async function saveHomeLayout(layout: Partial<HomeLayout>) {
  try {
    const response = await supabase
      .from('home_layout')
      .insert(layout)
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
