
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '@/shared/types/shared.types';
import { RBACBridge } from '@/rbac/bridge';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { cn } from '@/shared/utils/cn';

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
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
        title={isCollapsed ? label : undefined}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}

export function AdminSidebar() {
  const { sidebarOpen, toggleSidebar } = useAdminStore();
  
  // Only show admin items for admin users
  const hasAdminAccess = RBACBridge.hasAdminAccess();
  const isSuperAdmin = RBACBridge.hasRole(ROLES.super_admin);
  
  if (!hasAdminAccess) return null;
  
  return (
    <div className={cn(
      "flex flex-col border-r min-h-screen bg-background transition-all duration-300",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b flex justify-between items-center">
        {sidebarOpen && <h2 className="font-semibold">Admin Panel</h2>}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-muted"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <SidebarItem 
            to="/admin" 
            label="Dashboard" 
            icon={<LayoutDashboard size={18} />} 
            isCollapsed={!sidebarOpen}
          />
          
          <SidebarItem 
            to="/admin/users" 
            label="Users" 
            icon={<Users size={18} />} 
            isCollapsed={!sidebarOpen}
          />
          
          <SidebarItem 
            to="/admin/content" 
            label="Content" 
            icon={<FileText size={18} />} 
            isCollapsed={!sidebarOpen}
          />
          
          {isSuperAdmin && (
            <SidebarItem 
              to="/admin/settings" 
              label="Settings" 
              icon={<Settings size={18} />} 
              isCollapsed={!sidebarOpen}
            />
          )}
        </ul>
      </nav>
      
      {sidebarOpen && (
        <div className="p-4 border-t text-xs text-muted-foreground">
          Admin v1.0.0
        </div>
      )}
    </div>
  );
}
