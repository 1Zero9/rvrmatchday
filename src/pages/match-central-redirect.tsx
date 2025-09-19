/**
 * Match Central Redirect
 * Redirects to secure authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MatchCentralRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to secure login with return path
    router.replace('/login?returnTo=/match-central-secure');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Redirecting to secure login...</p>
      </div>
    </div>
  );
}