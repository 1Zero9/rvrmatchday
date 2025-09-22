/**
 * 🧭 MODULAR NAVIGATION SYSTEM
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Dynamic navigation that adapts based on enabled modules
 * Automatically includes/excludes features based on module configuration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from './SecureAuth';
import { 
  getModuleNavigation, 
  isModuleEnabled,
  getEnabledModules
} from '../lib/module-manager';
import { NavigationItem, QuickAction } from '../types/module-types';

// =====================================
// 🎯 PROPS & INTERFACES
// =====================================

interface ModularNavigationProps {
  currentPage?: string;
  className?: string;
  showModuleInfo?: boolean; // Debug mode
}

interface NavigationState {
  items: NavigationItem[];
  quickActions: QuickAction[];
  userActions: QuickAction[];
  loading: boolean;
  error: string | null;
}

// =====================================
// 🧩 NAVIGATION PERMISSION CHECKER
// =====================================

function useNavigationPermissions() {
  const { user, profile, isAdmin } = useAuth();
  
  const hasPermission = (item: NavigationItem): boolean => {
    // If no auth required, always show
    if (!item.requiresAuth) return true;
    
    // If auth required but user not logged in, hide
    if (item.requiresAuth && !user) return false;
    
    // If no specific roles required, show to any authenticated user
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user has required role
    const userRole = profile?.role?.toLowerCase();
    return item.roles.some(role => 
      role.toLowerCase() === userRole || 
      (role === 'admin' && isAdmin)
    );
  };

  const filterNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      // Check main item permission
      if (!hasPermission(item)) return false;
      
      // Filter children if dropdown exists
      if (item.children) {
        item.children = item.children.filter(hasPermission);
        // Hide parent if no visible children
        if (item.hasDropdown && item.children.length === 0) return false;
      }
      
      return true;
    });
  };

  const filterQuickActions = (actions: QuickAction[]): QuickAction[] => {
    return actions.filter(action => {
      if (!action.requiresAuth) return true;
      if (action.requiresAuth && !user) return false;
      if (!action.roles || action.roles.length === 0) return true;
      
      const userRole = profile?.role?.toLowerCase();
      return action.roles.some(role => 
        role.toLowerCase() === userRole || 
        (role === 'admin' && isAdmin)
      );
    });
  };

  return { hasPermission, filterNavigationItems, filterQuickActions };
}

// =====================================
// 🎨 NAVIGATION COMPONENTS
// =====================================

function NavigationItem({ item, isActive, onItemClick }: {
  item: NavigationItem;
  isActive: boolean;
  onItemClick?: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative group">
      {item.hasDropdown && item.children ? (
        <div>
          <button
            className={`px-4 py-3 text-white hover:bg-club-primary-light rounded-lg transition-all duration-200 font-medium flex items-center text-base whitespace-nowrap ${
              isActive ? 'bg-club-primary-light' : ''
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isDropdownOpen ? 1 : 0,
              y: isDropdownOpen ? 0 : -10 
            }}
            className={`absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-club-accent z-50 overflow-hidden ${
              isDropdownOpen ? 'block' : 'hidden'
            }`}
          >
            {item.children.map((child, index) => (
              <Link
                key={index}
                href={child.href}
                className="block px-4 py-3 text-gray-700 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary border-b border-gray-100 last:border-b-0 font-medium"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onItemClick?.();
                }}
              >
                <span className="mr-2">{child.icon}</span>
                {child.label}
              </Link>
            ))}
          </motion.div>
        </div>
      ) : (
        <Link
          href={item.href}
          className={`px-4 py-3 text-white hover:bg-club-primary-light rounded-lg transition-all duration-200 font-medium text-base flex items-center whitespace-nowrap ${
            isActive ? 'bg-club-primary-light' : ''
          }`}
          onClick={onItemClick}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </Link>
      )}
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  };

  return (
    <Link
      href={action.href}
      className={`block p-4 bg-gradient-to-r ${colorClasses[action.color] || colorClasses.blue} text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1`}
    >
      <div className="text-2xl mb-2">{action.icon}</div>
      <h3 className="font-bold text-sm mb-1">{action.title}</h3>
      <p className="text-xs opacity-90">{action.description}</p>
    </Link>
  );
}

// =====================================
// 🖥️ MAIN NAVIGATION COMPONENT
// =====================================

export default function ModularNavigation({ 
  currentPage, 
  className = '',
  showModuleInfo = false 
}: ModularNavigationProps) {
  const router = useRouter();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    items: [],
    quickActions: [],
    userActions: [],
    loading: true,
    error: null
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { filterNavigationItems, filterQuickActions } = useNavigationPermissions();

  // =====================================
  // 🔄 LOAD NAVIGATION DATA
  // =====================================

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setNavigationState(prev => ({ ...prev, loading: true, error: null }));

        // Get navigation from all enabled modules
        const moduleNavigation = getModuleNavigation();
        
        // Filter based on user permissions
        const filteredItems = filterNavigationItems(moduleNavigation.items);
        const filteredQuickActions = filterQuickActions(moduleNavigation.quickActions);
        const filteredUserActions = filterQuickActions(moduleNavigation.userActions);

        setNavigationState({
          items: filteredItems,
          quickActions: filteredQuickActions,
          userActions: filteredUserActions,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Failed to load navigation:', error);
        setNavigationState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load navigation'
        }));
      }
    };

    loadNavigation();
    
    // Reload when route changes (in case modules are enabled/disabled)
    router.events.on('routeChangeComplete', loadNavigation);
    
    return () => {
      router.events.off('routeChangeComplete', loadNavigation);
    };
  }, [router]);

  // =====================================
  // 🎯 RENDER METHODS
  // =====================================

  if (navigationState.loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-white opacity-50">Loading navigation...</div>
      </div>
    );
  }

  if (navigationState.error) {
    return (
      <div className={`text-red-400 text-sm ${className}`}>
        Navigation Error: {navigationState.error}
      </div>
    );
  }

  return (
    <nav className={className}>
      {/* Debug Info */}
      {showModuleInfo && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
          <strong>Enabled Modules:</strong> {getEnabledModules().map(m => m.name).join(', ')}
          <br />
          <strong>Navigation Items:</strong> {navigationState.items.length}
          <br />
          <strong>Quick Actions:</strong> {navigationState.quickActions.length}
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2">
        {navigationState.items.map((item, index) => (
          <NavigationItem
            key={index}
            item={item}
            isActive={currentPage === item.href}
          />
        ))}
      </div>

      {/* Mobile Navigation Button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:bg-club-primary-light rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-club-primary border-t border-club-primary-light shadow-lg z-50"
          >
            <div className="px-4 py-2 space-y-1">
              {navigationState.items.map((item, index) => (
                <div key={index} className="border-b border-club-primary-light last:border-b-0 py-2">
                  {item.hasDropdown && item.children ? (
                    <div>
                      <div className="font-medium text-white py-2">{item.label}</div>
                      <div className="pl-4 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className="block py-2 text-white opacity-80 hover:opacity-100 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="mr-2">{child.icon}</span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-2 text-white hover:bg-club-primary-light rounded px-2 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions Grid (if space available) */}
      {navigationState.quickActions.length > 0 && (
        <div className="hidden lg:block ml-8">
          <div className="grid grid-cols-4 gap-2 w-80">
            {navigationState.quickActions.slice(0, 4).map((action, index) => (
              <QuickActionCard key={index} action={action} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// =====================================
// 🎯 SPECIALIZED NAVIGATION HOOKS
// =====================================

export function useModularNavigation() {
  const [navigation, setNavigation] = useState(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    const loadNav = async () => {
      const moduleNavigation = getModuleNavigation();
      setNavigation(moduleNavigation);
    };
    
    loadNav();
  }, [user, profile]);

  return navigation;
}

export function useQuickActions() {
  const navigation = useModularNavigation();
  const { filterQuickActions } = useNavigationPermissions();
  
  if (!navigation) return [];
  
  return filterQuickActions(navigation.quickActions);
}

// =====================================
// 🧪 TESTING EXPORTS
// =====================================

export { useNavigationPermissions, NavigationItem, QuickActionCard };