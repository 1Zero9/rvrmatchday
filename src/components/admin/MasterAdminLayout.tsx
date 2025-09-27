/**
 * Master Admin Portal Layout
 * Unified UX/UI patterns for all admin portals with role-based access
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../SecureAuth';

interface AdminSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  path: string;
  requiredRoles: ('admin' | 'parent')[];
  badge?: string;
  color: string;
}

interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface MasterAdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  pageTitle: string;
  pageDescription: string;
}

export default function MasterAdminLayout({ 
  children, 
  currentSection, 
  pageTitle, 
  pageDescription 
}: MasterAdminLayoutProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [recentActions, setRecentActions] = useState<any[]>([]);

  // Admin sections with role-based access
  const adminSections: AdminSection[] = [
    {
      id: 'users',
      title: 'User Management',
      icon: '👥',
      description: 'Manage user accounts and permissions',
      path: '/admin/users',
      requiredRoles: ['admin'],
      color: 'bg-blue-500'
    },
    {
      id: 'news',
      title: 'News & Articles',
      icon: '📰',
      description: 'Create and manage news articles',
      path: '/admin/news',
      requiredRoles: ['admin'],
      color: 'bg-green-500'
    },
    {
      id: 'events',
      title: 'Special Events',
      icon: '🎉',
      description: 'Manage events and activities',
      path: '/admin/events',
      requiredRoles: ['admin'],
      color: 'bg-purple-500'
    },
    {
      id: 'volunteers',
      title: 'Volunteers',
      icon: '🤝',
      description: 'Coordinate volunteer activities',
      path: '/admin/volunteers',
      requiredRoles: ['admin', 'parent'],
      color: 'bg-orange-500'
    },
    {
      id: 'tools',
      title: 'System Tools',
      icon: '🔧',
      description: 'Database and system utilities',
      path: '/admin/tools',
      requiredRoles: ['admin'],
      color: 'bg-gray-500'
    },
    {
      id: 'status',
      title: 'System Status',
      icon: '📊',
      description: 'Monitor system health and performance',
      path: '/admin/status',
      requiredRoles: ['admin'],
      color: 'bg-teal-500'
    }
  ];

  // Filter sections based on user role
  const availableSections = adminSections.filter(section =>
    section.requiredRoles.includes(user?.role as any)
  );

  // Global notification system
  const addNotification = (notification: Omit<NotificationToast, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds if no action
    if (!notification.action) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Standard delete confirmation
  const showDeleteConfirmation = (
    itemName: string,
    itemType: string,
    onConfirm: () => void,
    additionalWarning?: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${itemType}?\n\n` +
      `Item: "${itemName}"\n\n` +
      `This action will:\n` +
      `• Remove the ${itemType} permanently\n` +
      `• Log the deletion for audit purposes\n` +
      `• Cannot be undone\n\n` +
      (additionalWarning ? `⚠️ ${additionalWarning}\n\n` : '') +
      `Type "DELETE" to confirm this action.`
    );

    if (confirmed) {
      const doubleConfirm = window.prompt(
        `Final confirmation required.\n\nType "DELETE" to permanently remove "${itemName}"`
      );

      if (doubleConfirm === 'DELETE') {
        onConfirm();
        addNotification({
          type: 'success',
          message: `${itemType} "${itemName}" has been deleted`,
          action: {
            label: 'Undo',
            onClick: () => {
              // Undo logic would go here
              addNotification({
                type: 'info',
                message: `Undo functionality coming soon`
              });
            }
          }
        });
      } else {
        addNotification({
          type: 'info',
          message: 'Deletion cancelled - item was not deleted'
        });
      }
    }
  };

  // Standard success/error handling
  const handleActionResult = (
    success: boolean,
    action: string,
    itemName?: string,
    error?: string
  ) => {
    if (success) {
      addNotification({
        type: 'success',
        message: `${action} completed successfully${itemName ? ` for "${itemName}"` : ''}`
      });
    } else {
      addNotification({
        type: 'error',
        message: `${action} failed${error ? `: ${error}` : ''}`
      });
    }
  };

  // Expose functions to child components
  useEffect(() => {
    (window as any).adminActions = {
      showDeleteConfirmation,
      addNotification,
      handleActionResult,
      removeNotification
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/home" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to Site
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">
                🛠️ Master Admin Portal
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.full_name}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Admin Sections</h2>
                <p className="text-sm text-gray-600">
                  {availableSections.length} available sections
                </p>
              </div>
              
              <nav className="p-4 space-y-2">
                {availableSections.map((section) => (
                  <Link
                    key={section.id}
                    href={section.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      currentSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {section.description}
                      </div>
                    </div>
                    {section.badge && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {section.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Recent Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Recent Actions</h3>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500">
                  No recent actions yet
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {pageTitle}
                  </h1>
                  <p className="text-gray-600">
                    {pageDescription}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-green-500`} />
                  <span className="text-sm text-gray-500">System Online</span>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Global Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 max-w-md"
          >
            <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success' ? 'bg-green-50 border-green-400' :
              notification.type === 'error' ? 'bg-red-50 border-red-400' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className={`mt-2 text-sm font-medium underline ${
                        notification.type === 'success' ? 'text-green-600' :
                        notification.type === 'error' ? 'text-red-600' :
                        notification.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}