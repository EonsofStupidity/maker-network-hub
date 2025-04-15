
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/auth/hooks/useAuth";
import { useRbac } from "@/hooks/use-rbac";

export const MainNav = () => {
  const { isAuthenticated, signOut } = useAuth();
  const { hasAdminAccess } = useRbac();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              Parts DB
            </Link>
            <Link to="/parts" className="text-sm">
              Parts
            </Link>
            <Link to="/builds" className="text-sm">
              Builds
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {hasAdminAccess() && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="outline" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
