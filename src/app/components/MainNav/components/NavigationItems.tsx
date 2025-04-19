import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSiteTheme } from "@/app/theme/SiteThemeProvider";
import { motion } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/shared/ui/use-toast";

interface NavItem {
  id: string;
  name: string;
  href: string;
  order?: number;
  is_public?: boolean;
}

export const NavigationItems = () => {
  const { pathname } = useLocation();
  const { componentStyles } = useSiteTheme();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const styles = componentStyles?.MainNav || {
    nav: 'flex items-center gap-1 md:gap-2',
    navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
    navItemActive: 'text-primary',
    navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center'
  };
  
  useEffect(() => {
    const loadNavItems = async () => {
      setIsLoading(true);
      try {
        const { data: layoutData, error: layoutError } = await supabase
          .from('layout_skeletons')
          .select('layout_json')
          .eq('type', 'navigation')
          .eq('scope', 'site')
          .eq('is_active', true)
          .single();
        
        if (layoutError) {
          throw layoutError;
        }
        
        if (layoutData?.layout_json?.navigation) {
          setNavItems(layoutData.layout_json.navigation);
        } else {
          // Fallback navigation
          setNavItems([
            { id: "1", name: "Home", href: "/" },
            { id: "2", name: "About", href: "/about" },
            { id: "3", name: "Contact", href: "/contact" },
          ]);
        }
      } catch (error) {
        toast({
          title: "Error loading navigation",
          description: "Using fallback navigation items",
          variant: "destructive"
        });
        // Set fallback navigation
        setNavItems([
          { id: "1", name: "Home", href: "/" },
          { id: "2", name: "About", href: "/about" },
          { id: "3", name: "Contact", href: "/contact" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNavItems();
  }, [toast]);

  // Show simple skeleton during loading
  if (isLoading) {
    return (
      <nav className={cn("hidden md:flex", styles.nav)}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-8 w-16 bg-muted/30 animate-pulse rounded mx-2"></div>
        ))}
      </nav>
    );
  }
  
  // Fallback to default items if no items found in database
  const displayItems = navItems.length > 0 ? navItems : [
    { id: "1", name: "Home", href: "/" },
    { id: "2", name: "About", href: "/about" },
    { id: "3", name: "Contact", href: "/contact" },
  ];
  
  return (
    <nav className={cn("hidden md:flex", styles.nav)}>
      {displayItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              styles.navItem,
              isActive && styles.navItemActive,
              "group cyber-text relative overflow-hidden"
            )}
          >
            {item.name}
            
            {/* Animated underline indicator */}
            {isActive && (
              <motion.span
                className={cn(styles.navItemActiveIndicator, "bg-primary")}
                layoutId="navigation-underline"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            
            {/* Enhanced cyberpunk hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md" />
            
            {/* Bottom border on hover with glow */}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        );
      })}
    </nav>
  );
};
