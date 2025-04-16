import React, { useEffect, useState } from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { useAuthStore } from '@/auth/store/auth.store';
import { ROLES } from '@/shared/types/core/rbac.types';

interface AdminOverlayProps {
  enabled?: boolean;
}

/**
 * Debug overlay for admin users
 * Displays useful debugging information
 */
export const AdminOverlay: React.FC<AdminOverlayProps> = ({ enabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const { user } = useAuthStore();
  
  // Only show for admin users
  const isAllowed = RBACBridge.hasRole(ROLES.admin);
  
  useEffect(() => {
    if (!enabled || !isAllowed) return;
    
    // Collect debug info
    const info = {
      roles: RBACBridge.getRoles(),
      userId: user?.id,
      email: user?.email,
      isAdmin: RBACBridge.hasRole(ROLES.admin),
      isSuperAdmin: RBACBridge.isSuperAdmin(),
      authStatus: useAuthStore.getState().status,
    };
    
    setDebugInfo(info);
    
    // Listen for keyboard shortcut (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        setVisible(v => !v);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isAllowed, user]);
  
  if (!enabled || !isAllowed || !visible) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black/80 text-white text-xs font-mono z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Admin Debug</h3>
        <button 
          onClick={() => setVisible(false)}
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
