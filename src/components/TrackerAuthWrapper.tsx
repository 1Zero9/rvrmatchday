/**
 * Tracker Authentication Wrapper
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Authentication wrapper for match tracker functionality.
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import SupabaseTrackerLogin from './SupabaseTrackerLogin';
import { 
  TrackerUser, 
  getTrackerSession, 
  clearTrackerSession, 
  updateTrackerActivity,
  getUserDisplayInfo,
  logTrackerActivity 
} from '../lib/tracker-auth';
import {
  SupabaseTrackerUser,
  getCurrentUser,
  signOut,
  hasPermission as supabaseHasPermission,
  canAccessTeam as supabaseCanAccessTeam
} from '../lib/supabase-auth';

interface TrackerAuthWrapperProps {
  children: (user: SupabaseTrackerUser) => ReactNode;
  requiresAuth?: boolean;
  requiredPermission?: string;
  requiredRole?: string;
}

export default function TrackerAuthWrapper({ 
  children, 
  requiresAuth = true,
  requiredPermission,
  requiredRole 
}: TrackerAuthWrapperProps) {
  const [user, setUser] = useState<SupabaseTrackerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    checkSession();
    
    // Set up activity tracking
    const activityInterval = setInterval(() => {
      if (user) {
        updateTrackerActivity();
      }
    }, 60000); // Update every minute

    return () => clearInterval(activityInterval);
  }, [user]);

  const checkSession = () => {
    try {
      const session = getTrackerSession();
      
      if (session) {
        // Check role requirement
        if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'admin') {
          setAuthError(`Access denied. ${requiredRole} role required.`);
          setUser(null);
          setLoading(false);
          return;
        }

        // Check permission requirement
        if (requiredPermission && !session.user.permissions.includes(requiredPermission) && !session.user.permissions.includes('*')) {
          setAuthError('Access denied. Insufficient permissions.');
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);
        setAuthError('');
        
        // Log session check
        logTrackerActivity('SESSION_CHECK', {
          role: session.user.role,
          teams: session.user.teams
        });
      } else if (!requiresAuth) {
        // Allow access without authentication
        setUser({
          id: 'anonymous',
          username: 'anonymous',
          name: 'Anonymous User',
          role: 'parent',
          teams: [],
          permissions: ['view_matches']
        });
      }
    } catch (error) {
      console.error('Session check error:', error);
      clearTrackerSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: SupabaseTrackerUser) => {
    setUser(loggedInUser);
    setAuthError('');
    
    // Log successful login
    logTrackerActivity('LOGIN', {
      role: loggedInUser.role,
      teams: loggedInUser.teams
    });
  };

  const handleLogout = () => {
    if (user) {
      logTrackerActivity('LOGOUT', { role: user.role });
    }
    clearTrackerSession();
    setUser(null);
    setAuthError('');
  };

  // Show loading spinner during session check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #972A4C 0%, #5E7794 50%, #98C0F0 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white text-lg">Loading Match Tracker...</p>
        </motion.div>
      </div>
    );
  }

  // Show login if authentication required and user not logged in
  if (requiresAuth && !user) {
    return (
      <div className="relative">
        <SupabaseTrackerLogin 
          onLogin={handleLogin}
          onGuestAccess={() => handleLogin({
            id: 'guest',
            email: 'guest@guest.com',
            username: 'guest',
            full_name: 'Guest User',
            role: 'parent',
            teams: [],
            permissions: ['view_matches'],
            is_active: true
          })}
        />
        
        {/* Authentication Error Overlay */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
          >
            <div className="bg-red-500/90 backdrop-blur-md border border-red-400/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <p className="text-white font-semibold">Access Denied</p>
                  <p className="text-red-100 text-sm">{authError}</p>
                </div>
              </div>
              <button
                onClick={() => setAuthError('')}
                className="mt-3 w-full bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
              >
                Try Different Account
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Render content with authentication context
  return (
    <div className="relative">
      {/* User Info Header (only if authenticated) */}
      {user && user.id !== 'anonymous' && user.id !== 'guest' && (
        <div className="fixed top-0 left-0 right-0 backdrop-blur-md z-40 px-4 py-2" style={{
          backgroundColor: 'rgba(151, 42, 76, 0.85)',
          borderBottom: '1px solid rgba(94, 119, 148, 0.3)'
        }}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <span style={{ color: '#98C0F0' }}>{getUserDisplayInfo()?.icon || '👤'}</span>
              <span className="text-white font-medium">{user.name}</span>
              <span className="text-xs" style={{ color: '#B6B7B6' }}>({user.role})</span>
              {user.teams.includes('*') && (
                <span className="text-xs px-2 py-1 rounded-full" style={{ 
                  backgroundColor: 'rgba(152, 192, 240, 0.2)', 
                  color: '#98C0F0' 
                }}>
                  All Teams
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="hover:text-white transition-colors text-xs"
              style={{ color: '#B6B7B6' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={user && user.id !== 'anonymous' && user.id !== 'guest' ? 'pt-12' : ''}>
        {user ? children(user) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Required</h1>
              <p className="text-gray-600 mb-6">Please log in to access the match tracker.</p>
              <button
                onClick={() => setLoading(true)}
                className="bg-club-primary text-white px-6 py-3 rounded-lg hover:bg-club-secondary transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}