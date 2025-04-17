
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

export function AdminRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<div>Admin Dashboard</div>} />
      </Routes>
    </MainLayout>
  );
}

export default AdminRoutes;
