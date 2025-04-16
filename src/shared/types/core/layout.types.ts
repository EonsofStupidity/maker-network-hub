
import { ReactNode } from 'react';

// Base types
export type LayoutComponentType = 'page' | 'section' | 'container' | 'widget' | 'text' | 'image' | string;
export type LayoutScope = 'site' | 'admin' | 'feature' | 'chat' | string;

// Core layout component interface
export interface LayoutComponent {
  id: string;
  type: LayoutComponentType;
  props: Record<string, any>;
  children?: LayoutComponent[];
}

// Layout structure definition
export interface LayoutItem {
  id: string;
  parentId?: string;
  position: number;
  componentId: string;
}

// Main layout interface
export interface Layout {
  id: string;
  name: string;
  description?: string;
  type: LayoutComponentType; 
  components: Record<string, LayoutComponent>;
  layout: LayoutItem[];
  scope: LayoutScope;
  meta?: {
    version: number;
    isLocked: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

// Database layout skeleton (matches Supabase structure)
export interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  type: string;
  scope: string;
  layout_json: {
    components: Record<string, LayoutComponent>;
    layout: LayoutItem[];
  };
  is_locked: boolean;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Utility functions for layout conversions
export function mapSkeletonToLayout(skeleton: LayoutSkeleton): Layout {
  return {
    id: skeleton.id,
    name: skeleton.name,
    description: skeleton.description,
    type: skeleton.type as LayoutComponentType,
    components: skeleton.layout_json?.components || {},
    layout: skeleton.layout_json?.layout || [],
    scope: skeleton.scope as LayoutScope,
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
