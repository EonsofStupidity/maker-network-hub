
import React, { useEffect, useState } from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { useAuthStore } from '@/auth/store/auth.store';
import { ROLES } from '@/shared/types/core/rbac.types';
import { useToast } from '@/shared/hooks/use-toast';
import { useAdminKeyboardShortcuts } from '@/admin/hooks/useAdminKeyboardShortcuts';

interface AdminOverlayProps {
  enabled?: boolean;
}

export const AdminOverlay: React.FC<AdminOverlayProps> = ({ enabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  // Initialize keyboard shortcuts
  useAdminKeyboardShortcuts();
  
  // Only show for admin users
  const isAllowed = RBACBridge.hasRole(ROLES.ADMIN);
  
  useEffect(() => {
    if (!enabled || !isAllowed) return;
    
    // Collect debug info
    const info = {
      roles: RBACBridge.getRoles(),
      userId: user?.id,
      email: user?.email,
      isAdmin: RBACBridge.hasRole(ROLES.ADMIN),
      isSuperAdmin: RBACBridge.isSuperAdmin(),
      authStatus: useAuthStore.getState().status,
    };
    
    setDebugInfo(info);
    
  }, [enabled, isAllowed, user]);
  
  if (!enabled || !isAllowed || !visible) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black/80 text-white text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Admin Debug</h3>
        <button 
          onClick={() => {
            setVisible(false);
            toast({
              title: "Debug Overlay Hidden",
              description: "Press Ctrl+Shift+D to show again"
            });
          }}
          className="text-white hover:text-red-400"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key}>
            <span className="text-gray-400">{key}:</span>{' '}
            <span className="text-green-400">
              {Array.isArray(value) 
                ? value.join(', ')
                : String(value)
              }
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => setInspectMode(!inspectMode)}
          className={`px-2 py-1 text-xs rounded ${inspectMode ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {inspectMode ? 'Exit Inspect' : 'Inspect'}
        </button>
      </div>
    </div>
  );
};

