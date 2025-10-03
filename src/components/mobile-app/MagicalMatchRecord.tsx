/**
 * ⚽ MAGICAL MATCH RECORDER
 * Premium real-time match recording with stunning animations
 * Live score tracking with haptic feedback and visual effects
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  GlassCard, 
  FloatingActionButton, 
  HapticButton,
  SlideUpPanel,
  ParticleBackground,
  PremiumTokens 
} from './PremiumDesignSystem';

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub';
  playerId: string;
  playerName: string;
  minute: number;
  timestamp: Date;
}

interface MagicalMatchRecordProps {
  onBack: () => void;
}

export default function MagicalMatchRecord({ onBack }: MagicalMatchRecordProps) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showEventOptions, setShowEventOptions] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [celebrationActive, setCelebrationActive] = useState(false);
  
  const scoreAnimation = useAnimation();
  const celebrationRef = useRef<HTMLDivElement>(null);

  // Mock players data
  const players: Player[] = [
    { id: '1', name: 'John Murphy', position: 'GK', number: 1 },
    { id: '2', name: 'Sean Kelly', position: 'DF', number: 2 },
    { id: '3', name: 'Michael O\'Brien', position: 'DF', number: 3 },
    { id: '4', name: 'David Walsh', position: 'MF', number: 4 },
    { id: '5', name: 'James Ryan', position: 'MF', number: 5 },
    { id: '6', name: 'Patrick Byrne', position: 'FW', number: 6 },
    { id: '7', name: 'Thomas McCarthy', position: 'FW', number: 7 },
    { id: '8', name: 'Christopher Doyle', position: 'MF', number: 8 },
    { id: '9', name: 'Kevin Sullivan', position: 'FW', number: 9 },
    { id: '10', name: 'Andrew Quinn', position: 'MF', number: 10 },
    { id: '11', name: 'Robert Connor', position: 'FW', number: 11 }
  ];

  // Live timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setCurrentMinute(prev => prev + 1);
      }, 60000); // 1 minute intervals
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Goal celebration effect
  const triggerGoalCelebration = async () => {
    setCelebrationActive(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Score animation
    await scoreAnimation.start({
      scale: [1, 1.3, 1],
      rotateY: [0, 360, 0],
      transition: { duration: 1, ease: "easeInOut" }
    });

    setTimeout(() => setCelebrationActive(false), 3000);
  };

  // Add event with magical animations
  const addEvent = async (type: MatchEvent['type']) => {
    if (!selectedPlayer) return;

    const newEvent: MatchEvent = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      minute: currentMinute,
      timestamp: new Date()
    };

    setEvents(prev => [...prev, newEvent]);

    if (type === 'goal') {
      setHomeScore(prev => prev + 1);
      await triggerGoalCelebration();
    }

    setSelectedPlayer(null);
    setShowEventOptions(false);
    setShowPlayerSelect(false);
  };

  // Quick goal action
  const quickGoal = () => {
    if (players.length > 0) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      setSelectedPlayer(randomPlayer);
      addEvent('goal');
    }
  };

  // Match timer controls
  const toggleMatchTimer = () => {
    setIsLive(!isLive);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return { icon: '⚽', color: 'text-green-500', bg: 'bg-green-500/20' };
      case 'assist': return { icon: '👟', color: 'text-blue-500', bg: 'bg-blue-500/20' };
      case 'yellow': return { icon: '🟨', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
      case 'red': return { icon: '🟥', color: 'text-red-500', bg: 'bg-red-500/20' };
      case 'sub': return { icon: '🔄', color: 'text-purple-500', bg: 'bg-purple-500/20' };
      default: return { icon: '📝', color: 'text-gray-500', bg: 'bg-gray-500/20' };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground />
      
      {/* Goal Celebration Overlay */}
      <AnimatePresence>
        {celebrationActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Fireworks Effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  y: [0, -100, -200],
                  x: [0, (Math.random() - 0.5) * 200]
                }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
            
            {/* GOAL Text */}
            <motion.div
              initial={{ scale: 0, rotateZ: -180 }}
              animate={{ scale: 1, rotateZ: 0 }}
              exit={{ scale: 0, rotateZ: 180 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-6xl font-black text-white drop-shadow-2xl">
                ⚽ GOAL! ⚽
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 p-6"
      >
        <GlassCard intensity="strong" className="p-4">
          <div className="flex items-center justify-between">
            <HapticButton
              onClick={onBack}
              variant="secondary"
              className="px-4 py-2 text-sm"
            >
              ← Back
            </HapticButton>
            
            <h1 className={`text-lg text-white ${PremiumTokens.typography.headline}`}>
              Match Recorder
            </h1>
            
            <div className="w-16" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-6 mb-6"
      >
        <GlassCard intensity="strong" glow className="p-8">
          <div className="text-center">
            <h2 className={`text-xl text-white ${PremiumTokens.typography.headline} mb-6`}>
              RVR Rangers U12
            </h2>
            
            {/* Score */}
            <motion.div 
              animate={scoreAnimation}
              className="flex items-center justify-center space-x-8 mb-6"
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl font-black text-white mb-2"
                  key={homeScore}
                  initial={{ scale: 1.5, color: '#10b981' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.5 }}
                >
                  {homeScore}
                </motion.div>
                <div className="text-white/70 text-sm">HOME</div>
              </div>
              
              <div className="text-white/40 text-3xl font-bold">-</div>
              
              <div className="text-center">
                <div className="text-6xl font-black text-white mb-2">{awayScore}</div>
                <div className="text-white/70 text-sm">AWAY</div>
              </div>
            </motion.div>
            
            {/* Match Timer */}
            <div className="flex items-center justify-center space-x-4">
              <HapticButton
                onClick={() => setCurrentMinute(Math.max(0, currentMinute - 1))}
                variant="secondary"
                className="w-12 h-12 rounded-full text-xl"
              >
                -
              </HapticButton>
              
              <GlassCard intensity="medium" className="px-6 py-3">
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={toggleMatchTimer}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
                  />
                  <span className="text-white text-xl font-bold">{currentMinute}'</span>
                  {isLive && <span className="text-red-400 text-xs animate-pulse">LIVE</span>}
                </div>
              </GlassCard>
              
              <HapticButton
                onClick={() => setCurrentMinute(currentMinute + 1)}
                variant="secondary"
                className="w-12 h-12 rounded-full text-xl"
              >
                +
              </HapticButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HapticButton
              onClick={quickGoal}
              variant="primary"
              className="w-full py-6 text-lg font-bold"
            >
              <div className="flex items-center justify-center space-x-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚽
                </motion.span>
                <span>Quick Goal</span>
              </div>
            </HapticButton>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HapticButton
              onClick={() => setShowPlayerSelect(true)}
              variant="magical"
              className="w-full py-6 text-lg font-bold"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>📝</span>
                <span>Add Event</span>
              </div>
            </HapticButton>
          </motion.div>
        </div>
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className={`text-lg text-white ${PremiumTokens.typography.headline} mb-4`}>
            Match Events
          </h3>
          
          <div className="space-y-3">
            {events.slice(-3).reverse().map((event, index) => {
              const eventDisplay = getEventIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  <GlassCard intensity="medium" hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${eventDisplay.bg}`}>
                          <span className="text-xl">{eventDisplay.icon}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{event.playerName}</div>
                          <div className="text-white/70 text-sm">{event.minute}' - {event.type.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (event.type === 'goal') {
                            setHomeScore(prev => Math.max(0, prev - 1));
                          }
                          setEvents(prev => prev.filter(e => e.id !== event.id));
                        }}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Player Selection Panel */}
      <SlideUpPanel 
        isOpen={showPlayerSelect} 
        onClose={() => setShowPlayerSelect(false)}
        height="h-96"
      >
        <div className="text-white">
          <h3 className={`text-xl ${PremiumTokens.typography.headline} mb-6 text-center`}>
            Select Player
          </h3>
          
          <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <HapticButton
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowEventOptions(true);
                    setShowPlayerSelect(false);
                  }}
                  variant="secondary"
                  className="w-full h-20 text-xs p-2"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{player.number}</div>
                    <div className="truncate text-xs">{player.name.split(' ')[0]}</div>
                    <div className="text-xs opacity-70">{player.position}</div>
                  </div>
                </HapticButton>
              </motion.div>
            ))}
          </div>
        </div>
      </SlideUpPanel>

      {/* Event Options Panel */}
      <SlideUpPanel 
        isOpen={showEventOptions} 
        onClose={() => setShowEventOptions(false)}
        height="h-80"
      >
        <div className="text-white">
          <div className="text-center mb-6">
            <h3 className={`text-xl ${PremiumTokens.typography.headline}`}>Add Event</h3>
            <p className="text-white/70">For {selectedPlayer?.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'goal', icon: '⚽', label: 'Goal', variant: 'success' },
              { type: 'assist', icon: '👟', label: 'Assist', variant: 'secondary' },
              { type: 'yellow', icon: '🟨', label: 'Yellow', variant: 'warning' },
              { type: 'red', icon: '🟥', label: 'Red Card', variant: 'magical' }
            ].map((option, index) => (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HapticButton
                  onClick={() => addEvent(option.type as MatchEvent['type'])}
                  variant={option.variant as any}
                  className="w-full py-4 text-lg font-bold"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">{option.icon}</span>
                    <span>{option.label}</span>
                  </div>
                </HapticButton>
              </motion.div>
            ))}
          </div>
        </div>
      </SlideUpPanel>

      {/* Floating Actions */}
      <FloatingActionButton
        icon="💾"
        label="Save Match"
        onClick={() => {
          // Save match logic
          if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
          }
        }}
        position="bottom-right"
        gradient="success"
      />
      
      <FloatingActionButton
        icon={isLive ? '⏸️' : '▶️'}
        label={isLive ? 'Pause' : 'Start'}
        onClick={toggleMatchTimer}
        position="bottom-left"
        gradient={isLive ? 'warning' : 'primary'}
        pulse={isLive}
      />
    </div>
  );
}