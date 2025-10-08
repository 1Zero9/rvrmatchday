/**
 * Hook for checking page maintenance status for navigation
 * Used to show/hide links based on maintenance status
 */

import { useState, useEffect } from 'react';

interface PageMaintenanceStatus {
  [path: string]: {
    is_enabled: boolean;
    maintenance_reason?: string;
    disabled_at?: string;
    disabled_by?: string;
  };
}

export function usePageMaintenanceStatus(paths: string[]) {
  const [statuses, setStatuses] = useState<PageMaintenanceStatus>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paths.length === 0) {
      setLoading(false);
      return;
    }

    checkMultiplePages();
  }, [paths.join(',')]); // Only re-run when paths array changes

  const checkMultiplePages = async () => {
    try {
      setLoading(true);
      
      // Check all paths in parallel
      const promises = paths.map(async (path) => {
        try {
          const response = await fetch(`/api/maintenance/check?path=${encodeURIComponent(path)}`);
          if (response.ok) {
            const data = await response.json();
            return { path, data };
          }
          return { path, data: { is_enabled: true } }; // Default to enabled on error
        } catch (error) {
          console.warn(`Failed to check maintenance for ${path}:`, error);
          return { path, data: { is_enabled: true } }; // Default to enabled on error
        }
      });

      const results = await Promise.all(promises);
      
      // Build status object
      const newStatuses: PageMaintenanceStatus = {};
      results.forEach(({ path, data }) => {
        newStatuses[path] = data;
      });
      
      setStatuses(newStatuses);
    } catch (error) {
      console.error('Error checking maintenance statuses:', error);
      // Default all to enabled if there's a global error
      const defaultStatuses: PageMaintenanceStatus = {};
      paths.forEach(path => {
        defaultStatuses[path] = { is_enabled: true };
      });
      setStatuses(defaultStatuses);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isPageEnabled = (path: string): boolean => {
    return statuses[path]?.is_enabled ?? true; // Default to enabled if not found
  };

  const getMaintenanceInfo = (path: string) => {
    return statuses[path] || null;
  };

  const refresh = () => {
    checkMultiplePages();
  };

  return {
    statuses,
    loading,
    isPageEnabled,
    getMaintenanceInfo,
    refresh
  };
}

// Predefined sets of pages for common use cases
export const MAIN_NAVIGATION_PATHS = [
  '/home',
  '/about',
  '/teams',
  '/matches',
  '/volunteer',
  '/contact',
  '/gallery'
];

export const ABOUT_SUBMENU_PATHS = [
  '/about/our-story',
  '/club/values', 
  '/about/facilities',
  '/about/achievements'
];

export const TEAMS_SUBMENU_PATHS = [
  '/teams/boys',
  '/teams/girls',
  '/teams/management',
  '/teams/academy'
];

export const CONTACT_SUBMENU_PATHS = [
  '/contact/directions',
  '/join/trials',
  '/join/inclusive',
  '/get-involved/coaching'
];

export const ALL_NAVIGATION_PATHS = [
  ...MAIN_NAVIGATION_PATHS,
  ...ABOUT_SUBMENU_PATHS,
  ...TEAMS_SUBMENU_PATHS,
  ...CONTACT_SUBMENU_PATHS
];