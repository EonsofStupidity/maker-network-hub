
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { HomeLayout } from '../types/layout.types';

export async function loadHomeLayout(): Promise<HomeLayout | null> {
  const { data: layout, error } = await supabase
    .from('home_layout')
    .select('*')
    .single();

  if (error) {
    const { toast } = useToast();
    toast({
      title: "Error loading layout",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }

  return layout as HomeLayout;
}

export async function saveHomeLayout(layout: Partial<HomeLayout>) {
  const { error } = await supabase
    .from('home_layout')
    .upsert(layout);

  if (error) {
    const { toast } = useToast();
    toast({
      title: "Error saving layout",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }

  const { toast } = useToast();
  toast({
    title: "Layout saved",
    description: "The layout has been updated successfully"
  });

  return true;
}
