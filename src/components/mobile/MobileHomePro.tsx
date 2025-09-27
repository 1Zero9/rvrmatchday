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
import { useAuth } from '../SecureAuth';

export default function MobileHomePro() {
  // Auth context - safely handle if not available
  let user = null;
  let profile = null;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    profile = authContext.profile;
  } catch (error) {
    // AuthProvider not available, continue with fallback values
  }

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [teamsCount, setTeamsCount] = useState(0);
  const [playersCount, setPlayersCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  
  // Video hero state for mobile optimization
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection and video optimization
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
      
      setIsMobile(isMobileDevice);
      
      // Only show video on good connections and if user hasn't seen it recently
      const hasSeenVideo = sessionStorage.getItem('rvr-video-seen');
      if (!isSlowConnection && !hasSeenVideo && isMobileDevice) {
        setVideoLoading(true);
        setShowVideo(true);
      }
    };
    
    checkMobile();
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setVideoLoading(false);
    sessionStorage.setItem('rvr-video-seen', 'true');
    setTimeout(() => {
      setShowVideo(false);
    }, 500);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

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

  // Counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      // Teams counter: 0 to 18
      const teamsTimer = setInterval(() => {
        setTeamsCount(prev => {
          if (prev < 18) return prev + 1;
          clearInterval(teamsTimer);
          return 18;
        });
      }, 80);

      // Players counter: 0 to 350+ (animate to 350)
      const playersTimer = setInterval(() => {
        setPlayersCount(prev => {
          if (prev < 350) return prev + 15;
          clearInterval(playersTimer);
          return 350;
        });
      }, 60);

      // Years counter: 0 to 42
      const yearsTimer = setInterval(() => {
        setYearsCount(prev => {
          if (prev < 42) return prev + 2;
          clearInterval(yearsTimer);
          return 42;
        });
      }, 70);
    };

    // Start animation after initial page load delay
    const startDelay = setTimeout(animateCounters, 1500);
    
    return () => {
      clearTimeout(startDelay);
    };
  }, []);

  // Main app icons - iPhone style with rounded rectangles
  const publicAppIcons = [
    {
      name: 'Our Teams',
      description: 'All Squads & Ages',
      href: '/teams',
      icon: '👥',
      gradient: 'from-blue-500 to-indigo-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'Join Club',
      description: 'Book Your Trial',
      href: '/join/trials',
      icon: '🎯',
      gradient: 'from-purple-500 to-violet-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'MatchDay',
      description: 'Live Scores & Results',
      href: '/matchday',
      icon: '⚽',
      gradient: 'from-green-500 to-emerald-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'Gallery',
      description: 'Match Photos',
      href: '/gallery',
      icon: '📸',
      gradient: 'from-pink-500 to-rose-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'News',
      description: 'Latest Updates',
      href: '/news',
      icon: '📰',
      gradient: 'from-slate-500 to-gray-600',
      size: 'medium',
      badge: null
    },
    {
      name: 'Contact',
      description: 'Get in Touch',
      href: '/contact',
      icon: '📞',
      gradient: 'from-teal-500 to-cyan-600',
      size: 'medium',
      badge: null
    }
  ];

  // Private/Admin access - shown at bottom
  const adminAppIcon = {
    name: 'Match Central',
    description: 'Coach Dashboard',
    href: '/match-central-secure',
    icon: '🏆',
    gradient: 'from-amber-500 to-orange-600',
    size: 'small',
    badge: '🔒'
  };

  const AppIcon = ({ app, index }: { app: any, index: number }) => {
    const sizeClasses = {
      large: 'col-span-2 h-32', // Featured app
      medium: 'h-20',
      small: 'h-16'
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
    <div className="min-h-screen relative overflow-hidden pb-20">
      
      {/* Mobile Video/Image Hero Background */}
      <div className="absolute inset-0">
        {/* Video Background - Mobile Optimized */}
        {showVideo && isMobile && (
          <>
            <motion.video
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={handleVideoEnd}
              onLoadedData={handleVideoLoad}
              className="w-full h-full object-cover brightness-110"
              animate={{ opacity: videoEnded ? 0 : 1 }}
              transition={{ duration: 1 }}
              style={{ 
                // Mobile optimization - reduce quality for performance
                filter: 'brightness(1.1) contrast(0.9)'
              }}
            >
              <source src="/images/hero/rvr-drone-5.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>
            
            {/* Video Loading Indicator */}
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="text-white text-sm font-medium">Loading video...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Fallback Image - shows when video ends or on slow connections */}
        <motion.img 
          src="/images/hero/halftime2.jpg" 
          alt="Football field background"
          className="w-full h-full object-cover brightness-110"
          initial={{ opacity: showVideo && isMobile ? 0 : 1 }}
          animate={{ opacity: showVideo && isMobile ? 0 : 1 }}
          transition={{ duration: 1 }}
        />
        
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Club maroon accent at top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/60 to-transparent"></div>
      
      {/* Enhanced Background Pattern with Glass Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating glass orbs */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-white/20 backdrop-blur-sm rounded-full animate-bounce" />
        <div className="absolute top-40 left-8 w-6 h-6 bg-white/15 backdrop-blur-sm rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-20 w-3 h-3 bg-white/25 backdrop-blur-sm rounded-full animate-ping" />
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
                    width={72}
                    height={72}
                    className="w-20 h-20 rounded-xl drop-shadow-2xl"
                  />
                </motion.div>
              </Link>
              
              {/* Title - Centered */}
              <div className="flex-1 text-center ml-4">
                <h1 className="text-xl font-bold drop-shadow-lg leading-tight text-white mb-1">Rivervalley Rangers AFC</h1>
                <p className="text-blue-200 text-xs drop-shadow-md font-medium">Community Football Since 1981</p>
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
          {publicAppIcons.map((app, index) => (
            <AppIcon key={app.name} app={app} index={index} />
          ))}
        </motion.div>

        {/* Enhanced Quick Stats with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 relative max-w-sm mx-auto"
        >
          {/* Glass container with multiple layers */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-2xl">
            <div className="absolute inset-1 bg-white/10 rounded-2xl backdrop-blur-sm" />
            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            
            <div className="relative z-10 grid grid-cols-3 gap-6 text-center">
              <motion.div 
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 120, damping: 12 }}
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: 15,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                className="transform transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
                  animate={{ 
                    textShadow: [
                      "0 0 0 rgba(59, 130, 246, 0)",
                      "0 0 20px rgba(59, 130, 246, 0.8)",
                      "0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {teamsCount}
                </motion.div>
                <div className="text-xs text-slate-200 font-bold drop-shadow-lg uppercase tracking-wider group-hover:text-blue-200 transition-colors duration-300">Teams</div>
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 120, damping: 12 }}
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: -15,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                className="transform transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 0 rgba(34, 197, 94, 0)",
                      "0 0 25px rgba(34, 197, 94, 0.9)",
                      "0 0 0 rgba(34, 197, 94, 0)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  {playersCount}+
                </motion.div>
                <div className="text-xs text-slate-200 font-bold drop-shadow-lg uppercase tracking-wider group-hover:text-emerald-200 transition-colors duration-300">Players</div>
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 120, damping: 12 }}
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: 15,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                className="transform transition-all duration-300 cursor-pointer group"
              >
                <motion.div 
                  className="text-4xl font-black text-white drop-shadow-2xl mb-1 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    textShadow: [
                      "0 0 0 rgba(245, 158, 11, 0)",
                      "0 0 30px rgba(245, 158, 11, 1)",
                      "0 0 0 rgba(245, 158, 11, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                >
                  {yearsCount}
                </motion.div>
                <div className="text-xs text-slate-200 font-bold drop-shadow-lg uppercase tracking-wider group-hover:text-amber-200 transition-colors duration-300">Years</div>
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="text-center mt-6 mx-4"
        >
          <div className="bg-white/15 backdrop-blur-xl rounded-xl p-3 border border-white/25 shadow-lg">
            <div className="relative z-10 text-white/80 text-xs flex items-center justify-center space-x-2">
              <span className="text-sm">💡</span>
              <span className="font-medium">Tap the logo to return home from any page</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Desktop Experience */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-center mt-4 mx-4"
        >
          <div className="bg-white/15 backdrop-blur-xl rounded-xl p-4 border border-white/25 shadow-lg">
            <div className="relative z-10">
              <div className="text-2xl mb-2">🖥️</div>
              <h3 className="text-white font-semibold text-sm mb-2">Enhanced Desktop Experience</h3>
              <p className="text-white/70 text-xs mb-3 leading-relaxed">
                Full website features, advanced stats, and comprehensive management tools available on desktop.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <span className="text-base mb-1 block">📊</span>
                  <span className="text-white/90 font-medium">Advanced Stats</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <span className="text-base mb-1 block">🎛️</span>
                  <span className="text-white/90 font-medium">Admin Tools</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin/Coach Access - Bottom Section - Show for all authenticated users */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="text-center mt-6 mx-4 mb-4"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="relative z-10">
                <div className="text-xl mb-2">⚽</div>
                <h3 className="text-white/70 font-medium text-sm mb-3">Match Central Access</h3>
                
                {/* Match Central as small discrete button */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.7, type: "spring", stiffness: 100 }}
                  className="inline-block mb-3"
                >
                  <AppIcon app={adminAppIcon} index={0} />
                </motion.div>
                
                <p className="text-white/60 text-xs leading-relaxed">
                  Welcome back, {profile?.full_name?.split(' ')[0] || profile?.username || 'User'}! Access your dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}