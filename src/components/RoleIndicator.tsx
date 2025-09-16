/**
 * Role Indicator Component
 * Shows current authentication role in the header
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoleIndicator() {
  const [authData, setAuthData] = useState<{role: string, username: string} | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const demoAuth = localStorage.getItem('rvr_demo_auth');
      if (demoAuth) {
        try {
          const parsed = JSON.parse(demoAuth);
          setAuthData(parsed);
        } catch {
          // Fallback for old simple auth
          setAuthData({ role: 'admin', username: 'admin' });
        }
      } else {
        setAuthData(null);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (when user logs in/out in another component)
    window.addEventListener('storage', checkAuth);
    
    // Check periodically in case of same-tab changes
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (!authData) return null;

  const isAdmin = authData.role === 'admin';
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-0 left-0 right-0 z-50 shadow-lg border-b-2 ${
          isAdmin 
            ? 'bg-red-500 text-white border-red-600' 
            : 'bg-green-500 text-white border-green-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {isAdmin ? '👑' : '✏️'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold capitalize">
                  {authData.role} Mode Active
                </span>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isAdmin ? 'bg-red-200' : 'bg-green-200'
                }`} />
              </div>
              <span className="text-sm opacity-90 hidden sm:block">
                Editing enabled • {authData.username}
              </span>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem('rvr_demo_auth');
                window.location.reload(); // Force refresh to update all components
              }}
              className={`text-xs px-3 py-1 rounded-full font-medium hover:bg-opacity-20 transition-colors ${
                isAdmin 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Exit {authData.role} Mode
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}