/**
 * Dynamic Navigation Component
 * Reads navigation structure from the page management database
 */

import React, { useState, useEffect } from 'react';
import MaintenanceAwareLink from './MaintenanceAwareLink';
import { usePageMaintenanceStatus } from '../hooks/usePageMaintenanceStatus';

interface NavigationItem {
  id: string;
  href: string;
  label: string;
  icon?: string;
  menu_group: string;
  parent_id?: string;
  sort_order: number;
  is_visible: boolean;
  children?: NavigationItem[];
}

interface NavigationGroup {
  [groupName: string]: NavigationItem[];
}

interface DynamicNavigationProps {
  children: (renderProps: {
    NavItem: React.ComponentType<NavigationItemProps>;
    isLoading: boolean;
    navigationGroups: NavigationGroup;
    stats: {
      total: number;
      enabled: number;
      disabled: number;
    };
  }) => React.ReactNode;
}

interface NavigationItemProps {
  href: string;
  label: string;
  className?: string;
  isMaintenanceDisabled?: boolean;
  maintenanceReason?: string;
  onClick?: () => void;
}

function DynamicNavItem({ 
  href, 
  label, 
  className, 
  isMaintenanceDisabled, 
  maintenanceReason, 
  onClick 
}: NavigationItemProps) {
  return (
    <MaintenanceAwareLink
      href={href}
      className={className}
      isMaintenanceDisabled={isMaintenanceDisabled}
      maintenanceReason={maintenanceReason}
      onClick={onClick}
    >
      {label}
    </MaintenanceAwareLink>
  );
}

export default function DynamicNavigation({ children }: DynamicNavigationProps) {
  const [navigationGroups, setNavigationGroups] = useState<NavigationGroup>({});
  const [isLoading, setIsLoading] = useState(true);
  const [allPaths, setAllPaths] = useState<string[]>([]);

  // Load navigation structure from database
  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/pages?include_navigation=true&status=published');
        const data = await response.json();
        
        if (data.success) {
          const pages = data.data || [];
          const paths = pages.map((page: any) => page.slug);
          setAllPaths(paths);
          
          // Group pages by menu group
          const groups: NavigationGroup = {};
          
          pages.forEach((page: any) => {
            if (!page.is_visible) return; // Skip hidden pages
            
            const groupName = page.menu_group_name || 'other';
            if (!groups[groupName]) {
              groups[groupName] = [];
            }
            
            groups[groupName].push({
              id: page.id,
              href: page.slug,
              label: `${page.menu_group_icon || ''} ${page.title}`.trim(),
              icon: page.nav_icon,
              menu_group: groupName,
              parent_id: page.parent_id, // This is navigation_structure.parent_id
              sort_order: page.sort_order || 0,
              is_visible: page.is_visible
            });
          });
          
          // Sort items within each group by sort_order
          Object.keys(groups).forEach(groupName => {
            groups[groupName].sort((a, b) => a.sort_order - b.sort_order);
          });
          
          setNavigationGroups(groups);
        }
      } catch (error) {
        console.error('Error loading dynamic navigation:', error);
        // Fallback to empty navigation
        setNavigationGroups({});
      } finally {
        setIsLoading(false);
      }
    };

    loadNavigation();
  }, []);

  const { statuses, loading: maintenanceLoading, isPageEnabled, getMaintenanceInfo } = usePageMaintenanceStatus(allPaths);
  
  // Create enhanced NavItem that automatically includes maintenance status
  const EnhancedNavItem: React.ComponentType<NavigationItemProps> = (props) => {
    const isDisabled = !isPageEnabled(props.href);
    const maintenanceInfo = getMaintenanceInfo(props.href);
    
    return (
      <DynamicNavItem
        {...props}
        isMaintenanceDisabled={isDisabled}
        maintenanceReason={maintenanceInfo?.reason}
      />
    );
  };

  // Calculate stats
  const totalPages = allPaths.length;
  const enabledPages = allPaths.filter(path => isPageEnabled(path)).length;
  const disabledPages = totalPages - enabledPages;

  return (
    <>
      {children({
        NavItem: EnhancedNavItem,
        isLoading: isLoading || maintenanceLoading,
        navigationGroups,
        stats: {
          total: totalPages,
          enabled: enabledPages,
          disabled: disabledPages
        }
      })}
    </>
  );
}

// Helper function to get navigation items for a specific group with hierarchy
export function getNavigationGroup(navigationGroups: NavigationGroup, groupName: string): NavigationItem[] {
  const items = navigationGroups[groupName] || [];
  return buildNavigationHierarchy(items);
}

// Build hierarchical structure for navigation items
function buildNavigationHierarchy(items: NavigationItem[]): NavigationItem[] {
  // First, get all top-level items (no parent)
  const topLevel = items.filter(item => !item.parent_id);
  
  // Then, recursively add children
  return topLevel.map(item => ({
    ...item,
    children: getChildren(item.id, items)
  }));
}

// Recursively get children for a parent item
function getChildren(parentId: string, allItems: NavigationItem[]): NavigationItem[] {
  const children = allItems.filter(item => item.parent_id === parentId);
  return children.map(child => ({
    ...child,
    children: getChildren(child.id, allItems)
  }));
}

// Helper function to get all navigation groups
export function getAllNavigationGroups(navigationGroups: NavigationGroup): string[] {
  return Object.keys(navigationGroups);
}