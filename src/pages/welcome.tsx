/**
 * Secure Welcome Dashboard
 * Personalized landing page after login
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { RequireAuth, useAuth } from '../components/SecureAuth';

function WelcomeContent() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (now - lastActivity > fiveMinutes) {
        alert('Session expired due to inactivity. You will be logged out.');
        signOut();
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check inactivity every 30 seconds
    const inactivityTimer = setInterval(checkInactivity, 30000);

    // Update clock every second
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityTimer);
      clearInterval(clockTimer);
    };
  }, [lastActivity, signOut]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return profile?.username || 'User';
  };

  const quickActions = [
    {
      title: 'Match Central',
      description: 'Manage matches, teams & results',
      icon: '⚽',
      color: 'from-green-500 to-emerald-600',
      href: '/match-central'
    },
    {
      title: 'Admin Dashboard',
      description: 'Site management & settings',
      icon: '🛠️',
      color: 'from-blue-500 to-indigo-600',
      href: '/admin',
      adminOnly: true
    },
    {
      title: 'Account Requests',
      description: 'Review pending user requests',
      icon: '👥',
      color: 'from-purple-500 to-violet-600',
      href: '/account-admin',
      adminOnly: true
    },
    {
      title: 'Match Recorder',
      description: 'Record live match events',
      icon: '📝',
      color: 'from-orange-500 to-red-600',
      href: '/match-recorder'
    }
  ];

  const filteredActions = quickActions.filter(action => 
    !action.adminOnly || profile?.role === 'admin'
  );

  const timeUntilLogout = () => {
    const fiveMinutes = 5 * 60 * 1000;
    const timeLeft = fiveMinutes - (Date.now() - lastActivity);
    const minutesLeft = Math.floor(timeLeft / 60000);
    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
    return `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <StandardLayout title="Welcome Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dramatic Welcome Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-16"
          >
            {/* Hero Welcome Section */}
            <div className="relative">
              {/* Background Gradient Blur */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 blur-3xl"></div>
              
              {/* Main Content */}
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-12 max-w-4xl mx-auto">
                
                {/* Club Logo + Role Icon */}
                <motion.div 
                  className="relative inline-block mb-8"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                >
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-gray-100 overflow-hidden">
                    <div className="w-28 h-28 flex items-center justify-center text-6xl">⚽</div>
                  </div>
                  {/* Role Icon Overlay */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <span className="text-2xl">
                      {profile?.role === 'admin' ? '🛡️' : 
                       profile?.role === 'editor' ? '✏️' :
                       profile?.role === 'coach' ? '⚽' :
                       profile?.role === 'manager' ? '📋' : '👤'}
                    </span>
                  </div>
                </motion.div>
                
                {/* Welcome Message */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 leading-tight">
                    {getGreeting()},
                  </h1>
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 animate-pulse">
                      {getFirstName()}
                    </span>
                    <span className="text-yellow-500 ml-2">!</span>
                  </h2>
                  
                  <div className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
                    Welcome to your <span className="font-bold text-green-600">Rivervalley Rangers</span> dashboard
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Dramatic Role Badge */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {(() => {
                const roleConfigs = {
                  'admin': {
                    label: 'SITE ADMINISTRATOR',
                    color: 'bg-gradient-to-r from-red-500 via-red-600 to-red-700',
                    icon: '🛡️',
                    description: 'Full system access & management',
                    border: 'border-red-300',
                    textColor: 'text-red-700',
                    shadow: 'shadow-red-500/50'
                  },
                  'editor': {
                    label: 'CONTENT EDITOR',
                    color: 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700',
                    icon: '✏️',
                    description: 'Edit content & manage posts',
                    border: 'border-purple-200',
                    textColor: 'text-purple-700',
                    shadow: 'shadow-purple-500/50'
                  },
                  'coach': {
                    label: 'TEAM COACH',
                    color: 'bg-gradient-to-r from-green-500 via-green-600 to-green-700',
                    icon: '⚽',
                    description: 'Manage teams & training',
                    border: 'border-green-200',
                    textColor: 'text-green-700',
                    shadow: 'shadow-green-500/50'
                  },
                  'manager': {
                    label: 'TEAM MANAGER',
                    color: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
                    icon: '📋',
                    description: 'Team administration & logistics',
                    border: 'border-blue-200',
                    textColor: 'text-blue-700',
                    shadow: 'shadow-blue-500/50'
                  },
                  'parent': {
                    label: 'PARENT/GUARDIAN',
                    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
                    icon: '👨‍👩‍👧‍👦',
                    description: 'View child team information',
                    border: 'border-orange-200',
                    textColor: 'text-orange-700'
                  },
                  'volunteer': {
                    label: 'CLUB VOLUNTEER',
                    color: 'bg-gradient-to-r from-teal-500 to-teal-600',
                    icon: '🤝',
                    description: 'Support club activities',
                    border: 'border-teal-200',
                    textColor: 'text-teal-700'
                  }
                };
                
                const config = roleConfigs[profile?.role?.toLowerCase()] || {
                  label: 'CLUB MEMBER',
                  color: 'bg-gradient-to-r from-gray-500 to-gray-600',
                  icon: '👤',
                  description: 'General club access',
                  border: 'border-gray-200',
                  textColor: 'text-gray-700'
                };

                return (
                  <div className="relative max-w-2xl mx-auto">
                    {/* Main Role Card */}
                    <div className={`bg-white rounded-3xl p-8 border-2 ${config.border} shadow-2xl`}>
                      <div className="text-center">
                        {/* Large Role Icon */}
                        <div className={`inline-block ${config.color} text-white p-6 rounded-full text-5xl shadow-2xl mb-6`}>
                          {config.icon}
                        </div>
                        
                        {/* Role Title */}
                        <h3 className={`text-3xl md:text-4xl font-black ${config.textColor} mb-3 tracking-wide`}>
                          {config.label}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-lg text-gray-600 font-medium mb-4">
                          {config.description}
                        </p>
                        
                        {/* Access Level Indicator */}
                        <div className={`inline-flex items-center ${config.color} text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg`}>
                          <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                          ACCESS GRANTED
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
            
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Session Active</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span>Auto-logout: {timeUntilLogout()}</span>
              </div>
            </div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Session Info & Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile?.full_name}</h3>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">Role: {profile?.role}</p>
                </div>
              </div>
              
              <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>🔓</span>
                <span>Secure Logout</span>
              </button>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8 text-sm text-gray-500"
          >
            <p>🔒 Secure session • Auto-logout after 5 minutes of inactivity</p>
            <p className="mt-1">Session timer resets with any mouse, keyboard, or touch activity</p>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}

export default function Welcome() {
  return (
    <RequireAuth>
      <WelcomeContent />
    </RequireAuth>
  );
}