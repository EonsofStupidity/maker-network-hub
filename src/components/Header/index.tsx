
import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { Info, Home, Settings, Menu } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { themeBridge } from '@/bridges/theme/bridge';

export function Header() {
  const { 
    isConnected, 
    hasInitiallyChecked, 
    retryCount,
    lastChecked 
  } = useSupabaseStatus(true, 10000, 5);
  
  const isDarkMode = themeBridge.isDarkMode();
  const toggleTheme = () => {
    themeBridge.toggleDarkMode();
    window.document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span className="font-bold text-xl">MakersIMPULSE</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/app" className="flex items-center gap-1 hover:text-primary">
                    <Menu className="h-4 w-4" />
                    <span>App</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="flex items-center gap-1 hover:text-primary">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </li>
              </ul>
            </nav>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Info className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-destructive'}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isConnected
                      ? `Connected to database (last checked: ${lastChecked?.toLocaleTimeString() || 'Never'})`
                      : `No database connection (retry: ${retryCount})`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
      
      {hasInitiallyChecked && !isConnected && (
        <Alert variant="destructive" className="rounded-none">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Connection to database lost. {retryCount > 0 ? `Retrying (${retryCount})...` : 'Retrying...'}
          </AlertDescription>
        </Alert>
      )}
    </header>
  );
}

export default Header;
