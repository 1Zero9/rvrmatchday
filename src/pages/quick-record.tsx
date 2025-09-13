import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import MobileLayout from "../components/MobileLayout";
import MobilePageContainer from "../components/mobile/MobilePageContainer";

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
    playerName: '', // Child's name
    matchFormat: '11v11' // Match format
  });

  // Score tracking
  const [score, setScore] = useState({
    home: 0,
    away: 0
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
    if (!setupForm.team || !setupForm.opponent || !setupForm.playerName || !setupForm.matchFormat) {
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


  const finishMatch = () => {
    if (currentMatch) {
      // Save to localStorage for later viewing
      const savedMatches = localStorage.getItem('parent-matches') || '[]';
      const matches = JSON.parse(savedMatches);
      const finalMatch = { 
        ...currentMatch, 
        score,
        matchFormat: setupForm.matchFormat,
        finalMinutes: matchTime
      };
      matches.push(finalMatch);
      localStorage.setItem('parent-matches', JSON.stringify(matches));
    }
    
    // Reset everything
    setCurrentMatch(null);
    setIsRecording(false);
    setEvents([]);
    setScore({ home: 0, away: 0 });
    setMatchTime(0);
    setShowSetup(true);
    setSetupForm({ team: '', opponent: '', venue: '', playerName: '', matchFormat: '11v11' });
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
        <MobilePageContainer 
          title="Quick Record"
          subtitle="Simple Match Tracking"
          icon="📱"
        >
          <div className="max-w-md mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-2xl space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
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
                <label className="block text-sm font-semibold text-white mb-2">
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
                <label className="block text-sm font-semibold text-white mb-2">
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
                <label className="block text-sm font-semibold text-white mb-2">
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

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Match Format *
                </label>
                <select
                  value={setupForm.matchFormat}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, matchFormat: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5v5">5v5 (Small Sided)</option>
                  <option value="7v7">7v7 (U9-U10)</option>
                  <option value="9v9">9v9 (U11-U12)</option>
                  <option value="11v11">11v11 (U13+)</option>
                </select>
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
        </MobilePageContainer>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="/quick-record" showNavigation={false}>
      <MobilePageContainer 
        title="Match Recording"
        subtitle={`${setupForm.matchFormat} • ${setupForm.playerName}`}
        icon="⚽"
      >
        
        {/* Live Score Header */}
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl mb-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-2">
              {currentMatch?.team} vs {currentMatch?.opponent}
            </h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-2 border border-white/20">
              <div className="text-4xl font-bold text-white mb-1">
                {score.home} - {score.away}
              </div>
              <div className="text-xs text-blue-200">{setupForm.matchFormat}</div>
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-green-200">
                {isRecording ? `${matchTime} min` : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Score Tracking */}
        <div>
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl mb-4">
            <h3 className="font-semibold text-white mb-4 text-center">Score Tracking</h3>
            
            {/* Home Team Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between bg-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
                <span className="font-medium text-white">{currentMatch?.team}</span>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScore(prev => ({ ...prev, home: Math.max(0, prev.home - 1) }))}
                    className="w-8 h-8 bg-red-500 text-white rounded-full text-lg font-bold"
                  >
                    -
                  </motion.button>
                  <span className="text-2xl font-bold text-white min-w-8 text-center">{score.home}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScore(prev => ({ ...prev, home: prev.home + 1 }))}
                    className="w-8 h-8 bg-green-500 text-white rounded-full text-lg font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Away Team Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between bg-gray-600/20 backdrop-blur-sm rounded-xl p-3 border border-gray-400/30">
                <span className="font-medium text-white">{currentMatch?.opponent}</span>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScore(prev => ({ ...prev, away: Math.max(0, prev.away - 1) }))}
                    className="w-8 h-8 bg-red-500 text-white rounded-full text-lg font-bold"
                  >
                    -
                  </motion.button>
                  <span className="text-2xl font-bold text-white min-w-8 text-center">{score.away}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setScore(prev => ({ ...prev, away: prev.away + 1 }))}
                    className="w-8 h-8 bg-green-500 text-white rounded-full text-lg font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Match Summary */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl mb-4">
            <h3 className="font-semibold text-white mb-3 text-center">Match Summary</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {score.home} - {score.away}
              </div>
              <p className="text-sm text-blue-200 mb-2">
                {currentMatch?.team} vs {currentMatch?.opponent}
              </p>
              <p className="text-xs text-blue-100">
                {setupForm.matchFormat} • {matchTime} minutes
              </p>
            </div>
          </div>

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
      </MobilePageContainer>
    </MobileLayout>
  );
}