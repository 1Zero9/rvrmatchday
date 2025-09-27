/**
 * 🚀 EPIC Welcome Dashboard
 * Next-gen personalized command center
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { RequireAuth, useAuth } from '../components/SecureAuth';

// Dynamic gradient background
function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        animate={{
          background: [
            "linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)",
            "linear-gradient(45deg, #16213e, #0f3460, #533483)",
            "linear-gradient(45deg, #0f3460, #533483, #1a1a2e)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WelcomeContent() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-logout and activity tracking
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
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

    const inactivityTimer = setInterval(checkInactivity, 30000);
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);

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
      href: '/match-central-secure',
      roles: ['admin', 'coach', 'manager']
    },
    {
      title: 'Admin Dashboard',
      description: 'Site management & settings',
      icon: '🛠️',
      color: 'from-blue-500 to-indigo-600',
      href: '/admin',
      roles: ['admin']
    }
  ];

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(profile?.role || 'volunteer')
  );

  const timeUntilLogout = () => {
    const fiveMinutes = 5 * 60 * 1000;
    const timeLeft = fiveMinutes - (Date.now() - lastActivity);
    const minutesLeft = Math.floor(timeLeft / 60000);
    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
    return `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <DynamicBackground />
      
      {/* Mouse cursor glow effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-20 min-h-screen">
        {/* Epic Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative pt-12 pb-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 🚀 EPIC 3D Hero Section */}
            <div className="text-center relative">
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -180, -360],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Main Hero Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 max-w-3xl mx-auto transform-gpu perspective-1000"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(59, 130, 246, 0.3)',
                }}
              >
                {/* Holographic Logo */}
                <motion.div 
                  className="relative inline-block mb-6"
                  initial={{ rotateY: -180, scale: 0 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  whileHover={{ rotateY: 15, scale: 1.1 }}
                >
                  <div className="relative w-18 h-18 mx-auto">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
                    
                    {/* Main logo */}
                    <div className="relative w-18 h-18 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-2xl">
                      <motion.div 
                        className="text-3xl"
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        ⚽
                      </motion.div>
                    </div>
                    
                    {/* Floating role badge */}
                    <motion.div 
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/50"
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-sm">
                        {profile?.role === 'admin' ? '🛡️' : 
                         profile?.role === 'editor' ? '✏️' :
                         profile?.role === 'coach' ? '⚽' :
                         profile?.role === 'manager' ? '📋' : '👤'}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Epic Welcome Text */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="space-y-3"
                >
                  <motion.h1 
                    className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      backgroundSize: '200% 200%',
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                    }}
                  >
                    {getGreeting()}
                    <br />
                    <motion.span
                      animate={{ color: ['#ffffff', '#06b6d4', '#3b82f6', '#ffffff'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getFirstName()}! 
                    </motion.span>
                  </motion.h1>
                  
                  <motion.div 
                    className="text-lg md:text-xl text-cyan-100 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    Welcome to your <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Command Center</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 🎮 Epic Action Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3">
              Your Mission Control
            </h2>
            <p className="text-lg text-white/70">
              Choose your next action, {profile?.role || 'Commander'}
            </p>
          </motion.div>

          {/* 🚀 3D Action Cards - Horizontal Layout */}
          <motion.div 
            className="flex gap-4 justify-center overflow-x-auto scrollbar-hide pb-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 100, rotateY: -45 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 2 + (index * 0.2),
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  rotateX: 5,
                }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer perspective-1000 flex-shrink-0 w-56"
                onClick={() => router.push(action.href)}
              >
                <div 
                  className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl transform-gpu"
                  style={{
                    background: `linear-gradient(135deg, ${action.color.includes('green') ? 'rgba(34, 197, 94, 0.2)' : 
                      action.color.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                      action.color.includes('purple') ? 'rgba(147, 51, 234, 0.2)' :
                      action.color.includes('orange') ? 'rgba(249, 115, 22, 0.2)' :
                      action.color.includes('teal') ? 'rgba(20, 184, 166, 0.2)' :
                      'rgba(99, 102, 241, 0.2)'} 0%, rgba(255,255,255,0.05) 100%)`,
                    boxShadow: `0 25px 50px -12px ${action.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' : 
                      action.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                      action.color.includes('purple') ? 'rgba(147, 51, 234, 0.3)' :
                      action.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' :
                      action.color.includes('teal') ? 'rgba(20, 184, 166, 0.3)' :
                      'rgba(99, 102, 241, 0.3)'}, 0 0 30px ${action.color.includes('green') ? 'rgba(34, 197, 94, 0.2)' : 
                      action.color.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                      action.color.includes('purple') ? 'rgba(147, 51, 234, 0.2)' :
                      action.color.includes('orange') ? 'rgba(249, 115, 22, 0.2)' :
                      action.color.includes('teal') ? 'rgba(20, 184, 166, 0.2)' :
                      'rgba(99, 102, 241, 0.2)'}`,
                  }}
                >
                  <div className="relative p-5">
                    {/* Icon with glow */}
                    <motion.div 
                      className="text-4xl mb-4 relative"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 text-4xl blur-lg opacity-50">
                        {action.icon}
                      </div>
                      <div className="relative">
                        {action.icon}
                      </div>
                    </motion.div>
                    
                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-white/80 text-xs leading-relaxed mb-3">
                        {action.description}
                      </p>
                      
                      {/* Launch button */}
                      <motion.div
                        className="flex items-center text-cyan-300 font-semibold text-xs"
                        whileHover={{ x: 3 }}
                      >
                        <span>Launch</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 🚀 Futuristic Status Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(59, 130, 246, 0.1)',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* User Profile */}
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <span className="text-2xl relative z-10">👤</span>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{profile?.full_name}</h3>
                  <p className="text-cyan-200 text-sm font-medium">{profile?.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wide">
                      {profile?.role}
                    </span>
                    <motion.div
                      className="flex items-center space-x-1 text-green-400 text-xs"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>ACTIVE</span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Session Info */}
              <div className="text-center md:text-right">
                <div className="text-white/60 text-sm mb-3 space-y-1">
                  <div className="flex items-center justify-center md:justify-end space-x-2">
                    <span>🕒</span>
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-end space-x-2">
                    <span>⏳</span>
                    <span>Auto-logout: {timeUntilLogout()}</span>
                  </div>
                </div>
                
                {/* Epic Logout Button */}
                <motion.button
                  onClick={signOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-xl"
                  style={{
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔓
                  </motion.span>
                  <span>Secure Logout</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ➤
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Security Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-center mt-12 space-y-3"
          >
            <div className="flex items-center justify-center space-x-6 text-white/40 text-sm">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <span>Real-time Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
                />
                <span>Activity Monitoring</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Welcome() {
  return (
    <RequireAuth>
      <WelcomeContent />
    </RequireAuth>
  );
}