
import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/shared/ui/alert';

export function Header() {
  const { isConnected } = useSupabaseStatus(true, 10000); // Check every 10s

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">MakersIMPULSE</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/app" className="hover:text-primary">App</Link></li>
              <li><Link to="/admin" className="hover:text-primary">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      {!isConnected && (
        <Alert variant="destructive" className="rounded-none">
          <AlertCircle className="h-4 w-4" />
          <span>Connection to database lost. Retrying...</span>
        </Alert>
      )}
    </header>
  );
}

export default Header;
