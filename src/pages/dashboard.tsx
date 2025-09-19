/**
 * Dashboard Redirect
 * Redirects to unified Match Central dashboard
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to consolidated Match Central
    router.replace('/match-central');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}