/**
 * 🚀 PROFESSIONAL MOBILE HOMEPAGE
 * Premium football club mobile experience
 * 
 * Purpose: Marketing tool + Coaching gateway
 * Target: Convert visitors to players/fans, provide coach access
 */

import { motion } from 'framer-motion';
import { MobileHero, ActionCard, ContentCard } from '../../design/MobileDesignSystem';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MobileHomePro() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Intro animation sequence
    if (showIntro) {
      const sequence = [
        { delay: 0, stage: 0 },     // Logo appears
        { delay: 1000, stage: 1 },  // Logo pulses
        { delay: 2500, stage: 2 },  // Logo with club name
        { delay: 4000, stage: 3 }   // Zoom out transition
      ];

      sequence.forEach(({ delay, stage }) => {
        setTimeout(() => setAnimationStage(stage), delay);
      });

      // Hide intro and show main app
      setTimeout(() => setShowIntro(false), 5000);
    }
  }, [showIntro]);

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
            shadow-2xl hover:shadow-3xl transition-all duration-300
            border border-white/30 backdrop-blur-lg
            flex flex-col items-center justify-center
            relative overflow-hidden
          `}>
            {/* Enhanced Glass effect overlay */}
            <div className="absolute inset-0 bg-white/15 backdrop-blur-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
            
            {/* Inner glass panel */}
            <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 text-center text-white p-3">
              <div className={`${iconSizes[app.size]} mb-2 drop-shadow-lg`}>{app.icon}</div>
              <h3 className={`font-semibold ${app.size === 'large' ? 'text-sm' : 'text-xs'} drop-shadow-md`}>
                {app.name}
              </h3>
              {app.size === 'large' && (
                <p className="text-xs opacity-90 mt-1 drop-shadow-sm">{app.description}</p>
              )}
            </div>

            {/* Badge with glass effect */}
            {app.badge && (
              <div className="absolute -top-1 -right-1 bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-xl border-2 border-white/50">
                {app.badge === 'NEW' ? 'N' : app.badge}
              </div>
            )}

            {/* Enhanced shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0">
              <div className="absolute top-2 right-3 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
              <div className="absolute bottom-3 left-2 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Logo Intro Animation Component
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
        
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Logo Intro Animation */}
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: animationStage >= 0 ? 1 : 0,
            scale: animationStage >= 0 ? 1 : 0
          }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Logo with multiple glass layers */}
          <motion.div
            className="relative mx-auto mb-8"
            animate={{ 
              scale: animationStage === 1 ? [1, 1.1, 1] : 1,
              rotateY: animationStage === 3 ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 1, repeat: animationStage === 1 ? 2 : 0 },
              rotateY: { duration: 1, ease: "easeInOut" }
            }}
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-8 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" />
            
            {/* Glass container */}
            <div className="relative w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl">
              <div className="absolute inset-2 bg-white/5 rounded-2xl backdrop-blur-lg" />
              <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              
              <Image 
                src="/images/logo.png" 
                alt="RVR AFC Logo" 
                width={120}
                height={120}
                className="absolute inset-2 w-28 h-28 rounded-2xl shadow-xl"
              />
            </div>
          </motion.div>

          {/* Club Name Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: animationStage >= 2 ? 1 : 0,
              y: animationStage >= 2 ? 0 : 20
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Glass panel for text */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Rivervalley Rangers AFC
              </h1>
              <p className="text-blue-200 text-lg drop-shadow-md">
                Community Football Since 1981
              </p>
              
              {/* Loading dots */}
              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </motion.div>

          {/* Zoom out effect overlay */}
          {animationStage === 3 && (
            <motion.div
              className="fixed inset-0 bg-white z-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 20 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden pb-20">
      
      {/* Enhanced Background Pattern with Glass Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating glass orbs */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-white/20 backdrop-blur-sm rounded-full animate-float" />
        <div className="absolute top-40 left-8 w-6 h-6 bg-white/15 backdrop-blur-sm rounded-full animate-float delay-1000" />
        <div className="absolute bottom-32 right-20 w-3 h-3 bg-white/25 backdrop-blur-sm rounded-full animate-float delay-2000" />
      </div>

      {/* Header with Enhanced Glass Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-8 text-center relative z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Multiple glass layers for logo */}
            <div className="absolute -inset-6 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-2">
              <div className="absolute inset-1 bg-white/10 rounded-xl backdrop-blur-lg" />
              <Image 
                src="/images/logo.png" 
                alt="RVR AFC Logo" 
                width={64}
                height={64}
                className="relative z-10 w-16 h-16 rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl mx-4"
        >
          <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
          <div className="relative z-10 text-white text-center">
            <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">Rivervalley Rangers AFC</h1>
            <p className="text-blue-200 text-sm mb-2 drop-shadow-md">Community Football Since 1981</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-white/20">
              <p className="text-white/90 text-xs font-medium">
                {greeting} • {currentTime.toLocaleDateString('en-IE', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* App Grid */}
      <div className="px-6 pb-8 relative z-10">
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

        {/* Enhanced Quick Stats with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 relative max-w-sm mx-auto"
        >
          {/* Glass container with multiple layers */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
            <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
            <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-lg" />
            
            <div className="relative z-10 grid grid-cols-3 gap-6 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <div className="text-2xl font-bold text-white drop-shadow-lg">18</div>
                <div className="text-xs text-blue-200 font-medium drop-shadow-md">Teams</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <div className="text-2xl font-bold text-white drop-shadow-lg">350+</div>
                <div className="text-xs text-blue-200 font-medium drop-shadow-md">Players</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
              >
                <div className="text-2xl font-bold text-white drop-shadow-lg">42</div>
                <div className="text-xs text-blue-200 font-medium drop-shadow-md">Years</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Footer with Glass Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="text-center mt-8 mx-4"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
            <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
            <div className="relative z-10 text-white/80 text-xs space-y-1">
              <p className="font-medium drop-shadow-md">© 2025 Rivervalley Rangers AFC</p>
              <p className="text-white/60 drop-shadow-sm">Dublin's Community Football Club</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}