/**
 * 🏟️ Next Match Hero Component
 * 
 * Broadcast-style prominence for upcoming matches
 * Creates excitement and urgency for the next battle
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Zap, Trophy, Users } from 'lucide-react';

interface NextMatchHeroProps {
  match: {
    homeTeam: string;
    awayTeam: string;
    matchDate: string;
    matchTime: string;
    venue?: string;
    competition?: string;
    isHomeMatch?: boolean;
  };
  onClick?: () => void;
}

export default function NextMatchHero({ match, onClick }: NextMatchHeroProps) {
  const [timeUntil, setTimeUntil] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isToday: boolean;
    isTomorrow: boolean;
  } | null>(null);

  // Calculate time until match
  useEffect(() => {
    const calculateTimeUntil = () => {
      const now = new Date();
      const matchDateTime = new Date(`${match.matchDate}T${match.matchTime}`);
      const diff = matchDateTime.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const isToday = matchDateTime.toDateString() === today.toDateString();
        const isTomorrow = matchDateTime.toDateString() === tomorrow.toDateString();

        setTimeUntil({ days, hours, minutes, isToday, isTomorrow });
      } else {
        setTimeUntil(null);
      }
    };

    calculateTimeUntil();
    const interval = setInterval(calculateTimeUntil, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [match.matchDate, match.matchTime]);

  // Format match time for display
  const formatMatchTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  // Format match date for display
  const formatMatchDate = (date: string) => {
    try {
      const matchDate = new Date(date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (matchDate.toDateString() === today.toDateString()) {
        return 'TODAY';
      } else if (matchDate.toDateString() === tomorrow.toDateString()) {
        return 'TOMORROW';
      } else {
        return matchDate.toLocaleDateString('en-GB', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }).toUpperCase();
      }
    } catch {
      return date;
    }
  };

  const isUrgent = timeUntil && (timeUntil.isToday || timeUntil.isTomorrow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl cursor-pointer
        ${isUrgent 
          ? 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500' 
          : 'bg-gradient-to-br from-[#972A4C] via-[#7A1D3C] to-[#5A0F26]'
        }
        shadow-2xl border-2 border-white/20
      `}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"
        ></motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`
              px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide
              ${isUrgent 
                ? 'bg-white/90 text-red-600' 
                : 'bg-white/20 text-white'
              }
              flex items-center space-x-2
            `}
          >
            <Zap size={14} />
            <span>
              {timeUntil?.isToday ? '🔥 TODAY!' : 
               timeUntil?.isTomorrow ? '⚡ TOMORROW!' : 
               '🏟️ NEXT BATTLE'}
            </span>
          </motion.div>

          {match.competition && (
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">{match.competition}</span>
            </div>
          )}
        </div>

        {/* Teams Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <motion.div 
              className="flex-1 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-white font-bold text-lg mb-1">
                {match.homeTeam}
              </div>
              {match.isHomeMatch && (
                <div className="text-white/80 text-xs">
                  🏠 HOME
                </div>
              )}
            </motion.div>

            {/* VS Badge */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.3)',
                  '0 0 30px rgba(255, 255, 255, 0.5)',
                  '0 0 20px rgba(255, 255, 255, 0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-white text-gray-900 px-6 py-3 rounded-2xl mx-4 font-black text-xl shadow-lg"
            >
              VS
            </motion.div>

            {/* Away Team */}
            <motion.div 
              className="flex-1 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-white font-bold text-lg mb-1">
                {match.awayTeam}
              </div>
              {!match.isHomeMatch && (
                <div className="text-white/80 text-xs">
                  ✈️ AWAY
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar size={16} className="text-white/80" />
              <span className="text-white/80 text-xs font-medium">DATE</span>
            </div>
            <div className="text-white font-bold text-sm">
              {formatMatchDate(match.matchDate)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Clock size={16} className="text-white/80" />
              <span className="text-white/80 text-xs font-medium">KICK-OFF</span>
            </div>
            <div className="text-white font-bold text-sm">
              {formatMatchTime(match.matchTime)}
            </div>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin size={16} className="text-white/80" />
              <span className="text-white/80 text-xs font-medium">VENUE</span>
            </div>
            <div className="text-white font-bold text-sm">
              {match.venue}
            </div>
          </div>
        )}

        {/* Countdown Timer */}
        {timeUntil && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="text-center">
              <div className="text-white/80 text-xs font-medium mb-2 uppercase tracking-wide">
                ⏰ COUNTDOWN TO BATTLE
              </div>
              <div className="flex justify-center space-x-4">
                {timeUntil.days > 0 && (
                  <div className="text-center">
                    <div className="text-white font-black text-xl">{timeUntil.days}</div>
                    <div className="text-white/60 text-xs">DAYS</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-white font-black text-xl">{timeUntil.hours}</div>
                  <div className="text-white/60 text-xs">HRS</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-black text-xl">{timeUntil.minutes}</div>
                  <div className="text-white/60 text-xs">MIN</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
        >
          <div className="text-white font-bold text-sm flex items-center justify-center space-x-2">
            <Trophy size={16} />
            <span>TAP FOR MATCH DETAILS</span>
            <Users size={16} />
          </div>
        </motion.div>
      </div>

      {/* Pulsing Border Animation for Urgent Matches */}
      {isUrgent && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-4 border-white/50 rounded-3xl pointer-events-none"
        ></motion.div>
      )}
    </motion.div>
  );
}