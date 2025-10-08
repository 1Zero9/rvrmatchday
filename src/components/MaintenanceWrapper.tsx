/**
 * Maintenance Wrapper Component
 * Automatically checks if a page is under maintenance and shows maintenance page if disabled
 */

import React from 'react';
import { useRouter } from 'next/router';
import MaintenancePage, { usePageMaintenance } from './MaintenancePage';
import { useAuth } from './SecureAuth';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
  pagePath?: string; // Optional - will use router path if not provided
  fallbackTitle?: string;
}

export default function MaintenanceWrapper({ 
  children, 
  pagePath,
  fallbackTitle = "This Page"
}: MaintenanceWrapperProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const currentPath = pagePath || router.asPath.split('?')[0]; // Remove query params
  
  const { isUnderMaintenance, maintenanceInfo, loading } = usePageMaintenance(currentPath);

  // Show loading state while checking maintenance status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show maintenance page if the page is under maintenance
  if (isUnderMaintenance) {
    // Admin users get a banner but can access the page
    if (isAdmin) {
      return (
        <>
          {/* Admin Maintenance Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg relative z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚧</span>
                  <div>
                    <p className="font-bold">ADMIN VIEW: Page Under Maintenance</p>
                    <p className="text-sm text-orange-100">
                      {maintenanceInfo?.reason || "This page is currently disabled for regular users"}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-orange-100">
                  <p>Disabled: {maintenanceInfo?.disabled_at ? new Date(maintenanceInfo.disabled_at).toLocaleDateString() : 'Unknown'}</p>
                  <p>By: {maintenanceInfo?.disabled_by || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Normal page content for admin */}
          <div className="blur-none">{children}</div>
        </>
      );
    }
    
    // Regular users see the maintenance page
    return (
      <MaintenancePage
        pageName={fallbackTitle}
        reason={maintenanceInfo?.reason}
        lastUpdated={maintenanceInfo?.disabled_at}
      />
    );
  }

  // Page is enabled - render normally
  return <>{children}</>;
}

// Higher-order component for easy wrapping
export function withMaintenance<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    pagePath?: string;
    fallbackTitle?: string;
  }
) {
  return function WrappedComponent(props: P) {
    return (
      <MaintenanceWrapper 
        pagePath={options?.pagePath}
        fallbackTitle={options?.fallbackTitle}
      >
        <Component {...props} />
      </MaintenanceWrapper>
    );
  };
}