/**
 * 📱 Mobile App Redirect
 * Redirects /mobile-app to the main mobile site at /mobile-wow
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MobileAppRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main mobile experience
    router.replace('/mobile-wow');
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#972A4C] mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Redirecting to mobile site...</p>
      </div>
    </div>
  );
}