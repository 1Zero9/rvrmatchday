/**
 * Fixtures Page
 * Redirects to unified Match Central dashboard - Fixtures tab
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Fixtures() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to matchday page for fixtures
    router.replace('/matchday');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Matchday...</p>
      </div>
    </div>
  );
}