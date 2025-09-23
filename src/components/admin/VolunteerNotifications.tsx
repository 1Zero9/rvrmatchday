/**
 * Volunteer Notifications Component
 * Real-time notifications for new volunteer signups
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface NotificationToast {
  id: string;
  message: string;
  type: 'signup' | 'info' | 'warning';
  timestamp: Date;
}

interface VolunteerNotificationsProps {
  onNewSignup?: (count: number) => void;
}

export default function VolunteerNotifications({ onNewSignup }: VolunteerNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [lastSignupCount, setLastSignupCount] = useState(0);

  useEffect(() => {
    // Initial count
    checkForNewSignups();

    // Set up real-time subscription for new signups
    const subscription = supabase
      .channel('volunteer_signups_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'volunteer_signups' 
        }, 
        (payload) => {
          console.log('New volunteer signup detected:', payload);
          handleNewSignup(payload.new);
        }
      )
      .subscribe();

    // Fallback: Poll for new signups every 30 seconds
    const pollInterval = setInterval(checkForNewSignups, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, []);

  const checkForNewSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_signups')
        .select('id, volunteer_name, created_at, signed_up_at')
        .eq('status', 'pending')
        .order('signed_up_at', { ascending: false });

      if (!error && data) {
        const currentCount = data.length;
        
        // If there are more signups than last time, show notification
        if (currentCount > lastSignupCount && lastSignupCount > 0) {
          const newSignupsCount = currentCount - lastSignupCount;
          showNotification(
            `${newSignupsCount} new volunteer signup${newSignupsCount > 1 ? 's' : ''} awaiting review`,
            'signup'
          );
        }
        
        setLastSignupCount(currentCount);
        onNewSignup?.(currentCount);
      }
    } catch (err) {
      console.error('Error checking for new signups:', err);
    }
  };

  const handleNewSignup = (newSignup: any) => {
    const volunteerName = newSignup.volunteer_name || 'Someone';
    showNotification(
      `New volunteer signup from ${volunteerName}`,
      'signup'
    );
    
    // Update count
    checkForNewSignups();
  };

  const showNotification = (message: string, type: 'signup' | 'info' | 'warning') => {
    const notification: NotificationToast = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'signup':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return '🤝';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${getNotificationStyles(notification.type)} 
                       rounded-lg shadow-2xl p-4 max-w-sm pointer-events-auto
                       border border-white/20 backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm leading-tight">
                  {notification.message}
                </p>
                <p className="text-xs text-white/80 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/60 hover:text-white text-lg font-bold flex-shrink-0 leading-none"
              >
                ×
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}