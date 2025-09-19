/**
 * Login Popup Component
 * Standalone modal for authentication
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRole?: string;
}

export default function LoginPopup({ isOpen, onClose, preselectedRole }: LoginPopupProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-populate username based on preselected role
  useEffect(() => {
    if (preselectedRole && isOpen) {
      setCredentials(prev => ({ ...prev, username: preselectedRole }));
    }
  }, [preselectedRole, isOpen]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // SECURITY UPDATE: This component is deprecated in favor of secure authentication
    // Redirect to secure login instead of using exposed credentials
    window.location.href = '/login';
    return;
    
    if (role) {
      const authData = { 
        role, 
        username: credentials.username, 
        loginTime: new Date().toISOString() 
      };
      localStorage.setItem('rvr_demo_auth', JSON.stringify(authData));
      setCredentials({ username: '', password: '' });
      onClose();
      
      // Small delay to show success, then refresh to update all components
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      alert('Invalid credentials. Please contact the club administrator for access.');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Reset form when popup closes
  useEffect(() => {
    if (!isOpen) {
      setCredentials({ username: '', password: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {preselectedRole ? `${preselectedRole.charAt(0).toUpperCase() + preselectedRole.slice(1)} Login` : 'Content Editor Login'}
            </h2>
            <p className="text-gray-600 text-sm">
              {preselectedRole ? `Sign in as ${preselectedRole}` : 'Sign in to edit website content'}
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter username"
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Login Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Access Information:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">🔐</span>
                <span>Contact club administrator for login credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">✏️</span>
                <span>Editor access available for content management</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleLogin}
              disabled={isLoading || !credentials.username || !credentials.password}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}