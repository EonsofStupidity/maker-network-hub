
import { useCallback, useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useRbac } from '@/hooks/use-rbac';

export function useAdminKeyboardShortcuts() {
  const { hasAdminAccess, isSuperAdmin } = useRbac();
  const { toggleSidebar, toggleEditMode } = useAdminStore();
  const logger = useLogger('AdminKeyboardShortcuts', LogCategory.ADMIN);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Only handle keyboard shortcuts if user has admin access
    if (!hasAdminAccess()) return;

    // Ctrl + Shift + D - Toggle admin debug overlay
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyD' && isSuperAdmin()) {
      logger.info('Admin debug overlay toggled via keyboard shortcut');
      useAdminStore.setState(state => ({ showDebugOverlay: !state.showDebugOverlay }));
    }

    // Ctrl + Shift + E - Toggle edit mode (admin only)
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
      logger.info('Edit mode toggled via keyboard shortcut');
      toggleEditMode();
    }

    // Ctrl + Shift + B - Toggle sidebar
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyB') {
      logger.info('Sidebar toggled via keyboard shortcut');
      toggleSidebar();
    }
  }, [hasAdminAccess, isSuperAdmin, toggleSidebar, toggleEditMode, logger]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
