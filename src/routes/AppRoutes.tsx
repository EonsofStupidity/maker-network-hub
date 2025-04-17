
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<div>App Dashboard</div>} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;
