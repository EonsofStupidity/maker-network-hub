
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Page } from '@/layouts/Page';
import { LoadingState } from '@/shared/ui/loading-state';
import { PublicHome } from '@/pages/public/Home';
import { ROLES } from '@/shared/types/core/rbac.types';

// Lazy-loaded pages for better performance
const LoginPage = lazy(() => import('@/app/auth/LoginPage'));
const BuildsExplorer = lazy(() => import('@/pages/builds/Explorer'));
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFound'));

// Main component that holds all routes
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PublicHome />} />
        
        {/* Auth routes */}
        <Route path="/auth" element={
          <Suspense fallback={<LoadingState type="card" count={1} />}>
            <Page title="Authentication" layoutType="auth" layoutScope="site">
              <LoginPage />
            </Page>
          </Suspense>
        } />
        
        {/* Public routes */}
        <Route path="/builds/explore" element={
          <Suspense fallback={<LoadingState type="card" count={3} />}>
            <Page title="Explore Builds" description="Discover community builds and modifications">
              <BuildsExplorer />
            </Page>
          </Suspense>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <Suspense fallback={<LoadingState type="card" count={1} />}>
            <Page 
              title="Admin Dashboard" 
              layoutType="admin" 
              layoutScope="admin"
              requiresAuth={true}
              requiresRole={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}
            >
              <AdminDashboard />
            </Page>
          </Suspense>
        } />
        
        {/* Catch all/404 */}
        <Route path="*" element={
          <Suspense fallback={<LoadingState type="text" count={1} />}>
            <Page title="Page Not Found">
              <NotFoundPage />
            </Page>
          </Suspense>
        } />
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
