/**
 * Admin Page - Redirects to Unified Admin Dashboard
 * Automatically redirects users to the new single-window admin interface
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RequireAuth } from '../components/SecureAuth';

function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified admin dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Admin Dashboard</h2>
        <p className="text-gray-600">Redirecting to the unified admin interface...</p>
      </div>
    </div>
  );
}

// Secure wrapper for admin page
export default function AdminPage() {
  return (
    <RequireAuth>
      <AdminRedirect />
    </RequireAuth>
  );
}