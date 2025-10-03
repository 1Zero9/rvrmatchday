/**
 * 📱 MOBILE MATCH RECORDER
 * Simple, fast match recording for coaches on the sideline
 * Optimized for touch interaction and speed
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileLoading, MobileError } from './MobileAppCore';

interface Player {
  id: string;
  name: string;
  position: string;
  number?: number;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'yellow' | 'red' | 'sub';
  playerId: string;
  playerName: string;
  minute: number;
  timestamp: Date;
}

interface MobileMatchRecordProps {
  onBack: () => void;
}

export default function MobileMatchRecord({ onBack }: MobileMatchRecordProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showEventOptions, setShowEventOptions] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  // Load team players
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock player data
        setPlayers([
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
        ]);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load team data');
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // Add event
  const addEvent = (type: MatchEvent['type']) => {
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

    // Update score for goals
    if (type === 'goal') {
      setHomeScore(prev => prev + 1);
    }

    // Close modals
    setSelectedPlayer(null);
    setShowEventOptions(false);
  };

  // Remove event
  const removeEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event?.type === 'goal') {
      setHomeScore(prev => Math.max(0, prev - 1));
    }
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Get event icon and color
  const getEventDisplay = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return { icon: '⚽', color: 'text-green-600', bg: 'bg-green-100' };
      case 'assist': return { icon: '👟', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'yellow': return { icon: '🟨', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'red': return { icon: '🟥', color: 'text-red-600', bg: 'bg-red-100' };
      case 'sub': return { icon: '🔄', color: 'text-purple-600', bg: 'bg-purple-100' };
      default: return { icon: '📝', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <MobileLoading />
        <p className="text-center text-gray-600 mt-4">Loading team data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <MobileError message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          <h1 className="font-bold text-lg">Match Recorder</h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#972A4C] to-[#5E7794] text-white p-6"
      >
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">RVR Rangers U12</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-4xl font-bold">{homeScore}</div>
              <div className="text-sm opacity-80">Home</div>
            </div>
            <div className="text-2xl opacity-60">-</div>
            <div className="text-center">
              <div className="text-4xl font-bold">{awayScore}</div>
              <div className="text-sm opacity-80">Away</div>
            </div>
          </div>
          
          {/* Match Time */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentMinute(Math.max(0, currentMinute - 1))}
              className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl"
            >
              -
            </button>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <span className="text-xl font-bold">{currentMinute}'</span>
            </div>
            <button
              onClick={() => setCurrentMinute(currentMinute + 1)}
              className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl"
            >
              +
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => addEvent('goal')}
            className="bg-green-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
          >
            <span>⚽</span>
            <span>Quick Goal</span>
          </button>
          <button
            onClick={() => setShowEventOptions(true)}
            className="bg-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
          >
            <span>📝</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Player Selection Grid */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-4">Select Player</h3>
        <div className="grid grid-cols-3 gap-3">
          {players.map((player) => (
            <motion.button
              key={player.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPlayer(player)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPlayer?.id === player.id
                  ? 'border-[#972A4C] bg-[#972A4C]/10'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-bold text-lg">{player.number}</div>
                <div className="text-xs text-gray-600 mt-1 truncate">{player.name}</div>
                <div className="text-xs text-gray-500">{player.position}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-4">Recent Events</h3>
          <div className="space-y-2">
            {events.slice(-5).reverse().map((event) => {
              const display = getEventDisplay(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${display.bg}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{display.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{event.playerName}</div>
                      <div className="text-sm text-gray-600">{event.minute}' - {event.type}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Options Modal */}
      <AnimatePresence>
        {showEventOptions && selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setShowEventOptions(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="bg-white rounded-t-2xl p-6 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg">Add Event</h3>
                <p className="text-gray-600">For {selectedPlayer.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addEvent('goal')}
                  className="bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <span>⚽</span>
                  <span>Goal</span>
                </button>
                <button
                  onClick={() => addEvent('assist')}
                  className="bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <span>👟</span>
                  <span>Assist</span>
                </button>
                <button
                  onClick={() => addEvent('yellow')}
                  className="bg-yellow-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <span>🟨</span>
                  <span>Yellow</span>
                </button>
                <button
                  onClick={() => addEvent('red')}
                  className="bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <span>🟥</span>
                  <span>Red Card</span>
                </button>
              </div>

              <button
                onClick={() => setShowEventOptions(false)}
                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Match Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#972A4C] text-white py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          Save Match
        </motion.button>
      </div>
    </div>
  );
}