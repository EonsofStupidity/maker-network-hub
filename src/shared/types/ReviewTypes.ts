
import { BaseEntity } from './base.types';
import { UserRole } from './shared.types';

export interface Review extends BaseEntity {
  user_id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at?: string;
  status: ReviewStatus;
  helpful_count?: number;
  reported?: boolean;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewFilters {
  rating?: number;
  status?: ReviewStatus;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';
}
