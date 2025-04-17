
import React from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: boolean;
  footer?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header = true,
  footer = true
}) => {
  // Use theme properties with fallbacks
  const currentTheme = useThemeStore(state => state);
  const isDark = currentTheme?.isDark || false;
  const primaryColor = currentTheme?.primaryColor || '#3b82f6';
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      style={{
        '--primary-color': primaryColor,
      } as React.CSSProperties}
    >
      {header && <Header />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {footer && <Footer />}
    </div>
  );
};

export default MainLayout;
