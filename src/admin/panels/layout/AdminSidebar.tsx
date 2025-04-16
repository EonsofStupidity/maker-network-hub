
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '@/shared/types/core/rbac.types';
import { RBACBridge } from '@/rbac/bridge';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
}

function SidebarItem({ to, label, icon, isCollapsed = false }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
          ${isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        title={isCollapsed ? label : undefined}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}

export function AdminSidebar() {
  const location = useLocation();
  const hasAdminAccess = RBACBridge.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  const isSuperAdmin = RBACBridge.hasRole(ROLES.SUPER_ADMIN);
  
  if (!hasAdminAccess) return null;
  
  return (
    <nav className="w-64 flex flex-col border-r min-h-screen bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Admin Panel</h2>
      </div>
      
      <div className="flex-1 p-2">
        <ul className="space-y-1">
          <SidebarItem 
            to="/admin" 
            label="Dashboard" 
            icon={<LayoutDashboard size={18} />} 
          />
          
          <SidebarItem 
            to="/admin/users" 
            label="Users" 
            icon={<Users size={18} />} 
          />
          
          <SidebarItem 
            to="/admin/content" 
            label="Content" 
            icon={<FileText size={18} />} 
          />
          
          {isSuperAdmin && (
            <SidebarItem 
              to="/admin/settings" 
              label="Settings" 
              icon={<Settings size={18} />} 
            />
          )}
        </ul>
      </div>
    </nav>
  );
}
