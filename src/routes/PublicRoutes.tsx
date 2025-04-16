
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import { MainLayout } from "@/layouts/MainLayout";
import { PublicHome } from "@/pages/public/Home";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { AdminLayout } from "@/admin/panels/layout/AdminLayout";
import { AdminDashboard } from "@/admin/panels/AdminDashboard";
import { WithRoleProtection } from "@/auth/components/WithRoleProtection";

export const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PublicHome />} />
        <Route path="/parts" element={<div>Parts Database</div>} />
        <Route path="/builds" element={<div>Community Builds</div>} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/" /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
      } />

      {/* Protected admin routes */}
      <Route path="/admin" element={
        <WithRoleProtection allowedRoles={['admin', 'super_admin']}>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </WithRoleProtection>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
