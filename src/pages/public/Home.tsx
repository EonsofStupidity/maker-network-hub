
import React from 'react';
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import { RBACBridge } from "@/shared/bridges/RBACBridge";
import { cn } from "@/shared/utils/cn";
import { ThemeEffectType } from '@/shared/types/core/theme.types';
import { useThemeEffects } from '@/hooks/useThemeEffects';
import { LayoutBootstrap } from '@/layouts/LayoutBootstrap';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

export const PublicHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { effects, isEffectEnabled } = useThemeEffects();

  // Log page view for analytics
  React.useEffect(() => {
    logBridge.info(LogCategory.UI, 'Home page viewed', {
      details: {
        authenticated: isAuthenticated,
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      }
    });
  }, [isAuthenticated, user]);

  // Get primary effect if enabled
  const primaryEffectEnabled = isEffectEnabled(ThemeEffectType.CYBER) || 
                              isEffectEnabled(ThemeEffectType.NEON);
  
  // Define the content to be rendered either as fallback or as children
  const homeContent = (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
              primaryEffectEnabled && "cyber-text gradient-text"
            )}>
              The Ultimate 3D Printing Community
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Connect with fellow makers, showcase your builds, and elevate your 3D printing experience
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => navigate("/builds/explore")} 
                className={cn(
                  primaryEffectEnabled && "cyber-glow"
                )}
              >
                Explore Builds
              </Button>
              {!isAuthenticated && (
                <Button 
                  onClick={() => navigate("/auth")} 
                  variant="outline"
                  className="border border-primary/30"
                >
                  Join Community
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl -top-20 -left-20" />
          <div className="absolute w-96 h-96 rounded-full bg-secondary/5 blur-3xl -bottom-40 -right-20" />
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Community Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Parts Database" 
              description="Browse our extensive collection of 3D printer parts with reviews and compatibility info."
              icon="database"
            />
            <FeatureCard 
              title="Build Showcase" 
              description="Share your custom builds and modifications with the community."
              icon="layers"
            />
            <FeatureCard 
              title="Expert Guides" 
              description="Learn from detailed tutorials and guides created by veteran makers."
              icon="book-open"
            />
          </div>
        </div>
      </section>

      {/* Featured builds section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Builds</h2>
            <p className="text-muted-foreground">Check out some amazing projects from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BuildCard
              title="Voron 2.4 Build"
              description="CoreXY precision printer with full enclosure"
              image="/images/placeholder-1.jpg"
              href="/builds/voron-24"
            />
            <BuildCard
              title="Ender 3 Modifications"
              description="Upgraded firmware and custom parts"
              image="/images/placeholder-2.jpg"
              href="/builds/ender-3-mods"
            />
            <BuildCard
              title="Custom Resin Printer"
              description="DIY SLA printer with 4K resolution"
              image="/images/placeholder-3.jpg"
              href="/builds/diy-resin"
            />
          </div>
        </div>
      </section>
    </div>
  );
  
  return (
    <LayoutBootstrap 
      type="page" 
      scope="site" 
      fallback={homeContent}
    >
      {homeContent}
    </LayoutBootstrap>
  );
};

// Feature card component
const FeatureCard = ({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: string;
}) => (
  <div className="p-6 bg-card rounded-lg border border-primary/10 text-center">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <i className={`icon-${icon} text-primary`}></i>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Build card component
const BuildCard = ({ title, description, image, href }: { 
  title: string; 
  description: string; 
  image: string; 
  href: string;
}) => (
  <a 
    href={href}
    className="block overflow-hidden rounded-lg border border-primary/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group relative"
  >
    <div className="h-48 overflow-hidden">
      <div 
        className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-all duration-300" />
  </a>
);

export default PublicHome;
