
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header/index';
import { Footer } from '@/components/Footer/index';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
