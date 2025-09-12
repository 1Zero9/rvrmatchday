import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import MobileLayout from "../components/MobileLayout";

interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  playerName: string;
  minute: number;
  notes?: string;
  timestamp: Date;
}

interface Match {
  id: string;
  team: string;
  opponent: string;
  date: Date;
  venue: string;
  events: MatchEvent[];
  finalScore?: { home: number; away: number };
}

export default function QuickRecord() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [matchTime, setMatchTime] = useState(0); // in minutes
  const [events, setEvents] = useState<MatchEvent[]>([]);
  
  // Quick setup form
  const [setupForm, setSetupForm] = useState({
    team: '',
    opponent: '',
    venue: '',
    playerName: '' // Child's name
  });

  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    // Auto-increment match time when recording
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setMatchTime(prev => prev + 1);
      }, 60000); // Every minute
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startMatch = () => {
    if (!setupForm.team || !setupForm.opponent || !setupForm.playerName) {
      alert('Please fill in all required fields');
      return;
    }

    const match: Match = {
      id: Date.now().toString(),
      team: setupForm.team,
      opponent: setupForm.opponent,
      date: new Date(),
      venue: setupForm.venue || 'Home',
      events: []
    };

    setCurrentMatch(match);
    setShowSetup(false);
    setIsRecording(true);
    setMatchTime(0);
  };

  const addEvent = (type: MatchEvent['type']) => {
    if (!currentMatch) return;

    const event: MatchEvent = {
      id: Date.now().toString(),
      type,
      playerName: setupForm.playerName,
      minute: matchTime,
      timestamp: new Date()
    };

    setEvents(prev => [...prev, event]);
  };

  const finishMatch = () => {
    if (currentMatch) {
      // Save to localStorage for later viewing
      const savedMatches = localStorage.getItem('parent-matches') || '[]';
      const matches = JSON.parse(savedMatches);
      const finalMatch = { ...currentMatch, events };
      matches.push(finalMatch);
      localStorage.setItem('parent-matches', JSON.stringify(matches));
    }
    
    // Reset everything
    setCurrentMatch(null);
    setIsRecording(false);
    setEvents([]);
    setMatchTime(0);
    setShowSetup(true);
    setSetupForm({ team: '', opponent: '', venue: '', playerName: '' });
  };

  const ActionButton = ({ 
    icon, 
    label, 
    color, 
    onClick, 
    size = 'normal' 
  }: {
    icon: string;
    label: string;
    color: string;
    onClick: () => void;
    size?: 'normal' | 'large';
  }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        ${size === 'large' ? 'p-6 text-lg' : 'p-4'} 
        ${color} text-white rounded-2xl font-semibold shadow-lg
        flex flex-col items-center justify-center space-y-2
        transition-all duration-200 border-2 border-white/20
      `}
    >
      <span className={size === 'large' ? 'text-3xl' : 'text-2xl'}>{icon}</span>
      <span className={size === 'large' ? 'text-base' : 'text-sm'}>{label}</span>
    </motion.button>
  );

  if (showSetup) {
    return (
      <MobileLayout currentPage="/quick-record" showNavigation={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
          
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl text-white">📱</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Record</h1>
              <p className="text-gray-600">Track your child's match events easily</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Child's Name *
                </label>
                <input
                  type="text"
                  value={setupForm.playerName}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, playerName: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sarah Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={setupForm.team}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, team: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., RVR U12 Girls"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Opponent Team *
                </label>
                <input
                  type="text"
                  value={setupForm.opponent}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, opponent: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Milltown FC"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue (Optional)
                </label>
                <input
                  type="text"
                  value={setupForm.venue}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Home Ground"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startMatch}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg"
              >
                Start Match Recording
              </motion.button>
            </motion.div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="/quick-record" showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        
        {/* Match Header */}
        <div className="bg-white shadow-sm p-6 border-b">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">
              {currentMatch?.team} vs {currentMatch?.opponent}
            </h1>
            <p className="text-sm text-gray-600">
              Tracking: {setupForm.playerName}
            </p>
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-green-700">
                {isRecording ? `${matchTime} min` : 'Stopped'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <ActionButton
              icon="⚽"
              label="Goal"
              color="bg-gradient-to-br from-green-500 to-green-600"
              onClick={() => addEvent('goal')}
              size="large"
            />
            <ActionButton
              icon="🅰️"
              label="Assist"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              onClick={() => addEvent('assist')}
              size="large"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <ActionButton
              icon="🟨"
              label="Yellow Card"
              color="bg-gradient-to-br from-yellow-500 to-orange-500"
              onClick={() => addEvent('yellow_card')}
            />
            <ActionButton
              icon="🟥"
              label="Red Card"
              color="bg-gradient-to-br from-red-500 to-red-600"
              onClick={() => addEvent('red_card')}
            />
          </div>

          {/* Events List */}
          {events.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Match Events</h3>
              <div className="space-y-2">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">
                        {event.type === 'goal' && '⚽'}
                        {event.type === 'assist' && '🅰️'}
                        {event.type === 'yellow_card' && '🟨'}
                        {event.type === 'red_card' && '🟥'}
                      </span>
                      <div>
                        <span className="font-medium text-sm">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500">{event.playerName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      {event.minute}'
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRecording(!isRecording)}
              className={`w-full p-4 font-bold rounded-xl shadow-lg ${
                isRecording 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}
            >
              {isRecording ? '⏸️ Pause Recording' : '▶️ Resume Recording'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={finishMatch}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg"
            >
              🏁 Finish Match
            </motion.button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}