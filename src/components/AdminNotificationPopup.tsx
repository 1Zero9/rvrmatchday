/**
 * Admin Notification Popup
 * Shows pending registration requests to admin users
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from './SecureAuth';

interface PendingRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  requested_role: string;
  created_at: string;
}

export default function AdminNotificationPopup() {
  const { isAdmin } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const checkPendingRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('account_requests')
          .select('id, first_name, last_name, email, requested_role, created_at')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching pending requests:', error);
          return;
        }

        if (data && data.length > 0) {
          setPendingRequests(data);
          
          // Check if user has dismissed notifications in this session
          const sessionKey = `admin_notifications_dismissed_${new Date().toDateString()}`;
          const wasDismissed = sessionStorage.getItem(sessionKey);
          
          if (!wasDismissed) {
            setShowNotification(true);
          }
        }
      } catch (error) {
        console.error('Error checking pending requests:', error);
      }
    };

    // Check immediately
    checkPendingRequests();

    // Check every 30 seconds
    const interval = setInterval(checkPendingRequests, 30000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleDismiss = () => {
    setShowNotification(false);
    setDismissed(true);
    
    // Remember dismissal for this session
    const sessionKey = `admin_notifications_dismissed_${new Date().toDateString()}`;
    sessionStorage.setItem(sessionKey, 'true');
  };

  const handleViewRequests = () => {
    window.open('/admin', '_blank');
    handleDismiss();
  };

  if (!isAdmin || !showNotification || dismissed || pendingRequests.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="relative max-w-sm"
      >
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl border-2 border-orange-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-pulse">🔔</span>
              <span className="font-bold text-lg">Admin Alert</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="font-bold text-lg">
                  {pendingRequests.length} Pending Registration{pendingRequests.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-white/90 text-sm">
                  Account requests awaiting approval
                </p>
              </div>
            </div>

            {/* Recent requests preview */}
            <div className="bg-white/10 rounded-lg p-3 space-y-2">
              {pendingRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {request.first_name} {request.last_name}
                  </span>
                  <span className="text-white/80 text-xs">
                    {request.requested_role}
                  </span>
                </div>
              ))}
              {pendingRequests.length > 3 && (
                <div className="text-center text-white/70 text-xs">
                  +{pendingRequests.length - 3} more...
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleViewRequests}
                className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all border border-white/30"
              >
                Review Requests
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-orange-300 animate-pulse pointer-events-none"></div>
        </div>

        {/* Floating notification indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white"
        >
          {pendingRequests.length}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}