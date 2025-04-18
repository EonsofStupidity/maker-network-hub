
import { useNavigate } from 'react-router-dom';

/**
 * UnauthorizedError component
 * Displays an error message when user lacks required permissions
 */
export function UnauthorizedError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
} 
