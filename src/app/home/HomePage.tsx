import React from 'react';
import { useHomeStore } from './store/home.store';
import { loadHomeLayout } from './utils/homeLayoutLoader';
import type { SectionType } from './types/layout.types';
import { RBACBridge } from '@/rbac/bridge';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedSection } from './components/FeaturedSection';
import { CategorySection } from './components/CategorySection';
import { PostsSection } from './components/PostsSection';
import { DBSection } from './components/DBSection';
import { AdminOverlay, AdminOverlayButton } from './components/AdminOverlay';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedPostOption {
  id: string;
  title: string;
}

export default function HomePage() {
  const { layout, setLayout, isLoading } = useHomeStore();
  const [isAdminOverlayVisible, setIsAdminOverlayVisible] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPostOption[]>([]);
  
  const hasAdminAccess = RBACBridge.hasAdminAccess();
  
  useEffect(() => {
    const initLayout = async () => {
      const homeLayout = await loadHomeLayout();
      if (homeLayout) {
        setLayout(homeLayout);
      }
    };
    
    initLayout();
  }, [setLayout]);
  
  useEffect(() => {
    if (hasAdminAccess) {
      const fetchFeaturedPosts = async () => {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (error) throw error;
          if (data) {
            setFeaturedPosts(data as FeaturedPostOption[]);
          }
        } catch (error) {
          console.error('Failed to load posts for admin overlay:', error);
        }
      };
      
      fetchFeaturedPosts();
    }
  }, [hasAdminAccess]);

  const renderSection = (sectionType: SectionType, index: number) => {
    switch (sectionType) {
      case 'hero':
        return <HeroBanner key={`section-${index}`} />;
      case 'featured':
        return <FeaturedSection key={`section-${index}`} />;
      case 'categories':
        return <CategorySection key={`section-${index}`} />;
      case 'posts':
        return <PostsSection key={`section-${index}`} />;
      case 'db':
        return <DBSection key={`section-${index}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        layout.section_order.map((section, index) => renderSection(section, index))
      )}
      
      {hasAdminAccess && (
        <>
          <AdminOverlayButton onClick={() => setIsAdminOverlayVisible(true)} />
          <AdminOverlay 
            isVisible={isAdminOverlayVisible} 
            onClose={() => setIsAdminOverlayVisible(false)}
            featuredPosts={featuredPosts}
          />
        </>
      )}
    </div>
  );
}
