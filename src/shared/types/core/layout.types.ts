
import { ReactNode } from 'react';

export interface LayoutComponentProps {
  id: string;
  title: string;
  icon?: ReactNode;
  position: number;
  children?: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: string;
}

export interface LayoutComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface LayoutItem {
  id: string;
  parentId?: string;
  position: number;
  componentId: string;
}

export interface Layout {
  id: string;
  name: string;
  description?: string;
  type: string;
  components: Record<string, LayoutComponent>;
  layout: LayoutItem[];
  scope: string;
  meta?: {
    version: number;
    isLocked: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  type: string;
  scope: string;
  layout_json: {
    layout: LayoutItem[];
    components: Record<string, LayoutComponent>;
  };
  is_locked: boolean;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}
