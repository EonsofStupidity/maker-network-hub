
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

// Lazy-loaded routes
const Auth = React.lazy(() => import('@/pages/Auth'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Privacy = React.lazy(() => import('@/pages/Privacy'));
const Terms = React.lazy(() => import('@/pages/Terms'));

export function PublicRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<MainLayout children={<Auth />} />} />
      <Route path="/about" element={<MainLayout children={<About />} />} />
      <Route path="/contact" element={<MainLayout children={<Contact />} />} />
      <Route path="/privacy" element={<MainLayout children={<Privacy />} />} />
      <Route path="/terms" element={<MainLayout children={<Terms />} />} />
    </Routes>
  );
}

export default PublicRoutes;
