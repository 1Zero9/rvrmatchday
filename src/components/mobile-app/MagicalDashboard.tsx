/**
 * ✨ MAGICAL MOBILE DASHBOARD
 * Premium glass morphism with stunning animations
 * Inspired by Uber, Livescore, and world-class mobile apps
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  GlassCard, 
  FloatingActionButton, 
  ProgressRing, 
  ParticleBackground,
  MagicalSpinner,
  SlideUpPanel,
  HapticButton,
  PremiumTokens 
} from './PremiumDesignSystem';

interface MagicalDashboardProps {
  onNavigate: (screen: string) => void;
  user?: any;
}

export default function MagicalDashboard({ onNavigate, user }: MagicalDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [liveStats, setLiveStats] = useState({
    goals: 0,
    assists: 0,
    matches: 0,
    winRate: 0
  });
  const [greeting, setGreeting] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based animations
  const { scrollY } = useScroll({ container: containerRef });
  const headerY = useTransform(scrollY, [0, 200], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  // Initialize with magical loading
  useEffect(() => {
    const initDashboard = async () => {
      // Set greeting
      const hour = new Date().getHours();
      setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

      // Animate stats loading
      const animateStats = () => {
        const targets = { goals: 23, assists: 18, matches: 12, winRate: 78 };
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);

          setLiveStats({
            goals: Math.floor(targets.goals * easeOutQuart),
            assists: Math.floor(targets.assists * easeOutQuart),
            matches: Math.floor(targets.matches * easeOutQuart),
            winRate: Math.floor(targets.winRate * easeOutQuart)
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      };

      setTimeout(() => {
        setIsLoading(false);
        animateStats();
      }, 1500);
    };

    initDashboard();
  }, []);

  // Quick action items with beautiful icons
  const quickActions = [
    {
      id: 'record',
      title: 'Record Match',
      subtitle: 'Live scoring',
      icon: '⚽',
      gradient: 'primary' as const,
      action: () => onNavigate('match-record'),
      glow: true
    },
    {
      id: 'fixtures',
      title: 'Fixtures',
      subtitle: 'Upcoming games',
      icon: '📅',
      gradient: 'secondary' as const,
      action: () => onNavigate('fixtures')
    },
    {
      id: 'stats',
      title: 'Statistics',
      subtitle: 'Player analytics',
      icon: '📊',
      gradient: 'success' as const,
      action: () => setShowQuickActions(true)
    },
    {
      id: 'teams',
      title: 'Teams',
      subtitle: 'Squad management',
      icon: '👥',
      gradient: 'magical' as const,
      action: () => onNavigate('teams')
    }
  ];

  // Loading state with magical spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Image 
              src="/images/logo.png" 
              alt="RVR AFC" 
              width={80} 
              height={80} 
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
          
          <MagicalSpinner size="lg" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-white"
          >
            <h2 className={`text-xl ${PremiumTokens.typography.headline} mb-2`}>
              RVR AFC
            </h2>
            <p className="text-white/70">Loading your dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" ref={containerRef}>
      <ParticleBackground />
      
      {/* Magical Header */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative z-10 p-6"
      >
        <GlassCard intensity="strong" className="p-6" glow>
          <div className="flex items-center justify-between">
            {/* User Info with Avatar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Profile" 
                  width={50} 
                  height={50} 
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
              </div>
              
              <div>
                <motion.h1 
                  className={`text-xl text-white ${PremiumTokens.typography.headline}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}!
                </motion.h1>
                <motion.p 
                  className="text-white/70 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {user ? `Welcome back, ${user.name?.split(' ')[0]}` : 'Ready to score?'}
                </motion.p>
              </div>
            </motion.div>

            {/* Live Status */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full backdrop-blur-md"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">LIVE</span>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Live Stats Cards */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Goals Card */}
          <GlassCard intensity="medium" hover glow gradient="primary">
            <div className="p-4 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-3xl mb-2"
              >
                ⚽
              </motion.div>
              <motion.div
                className="text-2xl font-bold mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {liveStats.goals}
              </motion.div>
              <div className="text-xs text-white/80">Goals Scored</div>
            </div>
          </GlassCard>

          {/* Win Rate Card with Progress Ring */}
          <GlassCard intensity="medium" hover glow gradient="success">
            <div className="p-4 text-center text-white">
              <div className="flex justify-center mb-2">
                <ProgressRing 
                  progress={liveStats.winRate} 
                  size={50} 
                  strokeWidth={4}
                  color="#10b981"
                  showText={false}
                />
              </div>
              <div className="text-lg font-bold mb-1">{liveStats.winRate}%</div>
              <div className="text-xs text-white/80">Win Rate</div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 mb-6">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className={`text-lg text-white ${PremiumTokens.typography.headline} mb-4`}
        >
          Quick Actions
        </motion.h3>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 1.6 + index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <GlassCard 
                intensity="medium" 
                hover 
                glow={action.glow}
                gradient={action.gradient}
                className="cursor-pointer"
              >
                <HapticButton
                  onClick={action.action}
                  variant={action.gradient}
                  className="w-full h-full p-6 bg-transparent shadow-none"
                >
                  <div className="text-center">
                    <motion.div
                      className="text-4xl mb-3"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 10,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      {action.icon}
                    </motion.div>
                    <h4 className="font-bold text-lg mb-1">{action.title}</h4>
                    <p className="text-sm opacity-80">{action.subtitle}</p>
                  </div>
                </HapticButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Match Preview */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <GlassCard intensity="strong" hover glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg text-white ${PremiumTokens.typography.headline}`}>
                Next Match
              </h3>
              <div className="flex items-center space-x-1 bg-blue-500/20 px-2 py-1 rounded-full">
                <span className="text-xs">🏠</span>
                <span className="text-blue-400 text-xs font-semibold">HOME</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="font-bold text-white text-lg">RVR Rangers</div>
                <div className="text-white/60 text-xs">U12</div>
              </div>

              <motion.div 
                className="mx-6 text-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-white/40 text-2xl font-bold">VS</div>
                <div className="text-xs text-white/60 mt-1">Saturday</div>
              </motion.div>

              <div className="text-center flex-1">
                <div className="font-bold text-white text-lg">Castleknock</div>
                <div className="text-white/60 text-xs">Celtic</div>
              </div>
            </div>

            <div className="text-center border-t border-white/20 pt-4">
              <div className="text-white/80 text-sm font-medium">2:00 PM</div>
              <div className="text-white/60 text-xs">Rivervalley Sports Ground</div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          <h3 className={`text-lg text-white ${PremiumTokens.typography.headline} mb-4`}>
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {[
              { icon: '⚽', text: 'Goal scored vs Blanchardstown', time: '2h ago', color: 'green' },
              { icon: '🟨', text: 'Yellow card - Michael O\'Brien', time: '1d ago', color: 'yellow' },
              { icon: '🏆', text: 'Match won 3-1', time: '2d ago', color: 'blue' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8 + index * 0.1 }}
              >
                <GlassCard intensity="subtle" hover className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{activity.text}</div>
                      <div className="text-white/60 text-xs">{activity.time}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButton
        icon="⚽"
        label="Quick Record"
        onClick={() => onNavigate('match-record')}
        position="bottom-right"
        gradient="primary"
        pulse={user ? true : false}
      />

      {/* Stats Panel */}
      <SlideUpPanel 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        height="h-96"
      >
        <div className="text-white">
          <h3 className={`text-xl ${PremiumTokens.typography.headline} mb-6 text-center`}>
            Season Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <ProgressRing progress={75} size={80} color="#10b981" />
              <div className="mt-2 text-sm">Attendance</div>
            </div>
            <div className="text-center">
              <ProgressRing progress={liveStats.winRate} size={80} color="#972A4C" />
              <div className="mt-2 text-sm">Win Rate</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span>Goals per Game</span>
              <span className="font-bold">2.3</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Clean Sheets</span>
              <span className="font-bold">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Top Scorer</span>
              <span className="font-bold">Kevin S. (12)</span>
            </div>
          </div>
        </div>
      </SlideUpPanel>
    </div>
  );
}