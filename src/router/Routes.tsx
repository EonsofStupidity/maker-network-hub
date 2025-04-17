
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { AdminRoutes } from '@/routes/AdminRoutes';
import { AppRoutes } from '@/routes/AppRoutes';

// Lazy-loaded routes
const Home = React.lazy(() => import('@/pages/Home'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout children={<Home />} />} />
        
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
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
