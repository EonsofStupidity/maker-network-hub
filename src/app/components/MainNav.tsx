
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/shared/ui/button";
import { useRbac } from "@/hooks/use-rbac";
import { ROLES } from "@/shared/types/core/rbac.types";

export const MainNav: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { hasRole } = useRbac();
  const isAdmin = hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold mr-6">
              MakersIMPULSE
            </Link>
            <nav className="hidden md:flex space-x-4">
              <NavLink to="/parts">Parts DB</NavLink>
              <NavLink to="/builds/explore">Builds</NavLink>
              <NavLink to="/guides">Guides</NavLink>
              <NavLink to="/forum">Forum</NavLink>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <ProfileButton user={user} />
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
    >
      {children}
    </Link>
  );
};

interface ProfileButtonProps {
  user: any;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ user }) => {
  return (
    <Link
      to="/profile"
      className="flex items-center space-x-2 hover:bg-accent/50 px-3 py-2 rounded-md transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {user?.display_name?.[0] || user?.email?.[0] || "U"}
          </span>
        )}
      </div>
      <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
        {user?.display_name || user?.email || "User"}
      </span>
    </Link>
  );
};

export default MainNav;
