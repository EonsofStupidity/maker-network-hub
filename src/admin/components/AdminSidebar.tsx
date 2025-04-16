
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '@/shared/types/core/rbac.types';
import { RBACBridge } from '@/rbac/bridge';

interface SidebarItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  current?: boolean;
}

function SidebarItem({ to, label, icon, current }: SidebarItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md text-sm
          ${current ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
        `}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const hasAdminAccess = RBACBridge.hasAdminAccess();
  const isSuperAdmin = RBACBridge.hasRole(ROLES.SUPER_ADMIN);
  
  if (!hasAdminAccess) return null;
  
  return (
    <div className="w-64 flex flex-col border-r min-h-screen bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <SidebarItem 
            to="/admin" 
            label="Dashboard" 
            current={location.pathname === '/admin'} 
          />
          <SidebarItem 
            to="/admin/users" 
            label="Users" 
            current={location.pathname === '/admin/users'} 
          />
          <SidebarItem 
            to="/admin/content" 
            label="Content" 
            current={location.pathname === '/admin/content'} 
          />
          {isSuperAdmin && (
            <SidebarItem 
              to="/admin/settings" 
              label="Settings" 
              current={location.pathname === '/admin/settings'} 
            />
          )}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
