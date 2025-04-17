
import React, { useState, useEffect } from 'react';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ThemeEffectType } from '@/shared/types/shared.types';
import { cn } from '@/shared/utils/cn';
import { loadImage } from '@/shared/utils/assetLoader';

// Define build card component separately
interface BuildCardProps {
  title: string;
  description: string;
  imagePath: string;
  href: string;
}

const BuildCard = ({ title, description, imagePath, href }: BuildCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>('/images/placeholder.jpg');
  
  useEffect(() => {
    // Load the image with fallbacks
    loadImage(imagePath, 'app/feat_3dpbuilds', 'placeholder1')
      .then(url => setImageUrl(url))
      .catch(() => setImageUrl('/images/placeholder.jpg'));
  }, [imagePath]);
  
  return (
    <a 
      href={href}
      className="block overflow-hidden rounded-lg border border-primary/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group relative"
    >
      <div className="h-48 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-all duration-300" />
    </a>
  );
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
              "cyber-text gradient-text"
            )}>
              The Ultimate 3D Printing Community
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Connect with fellow makers, showcase your builds, and elevate your 3D printing experience
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/builds/explore" 
                className={cn(
                  "px-8 py-3 rounded-md bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors cyber-glow"
                )}
              >
                Explore Builds
              </a>
              <a 
                href="/auth" 
                className={cn(
                  "px-8 py-3 rounded-md bg-secondary/10 text-primary",
                  "border border-primary/30 hover:bg-primary/10 transition-colors"
                )}
              >
                Join Community
              </a>
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
      <FeaturesSection />

      {/* Showcase section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Builds</h2>
            <p className="text-muted-foreground">Check out some amazing projects from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured builds with local paths */}
            <BuildCard
              title="Voron 2.4 Build"
              description="CoreXY precision printer with full enclosure"
              imagePath="voron24.jpg"
              href="/builds/voron-24"
            />
            <BuildCard
              title="Ender 3 Modifications"
              description="Upgraded firmware and custom parts"
              imagePath="ender3.jpg"
              href="/builds/ender-3-mods"
            />
            <BuildCard
              title="Custom Resin Printer"
              description="DIY SLA printer with 4K resolution"
              imagePath="resin.jpg"
              href="/builds/diy-resin"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
