
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useThemeStore } from '@/stores/theme.store';
import { Theme } from '@/shared/types/core/theme.types';

export async function loadHomeLayout() {
  const { data, error } = await supabase
    .from('home_layouts')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    useToast().toast({
      title: "Error loading layout",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }

  return data;
}

export async function saveHomeLayout(layout: any) {
  const { error } = await supabase
    .from('home_layouts')
    .upsert(layout);

  if (error) {
    useToast().toast({
      title: "Error saving layout",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }

  useToast().toast({
    title: "Layout saved",
    description: "The layout has been updated successfully",
    variant: "default"
  });

  return true;
}
