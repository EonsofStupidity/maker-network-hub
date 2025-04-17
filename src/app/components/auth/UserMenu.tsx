import { useState, memo, useCallback } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useLogger } from "@/logging/hooks/use-logger";
import { LogCategory, LogLevel } from "@/shared/types/core/logging.types";
import { authBridge } from "@/auth/lib/AuthBridgeImpl";
import { RBACBridge } from "@/shared/bridges/RBACBridge";
import { Button } from "@/shared/ui/button";
import { UserMenuSheet } from "./UserMenuSheet";
import { useAuthStore } from "@/auth/store/auth.store";
import { logger } from "@/logging/logger.service";
import { UserRole } from "@/shared/types/core/rbac.types";

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const loggingContext = useLogger("UserMenu", LogCategory.AUTH);
  
  const user = useAuthStore(state => state.user);
  const roles = RBACBridge.getRoles();
  
  const handleOpenUserMenu = useCallback(() => {
    setIsMenuOpen(true);
    logger.log(LogLevel.DEBUG, LogCategory.AUTH, 'User menu opened', { 
      source: 'UserMenu',
      roles 
    });
  }, [roles]);
  
  const handleShowProfile = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  
  const handleLogout = useCallback(async () => {
    try {
      logger.log(LogLevel.INFO, LogCategory.AUTH, "User logging out", { source: 'UserMenu' });
      await authBridge.signOut();
      logger.log(LogLevel.INFO, LogCategory.AUTH, "User logged out successfully", { source: 'UserMenu' });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, "Error logging out", { 
        source: 'UserMenu',
        message: error?.message 
      });
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    }
  }, [toast]);

  if (!user) {
    return null;
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const userAvatar = user.avatarUrl || '';

  return (
    <>
      <Button
        onClick={handleOpenUserMenu}
        variant="ghost"
        className="rounded-full p-1 transition hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
      </Button>
      
      <UserMenuSheet
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        userDisplayName={displayName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onShowProfile={handleShowProfile}
        onLogout={handleLogout}
        roles={roles}
      />
    </>
  );
}
