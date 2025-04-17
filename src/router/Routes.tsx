
import React, { Suspense } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { AdminRoutes } from '@/routes/AdminRoutes';
import { AppRoutes as ApplicationRoutes } from '@/routes/AppRoutes';

// Lazy-loaded routes
const Home = React.lazy(() => import('@/pages/Home'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export function Routes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Protected app routes */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <ApplicationRoutes />
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

export default Routes;
