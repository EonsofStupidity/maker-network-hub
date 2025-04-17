
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogOut, Shield, User } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';
import { LogLevel, LogCategory } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';
import { RBACBridge } from '@/rbac/bridge';

export default function AuthSection() {
  const { isAuthenticated, user, logout, status } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasAdminAccess = RBACBridge.hasAdminAccess();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out.",
      });
    }
  };

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  return isAuthenticated ? (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-sm text-[#00F0FF]">
        {user?.email}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#00F0FF]/10 text-[#00F0FF] hover:text-[#FF2D6E]"
          onClick={() => navigate('/profile')}
        >
          <User size={18} />
        </Button>
        
        {hasAdminAccess && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[#00F0FF]/10 text-[#00F0FF] hover:text-[#FF2D6E]"
            onClick={() => navigate('/admin')}
          >
            <Shield size={18} />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#00F0FF]/10 text-[#00F0FF] hover:text-[#FF2D6E]"
          onClick={handleLogout}
        >
          <LogOut size={18} />
        </Button>
      </div>
    </div>
  ) : (
    <Button 
      onClick={() => navigate('/auth')}
      className="bg-[#00F0FF]/80 text-black hover:bg-[#00F0FF] hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
    >
      Login
    </Button>
  );
}
