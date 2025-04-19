
import React, { Suspense } from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { AdminRoutes } from '@/routes/AdminRoutes';
import { AppRoutes } from '@/routes/AppRoutes';
import BasicPage from '@/pages/BasicPage';

// Feature-rich HomePage with proper loading
const HomePage = React.lazy(() => import('@/app/home/HomePage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export function Routes() {
  return (
    <Suspense fallback={<BasicPage />}>
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Protected app routes */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          }
        />
        
        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Suspense>
  );
}
