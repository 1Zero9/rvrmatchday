/**
 * 📱 iPhone App-Style Mobile Home
 * Creates a native iOS app experience for Rivervalley Rangers AFC
 * 
 * Features:
 * - iOS-style app icons and layout
 * - Professional branding integration
 * - Match tracker access for coaches/parents
 * - Modern glassmorphism design
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function iPhoneAppHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Set greeting based on time
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    return () => clearInterval(timer);
  }, [currentTime]);

  // Main app icons - iPhone style with rounded rectangles
  const appIcons = [
    {
      name: 'MatchDay',
      description: 'Live Scores & Results',
      href: '/matchday',
      icon: '⚽',
      gradient: 'from-green-500 to-green-600',
      size: 'large', // Featured app
      badge: null
    },
    {
      name: 'Match Central',
      description: 'Coach Dashboard',
      href: '/match-central',
      icon: '🏆',
      gradient: 'from-blue-600 to-blue-700',
      size: 'medium',
      badge: '🔒'
    },
    {
      name: 'Quick Record',
      description: 'Parent Match Tracker',
      href: '/quick-record',
      icon: '📱',
      gradient: 'from-purple-500 to-purple-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'Join Club',
      description: 'Book Your Trial',
      href: '/join/trials',
      icon: '🎯',
      gradient: 'from-orange-500 to-red-500',
      size: 'medium',
      badge: 'NEW'
    },
    {
      name: 'Our Teams',
      description: 'All Squads & Ages',
      href: '/teams',
      icon: '👥',
      gradient: 'from-indigo-500 to-purple-600',
      size: 'small',
      badge: null
    },
    {
      name: 'Gallery',
      description: 'Match Photos',
      href: '/gallery',
      icon: '📸',
      gradient: 'from-pink-500 to-rose-500',
      size: 'small',
      badge: null
    },
    {
      name: 'News',
      description: 'Latest Updates',
      href: '/news',
      icon: '📰',
      gradient: 'from-gray-600 to-gray-700',
      size: 'small',
      badge: null
    },
    {
      name: 'Contact',
      description: 'Get in Touch',
      href: '/contact',
      icon: '📞',
      gradient: 'from-teal-500 to-cyan-500',
      size: 'small',
      badge: null
    }
  ];

  const AppIcon = ({ app, index }: { app: any, index: number }) => {
    const sizeClasses = {
      large: 'col-span-2 h-32', // Featured app
      medium: 'h-24',
      small: 'h-20'
    };

    const iconSizes = {
      large: 'text-4xl',
      medium: 'text-2xl', 
      small: 'text-xl'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[app.size]} relative`}
      >
        <Link href={app.href} className="block h-full">
          <div className={`
            h-full bg-gradient-to-br ${app.gradient} rounded-2xl 
            shadow-lg hover:shadow-xl transition-all duration-300
            border border-white/20 backdrop-blur-sm
            flex flex-col items-center justify-center
            relative overflow-hidden
          `}>
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 text-center text-white p-3">
              <div className={`${iconSizes[app.size]} mb-2`}>{app.icon}</div>
              <h3 className={`font-semibold ${app.size === 'large' ? 'text-sm' : 'text-xs'}`}>
                {app.name}
              </h3>
              {app.size === 'large' && (
                <p className="text-xs opacity-90 mt-1">{app.description}</p>
              )}
            </div>

            {/* Badge */}
            {app.badge && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                {app.badge === 'NEW' ? 'N' : app.badge}
              </div>
            )}

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Status Bar Area */}
      <div className="h-12 bg-black/20 backdrop-blur-md" />

      {/* Header with Club Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-8 text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Image 
              src="/images/logo.png" 
              alt="RVR AFC Logo" 
              width={80}
              height={80}
              className="rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-lg opacity-30 -z-10" />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-white text-center"
        >
          <h1 className="text-2xl font-bold mb-1">Rivervalley Rangers AFC</h1>
          <p className="text-blue-200 text-sm mb-2">Community Football Since 1981</p>
          <p className="text-white/70 text-xs">
            {greeting} • {currentTime.toLocaleDateString('en-IE', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      </motion.div>

      {/* App Grid */}
      <div className="px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
        >
          {appIcons.map((app, index) => (
            <AppIcon key={app.name} app={app} index={index} />
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-sm mx-auto border border-white/20"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">18</div>
              <div className="text-xs text-blue-200">Teams</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">350+</div>
              <div className="text-xs text-blue-200">Players</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">42</div>
              <div className="text-xs text-blue-200">Years</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="text-center mt-8 text-white/50 text-xs"
        >
          <p>© 2025 Rivervalley Rangers AFC</p>
          <p className="mt-1">Dublin's Community Football Club</p>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
    </div>
  );
}