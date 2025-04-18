
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingChat } from '@/chat/components/FloatingChat';
import { themeBridge } from '@/bridges/theme/bridge';

export function MainLayout({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    const theme = themeBridge.getActiveTheme();
    if (theme) {
      document.documentElement.classList.toggle('dark', theme.isDark);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}

export default MainLayout;
