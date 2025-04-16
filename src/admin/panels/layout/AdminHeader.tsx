
import React from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useLogger } from '@/logging/hooks/use-logger';

interface AdminHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export function AdminHeader({ title = 'Admin Dashboard', children }: AdminHeaderProps) {
  const logger = useLogger('AdminHeader', LogCategory.ADMIN);
  const isSuperAdmin = RBACBridge.isSuperAdmin();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isSuperAdmin && (
          <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded">
            Super Admin
          </span>
        )}
      </div>
      {children}
    </header>
  );
}
