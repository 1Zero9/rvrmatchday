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
      name: 'Our Teams',
      description: 'All Squads & Ages',
      href: '/teams',
      icon: '👥',
      gradient: 'from-[#972A4C] to-[#5E7794]',
      size: 'large', // Featured app
      badge: null
    },
    {
      name: 'MatchDay',
      description: 'Live Scores & Results',
      href: '/matchday',
      icon: '⚽',
      gradient: 'from-[#5E7794] to-[#98C0F0]',
      size: 'medium',
      badge: null
    },
    {
      name: 'Match Central',
      description: 'Coach Dashboard',
      href: '/match-central',
      icon: '🏆',
      gradient: 'from-[#972A4C] to-[#98C0F0]',
      size: 'medium',
      badge: '🔒'
    },
    {
      name: 'Join Club',
      description: 'Book Your Trial',
      href: '/join/trials',
      icon: '🎯',
      gradient: 'from-[#98C0F0] to-[#972A4C]',
      size: 'medium',
      badge: null
    },
    {
      name: 'Gallery',
      description: 'Match Photos',
      href: '/gallery',
      icon: '📸',
      gradient: 'from-[#972A4C]/80 to-[#5E7794]',
      size: 'medium',
      badge: null
    },
    {
      name: 'News',
      description: 'Latest Updates',
      href: '/news',
      icon: '📰',
      gradient: 'from-[#B6B7B6] to-[#5E7794]',
      size: 'medium',
      badge: null
    },
    {
      name: 'Contact',
      description: 'Get in Touch',
      href: '/contact',
      icon: '📞',
      gradient: 'from-[#5E7794] to-[#B6B7B6]',
      size: 'medium',
      badge: null
    }
  ];

  const AppIcon = ({ app, index }: { app: any, index: number }) => {
    const sizeClasses = {
      large: 'col-span-2 h-32', // Featured app
      medium: 'h-24',
      small: 'h-24' // Make small same as medium
    };

    const iconSizes = {
      large: 'text-4xl',
      medium: 'text-2xl', 
      small: 'text-2xl' // Make small same as medium
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
            drop-shadow-lg
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#972A4C] via-[#972A4C] to-[#972A4C]/70 relative overflow-hidden pb-20">
      
      {/* Enhanced Background Pattern with Glass Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#98C0F0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#972A4C]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-[#B6B7B6]/15 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating glass orbs */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-white/20 backdrop-blur-sm rounded-full animate-float" />
        <div className="absolute top-40 left-8 w-6 h-6 bg-white/15 backdrop-blur-sm rounded-full animate-float delay-1000" />
        <div className="absolute bottom-32 right-20 w-3 h-3 bg-white/25 backdrop-blur-sm rounded-full animate-float delay-2000" />
      </div>

      {/* Header with Combined Logo and Title - Clean Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-6 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative"
        >
          {/* Header Layout: Logo Left, Title Centered */}
          <div className="relative mb-3">
            {/* Home button indicator */}
            <Link href="/home" className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg z-10">
              <span className="text-white text-xs font-bold">🏠</span>
            </Link>
            
            <div className="flex items-center">
              {/* Logo - Left Side */}
              <Link href="/home" className="group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0"
                >
                  <Image 
                    src="/images/logo.png" 
                    alt="RVR AFC Logo" 
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg drop-shadow-2xl"
                  />
                </motion.div>
              </Link>
              
              {/* Title - Centered */}
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold drop-shadow-lg leading-tight text-white border-b-2 border-blue-400 pb-1 mb-1 inline-block">Rivervalley Rangers AFC</h1>
                <p className="text-blue-200 text-xs drop-shadow-md">Community Football Since 1981</p>
              </div>
            </div>
          </div>
          
          {/* Greeting Bar - Minimal style */}
          <div className="text-center">
            <p className="text-white/80 text-xs font-medium drop-shadow-md">
              {greeting} • {currentTime.toLocaleDateString('en-IE', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
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
            
            <div className="relative z-10 grid grid-cols-3 gap-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">18</div>
                <div className="text-xs text-blue-200 font-bold drop-shadow-lg uppercase tracking-wider">Teams</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">350+</div>
                <div className="text-xs text-blue-200 font-bold drop-shadow-lg uppercase tracking-wider">Players</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">42</div>
                <div className="text-xs text-blue-200 font-bold drop-shadow-lg uppercase tracking-wider">Years</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="text-center mt-8 mx-4"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-lg">
            <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
            <div className="relative z-10 text-white/70 text-xs flex items-center justify-center space-x-2">
              <span>💡</span>
              <span className="font-medium">Tap the logo to return home from any page</span>
            </div>
          </div>
        </motion.div>

        {/* Best Viewed on Desktop Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-center mt-6 mx-4"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
            <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="text-3xl mb-2">🖥️</div>
              <h3 className="text-white font-bold text-sm mb-2">Enhanced Desktop Experience</h3>
              <p className="text-blue-200 text-xs mb-3 leading-relaxed">
                For the full website experience with advanced features, detailed match statistics, and comprehensive team management tools, visit us on desktop or tablet.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <span className="text-lg mb-1 block">📊</span>
                  <span className="text-white font-medium">Advanced Stats</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <span className="text-lg mb-1 block">🎛️</span>
                  <span className="text-white font-medium">Admin Tools</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}