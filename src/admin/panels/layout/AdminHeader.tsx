
import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserAvatar } from '@/shared/ui/user-avatar';

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navigateToSection = (path: string) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  // Get user's first initial for avatar fallback
  const userInitial = user?.userMetadata?.full_name?.[0] || 'U';
  const displayName = user?.userMetadata?.full_name as string || "Admin User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r border-primary/10">
            {/* Mobile sidebar content will go here */}
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          className="hidden lg:flex"
          size="icon"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        {title && (
          <h1 className="text-xl font-semibold">{title}</h1>
        )}
      </div>

      {/* User menu */}
      <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex items-center gap-2 rounded-full px-2"
          >
            <UserAvatar
              user={user ? {
                id: user.id,
                email: user.email || '',
                display_name: displayName,
                user_metadata: user.userMetadata
              } : undefined}
              fallbackText={userInitial}
              size="sm"
              className="h-8 w-8"
            />
            <span className="hidden text-sm font-medium md:inline-block">
              {displayName}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                userMenuOpen && 'rotate-180'
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigateToSection('/admin/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
