
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
        }
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication error');
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-darkgray-900">
      {error ? (
        <div className="text-center p-8 bg-white dark:bg-darkgray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-darkgray-800 rounded-lg shadow-md">
          <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mb-4">Authenticating...</h2>
          <p className="text-gray-700 dark:text-gray-300">Please wait while we complete the authentication process.</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
