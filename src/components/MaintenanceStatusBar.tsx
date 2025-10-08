/**
 * Maintenance Status Bar
 * Shows maintenance status only for site admins and content editors
 */

import React from 'react';
import { useAuth } from './SecureAuth';
import MaintenanceAwareNavigation from './MaintenanceAwareNavigation';

export default function MaintenanceStatusBar() {
  const { user, isAdmin } = useAuth();

  // Only show for logged-in users with admin or content editor roles
  const canViewMaintenance = user && (
    isAdmin || 
    user.role === 'admin' || 
    user.role === 'content_editor' ||
    user.role === 'site_admin'
  );

  if (!canViewMaintenance) {
    return null;
  }

  return (
    <MaintenanceAwareNavigation>
      {({ stats }) => (
        stats.disabled > 0 && (
          <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start">
              <div className="flex items-center space-x-2 text-orange-800">
                <span className="text-lg">🚧</span>
                <span className="text-xs md:text-sm font-medium">
                  {stats.disabled} page{stats.disabled !== 1 ? 's' : ''} currently under maintenance
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </MaintenanceAwareNavigation>
  );
}