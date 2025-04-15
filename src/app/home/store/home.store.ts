
import { create } from 'zustand';
import type { HomeLayout } from '../types/layout.types';

interface HomeState {
  layout: HomeLayout;
  isLoading: boolean;
  error: string | null;
  
  setLayout: (layout: HomeLayout) => void;
  setError: (error: string | null) => void;
}

const defaultLayout: HomeLayout = {
  id: '00000000-0000-0000-0000-000000000000',
  section_order: ['hero', 'featured', 'categories', 'posts'],
};

export const useHomeStore = create<HomeState>((set) => ({
  layout: defaultLayout,
  isLoading: true,
  error: null,
  
  setLayout: (layout) => set({ layout, isLoading: false }),
  setError: (error) => set({ error, isLoading: false })
}));
