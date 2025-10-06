/**
 * ⚽ SIDELINE MATCH TRACKER
 * Standalone mobile app for parents/coaches at the sideline
 * No data saved - purely for live tracking and sharing
 * Mobile-first with big buttons for easy use
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share, RotateCcw, Play, Pause, SquareStop } from 'lucide-react';

// Add grass animation styles
const grassAnimationCSS = `
  @keyframes grassSway {
    0%, 100% { 
      background-position: 0 0, 100px 100px, 200px 50px, 0 0, 0 0, 0 0, 0 0;
    }
    25% { 
      background-position: 20px 10px, 120px 110px, 220px 60px, 0 0, 0 0, 0 0, 0 0;
    }
    50% { 
      background-position: 10px 20px, 110px 120px, 210px 70px, 0 0, 0 0, 0 0, 0 0;
    }
    75% { 
      background-position: -10px 10px, 90px 110px, 180px 60px, 0 0, 0 0, 0 0, 0 0;
    }
  }
`;

// Inject the CSS animation
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('grass-animation-styles');
  if (!styleElement) {
    const style = document.createElement('style');
    style.id = 'grass-animation-styles';
    style.textContent = grassAnimationCSS;
    document.head.appendChild(style);
  }
}

// Mobile-optimized grass effect background styles
const mobileBackgroundStyle = {
  background: `
    radial-gradient(circle at 20% 80%, rgba(40, 167, 69, 0.8) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(33, 136, 56, 0.6) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(30, 126, 52, 0.7) 0%, transparent 50%),
    linear-gradient(135deg, 
      #1e7e34 0%, 
      #28a745 25%, 
      #218838 50%, 
      #1e7e34 75%,
      #28a745 100%
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.1) 3px,
      rgba(0, 0, 0, 0.1) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 25px,
      rgba(255, 255, 255, 0.03) 25px,
      rgba(255, 255, 255, 0.03) 27px
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.1) 100%
    )
  `,
  backgroundSize: 
    '800px 800px, 600px 600px, 400px 400px, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
  backgroundPosition: 
    '0 0, 100px 100px, 200px 50px, 0 0, 0 0, 0 0, 0 0',
  animation: 'grassSway 8s ease-in-out infinite',
  minHeight: '100vh',
  // iOS Safari viewport height fix
  minHeight: '100dvh'
};

interface MatchEvent {
  id: string;
  type: 'goal' | 'event';
  team: 'home' | 'away';
  minute: number;
  timestamp: Date;
  note?: string;
}

interface MobileMatchRecordProps {
  onBack: () => void;
}

type AppScreen = 'disclaimer' | 'setup' | 'match' | 'complete';

export default function MobileMatchRecord({ onBack }: MobileMatchRecordProps) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('setup');
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [selectedRVRTeam, setSelectedRVRTeam] = useState('');
  const [teamType, setTeamType] = useState('');
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchStarted, setMatchStarted] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [matchDuration, setMatchDuration] = useState(90); // Default 90 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Team types and age groups
  const teamTypes = [
    { value: 'boys', label: 'Boys' },
    { value: 'girls', label: 'Girls' },
    { value: 'ladies', label: 'Ladies' },
    { value: 'men', label: 'Men' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'overs', label: 'Over 35s' },
    { value: 'vets', label: 'Veterans' }
  ];

  const ageGroups = [
    'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'Adult', 'Academy'
  ];

  // Generate team name from selections
  const generateTeamName = () => {
    if (!teamType || !selectedRVRTeam) return '';
    
    const typeLabel = teamTypes.find(t => t.value === teamType)?.label || '';
    if (selectedRVRTeam === 'Adult') {
      return `RVR ${typeLabel}`;
    }
    return `RVR ${typeLabel} ${selectedRVRTeam}`;
  };

  // Keep screen awake during match
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isTimerRunning) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('Screen wake lock activated');
        }
      } catch (err) {
        console.log('Wake lock not supported:', err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Screen wake lock released');
      }
    };

    if (isTimerRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isTimerRunning]);

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setCurrentSecond(prev => {
          if (prev >= 59) {
            setCurrentMinute(prevMin => {
              const newMinute = prevMin + 1;
              // Auto-end match if duration is reached
              if (newMinute >= matchDuration) {
                setIsTimerRunning(false);
                // Could auto-trigger match end here
              }
              return newMinute;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, matchDuration]);

  // Start/Stop timer
  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
    if (!matchStarted) {
      setMatchStarted(true);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentMinute(0);
    setCurrentSecond(0);
    setMatchStarted(false);
  };

  // Format time display
  const formatTime = () => {
    const displayMinute = String(currentMinute).padStart(2, '0');
    const displaySecond = String(currentSecond).padStart(2, '0');
    return `${displayMinute}:${displaySecond}`;
  };

  // Add goal with team tracking
  const addGoal = (team: 'home' | 'away') => {
    const newEvent: MatchEvent = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'goal',
      team,
      minute: currentMinute,
      timestamp: new Date()
    };

    setEvents(prev => [...prev, newEvent]);
    
    if (team === 'home') {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }
  };

  // Remove goal
  const removeGoal = (team: 'home' | 'away') => {
    if (team === 'home' && homeScore > 0) {
      setHomeScore(prev => prev - 1);
      // Remove last home goal from events
      const lastHomeGoalIndex = events.map((e, i) => ({ ...e, index: i })).reverse().find(e => e.type === 'goal' && e.team === 'home')?.index;
      if (lastHomeGoalIndex !== undefined) {
        setEvents(prev => prev.filter((_, i) => i !== lastHomeGoalIndex));
      }
    } else if (team === 'away' && awayScore > 0) {
      setAwayScore(prev => prev - 1);
      // Remove last away goal from events
      const lastAwayGoalIndex = events.map((e, i) => ({ ...e, index: i })).reverse().find(e => e.type === 'goal' && e.team === 'away')?.index;
      if (lastAwayGoalIndex !== undefined) {
        setEvents(prev => prev.filter((_, i) => i !== lastAwayGoalIndex));
      }
    }
  };

  // Generate match summary for sharing
  const generateMatchSummary = () => {
    const duration = currentMinute;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `⚽ Match Result ⚽
${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}
Date: ${date}
Duration: ${duration} minutes
Total Events: ${events.length}

📱 Tracked with RVR Sideline Tracker`;
  };

  // Share match results
  const shareMatch = () => {
    const summary = generateMatchSummary();
    if (navigator.share) {
      navigator.share({
        title: 'Match Result',
        text: summary
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(summary);
      alert('Match summary copied to clipboard!');
    }
  };

  // Reset match
  const resetMatch = () => {
    if (confirm('Are you sure you want to reset the match? All data will be lost.')) {
      setHomeScore(0);
      setAwayScore(0);
      setCurrentMinute(0);
      setEvents([]);
      setMatchStarted(false);
      setCurrentScreen('setup');
    }
  };


  // Setup Screen with RVR Team Wizard
  if (currentScreen === 'setup') {
    return (
      <div 
        className="relative flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          minHeight: '100dvh' // Dynamic viewport height for mobile
        }}
      >
        {/* Background image as a separate layer for better mobile support */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={mobileBackgroundStyle}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⚽</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Match Setup</h1>
            <p className="text-gray-600">Set up your match tracking</p>
          </div>
          
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Team Type</label>
              <select
                value={teamType}
                onChange={(e) => {
                  setTeamType(e.target.value);
                  // Auto-update home team when selections change
                  if (e.target.value && selectedRVRTeam) {
                    const typeLabel = teamTypes.find(t => t.value === e.target.value)?.label || '';
                    const teamName = selectedRVRTeam === 'Adult' ? `RVR ${typeLabel}` : `RVR ${typeLabel} ${selectedRVRTeam}`;
                    setHomeTeam(teamName);
                  }
                }}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Team Type</option>
                {teamTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Age Group</label>
              <select
                value={selectedRVRTeam}
                onChange={(e) => {
                  setSelectedRVRTeam(e.target.value);
                  // Auto-update home team when selections change
                  if (teamType && e.target.value) {
                    const typeLabel = teamTypes.find(t => t.value === teamType)?.label || '';
                    const teamName = e.target.value === 'Adult' ? `RVR ${typeLabel}` : `RVR ${typeLabel} ${e.target.value}`;
                    setHomeTeam(teamName);
                  }
                }}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Age Group</option>
                {ageGroups.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Opposition Team</label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="e.g. City United FC"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('match')}
            disabled={!teamType || !selectedRVRTeam || !awayTeam.trim()}
            className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:bg-green-700 transition-colors mb-3"
          >
            Start Match Tracking
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-3 px-6 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Match Complete Screen with sharing
  if (currentScreen === 'complete') {
    return (
      <div 
        className="relative flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          minHeight: '100dvh'
        }}
      >
        {/* Background image as a separate layer for better mobile support */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={mobileBackgroundStyle}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Match Complete!</h1>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border">
            <div className="text-center">
              <h2 className="font-bold text-xl mb-3">{homeTeam} vs {awayTeam}</h2>
              <div className="text-5xl font-bold text-blue-600 mb-3">
                {homeScore} - {awayScore}
              </div>
              <p className="text-gray-600">
                Duration: {formatTime()} • {events.length} goals
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={shareMatch}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Share size={20} />
              <span>Share Result</span>
            </button>
            
            <button
              onClick={() => {
                setHomeScore(0);
                setAwayScore(0);
                setCurrentMinute(0);
                setCurrentSecond(0);
                setEvents([]);
                setMatchStarted(false);
                setIsTimerRunning(false);
                setSelectedRVRTeam('');
                setTeamType('');
                setHomeTeam('');
                setAwayTeam('');
                setCurrentScreen('setup');
              }}
              className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-green-700 transition-colors"
            >
              <RotateCcw size={20} />
              <span>New Match</span>
            </button>
          </div>
          
          <button
            onClick={onBack}
            className="w-full py-3 px-6 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Exit Tracker
          </button>
        </div>
      </div>
    );
  }

  // Main Match Tracking Screen  
  return (
    <div 
      className="relative"
      style={{
        minHeight: '100vh',
        minHeight: '100dvh'
      }}
    >
      {/* Background image as a separate layer for better mobile support */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={mobileBackgroundStyle}
      ></div>
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10">
      {/* Header with teams and back button */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Exit
          </button>
          <button
            onClick={resetMatch}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Reset
          </button>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-lg text-gray-900">{homeTeam} vs {awayTeam}</h1>
        </div>
      </div>

      {/* Main Scoreboard */}
      <div className="bg-blue-600 text-white p-8">
        <div className="text-center mb-8">
          <div className="text-lg font-medium mb-2">Match Time</div>
          
          {/* Timer Display */}
          <div className="mb-4">
            <div className="bg-white/20 rounded-2xl px-8 py-4 backdrop-blur-sm">
              <span className="text-4xl font-bold font-mono">{formatTime()}</span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={toggleTimer}
              className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold hover:bg-white/30 transition-colors"
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold hover:bg-white/30 transition-colors"
              title="Reset Timer"
            >
              <SquareStop size={20} />
            </button>
          </div>

          {/* Manual Time Adjust (for added time, corrections) */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-sm opacity-80">Manual adjust:</span>
            <button
              onClick={() => {
                if (currentSecond > 0) {
                  setCurrentSecond(prev => prev - 1);
                } else if (currentMinute > 0) {
                  setCurrentMinute(prev => prev - 1);
                  setCurrentSecond(59);
                }
              }}
              className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-white/30 transition-colors"
            >
              -
            </button>
            <button
              onClick={() => {
                if (currentSecond >= 59) {
                  setCurrentMinute(prev => prev + 1);
                  setCurrentSecond(0);
                } else {
                  setCurrentSecond(prev => prev + 1);
                }
              }}
              className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-white/30 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Score Display with Integrated Controls */}
        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 items-center">
            
            {/* Home Team */}
            <div className="text-center">
              <div className="text-sm opacity-80 mb-2 truncate">{homeTeam}</div>
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => addGoal('home')}
                  className="w-12 h-12 bg-green-500 text-white rounded-full text-2xl font-bold shadow-lg hover:bg-green-600 transition-colors"
                >
                  +
                </button>
                <div className="text-5xl font-bold">{homeScore}</div>
                <button
                  onClick={() => removeGoal('home')}
                  disabled={homeScore === 0}
                  className="w-12 h-12 bg-red-500 text-white rounded-full text-2xl font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                >
                  -
                </button>
              </div>
            </div>

            {/* VS Separator */}
            <div className="text-center">
              <div className="text-2xl opacity-60 font-bold">VS</div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="text-sm opacity-80 mb-2 truncate">{awayTeam}</div>
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => addGoal('away')}
                  className="w-12 h-12 bg-green-500 text-white rounded-full text-2xl font-bold shadow-lg hover:bg-green-600 transition-colors"
                >
                  +
                </button>
                <div className="text-5xl font-bold">{awayScore}</div>
                <button
                  onClick={() => removeGoal('away')}
                  disabled={awayScore === 0}
                  className="w-12 h-12 bg-red-500 text-white rounded-full text-2xl font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setHomeScore(0);
              setAwayScore(0);
              setEvents([]);
              resetTimer();
            }}
            className="py-4 px-6 bg-gray-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={() => setCurrentScreen('complete')}
            className="py-4 px-6 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            End Match
          </button>
        </div>

        {/* Recent Events - Simplified */}
        {events.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">Goals</h3>
            <div className="space-y-2">
              {events.slice(-3).reverse().map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⚽</span>
                    <span className="font-medium text-gray-900">
                      {event.team === 'home' ? homeTeam : awayTeam}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{event.minute}'</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}