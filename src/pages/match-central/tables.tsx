/**
 * Tables Redirect
 * Redirects to unified Match Central dashboard - Tables tab
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Tables() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to consolidated Match Central with tables tab
    router.replace('/match-central#tables');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Match Central...</p>
      </div>
    </div>
  );
}