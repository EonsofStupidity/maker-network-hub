
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/index';
import { Footer } from '../components/Footer/index';
import { themeBridge } from '@/bridges/theme/bridge';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Apply theme styles based on theme bridge
  useEffect(() => {
    const theme = themeBridge.getActiveTheme();
    
    if (theme) {
      // Apply theme colors to document root
      document.documentElement.style.setProperty('--primary-color', theme.colors?.primary || theme.primaryColor || '');
      document.documentElement.style.setProperty('--background-color', theme.colors?.background || theme.backgroundColor || '');
      document.documentElement.style.setProperty('--text-color', theme.colors?.text || theme.textColor || '');
      
      // Apply dark mode class if theme is dark
      if (theme.isDark || theme.dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    return () => {
      // Cleanup
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--background-color');
      document.documentElement.style.removeProperty('--text-color');
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
