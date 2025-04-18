
import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { AlertCircle, Wifi, WifiOff, CornerRightDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { themeBridge } from '@/bridges/theme/bridge';

export function Header() {
  const { 
    isConnected, 
    hasInitiallyChecked, 
    retryCount,
    lastCheckedAt 
  } = useSupabaseStatus(true, 10000, 5);
  
  // Get theme mode
  const isDarkMode = themeBridge.isDarkMode();
  const toggleTheme = () => {
    themeBridge.toggleDarkMode();
    // Force re-render by using a state update
    window.document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">MakersIMPULSE</Link>
          
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex space-x-4">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/app" className="hover:text-primary">App</Link></li>
                <li><Link to="/admin" className="hover:text-primary">Admin</Link></li>
              </ul>
            </nav>
            
            {/* Connection status indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {isConnected ? (
                      <Wifi size={18} className="text-green-500" />
                    ) : (
                      <WifiOff size={18} className="text-destructive" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isConnected
                      ? `Connected to database (last checked: ${new Date(lastCheckedAt).toLocaleTimeString()})`
                      : `No database connection (retry: ${retryCount})`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Theme toggle button */}
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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connection to database lost. {retryCount > 0 ? `Retrying (${retryCount})...` : 'Retrying...'}
          </AlertDescription>
        </Alert>
      )}
    </header>
  );
}

export default Header;
