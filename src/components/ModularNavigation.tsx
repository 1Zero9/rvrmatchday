/**
 * Modular Navigation Component
 * Dynamically shows/hides navigation items based on enabled modules
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModuleManager, { CLUB_CONFIG } from '../config/modules';

interface NavItem {
  label: string;
  href: string;
  moduleRequired?: string;
  children?: NavItem[];
}

// Navigation structure with module dependencies
const NAVIGATION_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/home',
    moduleRequired: 'core-website'
  },
  {
    label: 'About',
    href: '/about',
    moduleRequired: 'core-website',
    children: [
      { label: 'Club Info', href: '/about' },
      { label: 'History', href: '/club/history' },
      { label: 'Committee', href: '/club/committee' },
      { label: 'Facilities', href: '/club/facilities' },
      { label: 'Values', href: '/club/values' }
    ]
  },
  {
    label: 'Teams',
    href: '/teams',
    moduleRequired: 'core-website',
    children: [
      { label: 'All Teams', href: '/teams' },
      { label: 'Boys Teams', href: '/teams/boys' },
      { label: 'Girls Teams', href: '/teams/girls' },
      { label: 'Senior Teams', href: '/teams/senior' },
      { label: 'Inclusive', href: '/teams/inclusive' }
    ]
  },
  {
    label: 'Matches',
    href: '/match-central',
    moduleRequired: 'match-central',
    children: [
      { label: 'Match Central', href: '/match-central' },
      { label: 'Live Tracker', href: '/tracker' },
      { label: 'Matchday', href: '/matchday' },
      { label: 'Match Admin', href: '/match-admin', moduleRequired: 'user-management' }
    ]
  },
  {
    label: 'Community',
    href: '/news',
    moduleRequired: 'core-website',
    children: [
      { label: 'News', href: '/news' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Boot Room', href: '/boot-room', moduleRequired: 'boot-room' },
      { label: 'Events', href: '/news-media/events' }
    ]
  },
  {
    label: 'Join',
    href: '/join',
    moduleRequired: 'core-website',
    children: [
      { label: 'How to Join', href: '/join' },
      { label: 'Trials', href: '/join/trials' },
      { label: 'Academy', href: '/join/academy' },
      { label: 'Volunteering', href: '/volunteering' }
    ]
  },
  {
    label: 'Contact',
    href: '/contact',
    moduleRequired: 'core-website',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Get Involved', href: '/get-involved' },
      { label: 'Fundraising', href: '/fundraising' }
    ]
  }
];

// Admin/User specific navigation (shown when user management module is enabled)
const USER_NAVIGATION: NavItem[] = [
  {
    label: 'Quick Tools',
    href: '/quick-record',
    moduleRequired: 'quick-tools'
  },
  {
    label: 'Dashboard',
    href: '/welcome',
    moduleRequired: 'user-management'
  },
  {
    label: 'Admin',
    href: '/admin',
    moduleRequired: 'user-management'
  }
];

interface ModularNavigationProps {
  showUserNav?: boolean;
  className?: string;
}

export default function ModularNavigation({ showUserNav = false, className = '' }: ModularNavigationProps) {
  const router = useRouter();

  // Filter navigation items based on enabled modules
  const filterNavigation = (items: NavItem[]): NavItem[] => {
    return items.filter(item => {
      if (item.moduleRequired && !ModuleManager.isModuleEnabled(item.moduleRequired)) {
        return false;
      }
      
      if (item.children) {
        item.children = filterNavigation(item.children);
      }
      
      return true;
    });
  };

  const filteredMainNav = filterNavigation(NAVIGATION_ITEMS);
  const filteredUserNav = showUserNav ? filterNavigation(USER_NAVIGATION) : [];

  const isActive = (href: string) => {
    if (href === '/home' && router.pathname === '/') return true;
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <nav className={`modular-navigation ${className}`}>
      {/* Main Navigation */}
      <div className="main-nav flex space-x-6">
        {filteredMainNav.map((item) => (
          <div key={item.href} className="nav-item group relative">
            <Link 
              href={item.href}
              className={`
                nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive(item.href) 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                }
              `}
            >
              {item.label}
            </Link>
            
            {/* Dropdown for children */}
            {item.children && item.children.length > 0 && (
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Navigation (if enabled) */}
      {filteredUserNav.length > 0 && (
        <div className="user-nav flex space-x-4 ml-auto">
          {filteredUserNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                user-nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive(item.href)
                  ? 'bg-secondary text-white'
                  : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
      
      {/* Module Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="module-debug fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>Plan: {CLUB_CONFIG.plan}</div>
          <div>Modules: {ModuleManager.getEnabledModules().length}</div>
          <div>Price: £{ModuleManager.calculateTotalPrice().toLocaleString()}</div>
        </div>
      )}
    </nav>
  );
}

// Higher-order component to wrap pages with module checking
export function withModuleAccess(moduleId: string) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function ModuleProtectedComponent(props: P) {
      if (!ModuleManager.isModuleEnabled(moduleId)) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Available</h1>
              <p className="text-gray-600 mb-6">
                The requested functionality is not enabled for this club.
              </p>
              <Link 
                href="/home"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        );
      }
      
      return <Component {...props} />;
    };
  };
}

// Module status indicator for admin
export function ModuleStatusIndicator() {
  const enabledModules = ModuleManager.getEnabledModules();
  const totalPrice = ModuleManager.calculateTotalPrice();
  
  return (
    <div className="module-status bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Active Modules</h3>
      <div className="space-y-2">
        {enabledModules.map((module) => (
          <div key={module.id} className="flex justify-between items-center">
            <span className="text-sm">{module.name}</span>
            <span className="text-sm text-green-600">✓ Active</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center font-semibold">
          <span>Total Value:</span>
          <span>£{totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}