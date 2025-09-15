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
  const [matchTime, setMatchTime] = useState(0); // in seconds
  const [events, setEvents] = useState<MatchEvent[]>([]);
  
  // Digital clock display helper
  const formatMatchTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Quick setup form with localStorage memory
  const [setupForm, setSetupForm] = useState({
    team: '',
    opponent: '',
    venue: '',
    playerName: '', // Child's name
    matchFormat: '11v11' // Match format
  });

  // Load saved user preferences on component mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('quick-record-prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setSetupForm(prev => ({
        ...prev,
        playerName: prefs.playerName || prev.playerName,
        team: prefs.team || prev.team,
        venue: prefs.venue || prev.venue,
        matchFormat: prefs.matchFormat || prev.matchFormat
      }));
    }
  }, []);

  // Save user preferences when form changes
  const updateFormAndSave = (field: string, value: string) => {
    const newForm = { ...setupForm, [field]: value };
    setSetupForm(newForm);
    
    // Save to localStorage (excluding opponent as it changes each match)
    const prefsToSave = {
      playerName: newForm.playerName,
      team: newForm.team,
      venue: newForm.venue,
      matchFormat: newForm.matchFormat
    };
    localStorage.setItem('quick-record-prefs', JSON.stringify(prefsToSave));
  };

  // Score tracking
  const [score, setScore] = useState({
    home: 0,
    away: 0
  });

  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    // Auto-increment match time when recording (every second)
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setMatchTime(prev => prev + 1);
      }, 1000); // Every second
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


  const [showReport, setShowReport] = useState(false);
  const [finalMatchData, setFinalMatchData] = useState<any>(null);

  const finishMatch = () => {
    if (currentMatch) {
      // Create comprehensive match report
      const finalMatch = { 
        ...currentMatch, 
        score,
        matchFormat: setupForm.matchFormat,
        finalMinutes: Math.floor(matchTime / 60), // Convert seconds to minutes for storage
        finalSeconds: matchTime, // Keep full seconds for detailed tracking
        playerName: setupForm.playerName,
        completedAt: new Date(),
        result: score.home > score.away ? 'Win' : score.home < score.away ? 'Loss' : 'Draw'
      };

      // Save to localStorage for later viewing
      const savedMatches = localStorage.getItem('parent-matches') || '[]';
      const matches = JSON.parse(savedMatches);
      matches.push(finalMatch);
      localStorage.setItem('parent-matches', JSON.stringify(matches));

      // Show report before reset
      setFinalMatchData(finalMatch);
      setShowReport(true);
    }
  };

  const generateMatchReport = (match: any) => {
    const reportText = `
🏆 MATCH REPORT 🏆

📅 Date: ${new Date(match.completedAt).toLocaleDateString('en-GB')}
⏰ Time: ${new Date(match.completedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}

⚽ TEAMS:
${match.team} vs ${match.opponent}

📊 FINAL SCORE:
${match.score.home} - ${match.score.away}

📝 MATCH DETAILS:
• Format: ${match.matchFormat}
• Duration: ${Math.floor(match.finalSeconds / 60)}:${(match.finalSeconds % 60).toString().padStart(2, '0')} (${Math.floor(match.finalSeconds / 60)} minutes)
• Venue: ${match.venue || 'Not specified'}
• Result: ${match.result}

👨‍👩‍👧‍👦 RECORDED BY:
Parent of ${match.playerName}

📱 Recorded with RVR Quick Record
Generated: ${new Date().toLocaleString('en-GB')}
    `.trim();

    return reportText;
  };

  const shareReport = async () => {
    if (!finalMatchData) return;
    
    const reportText = generateMatchReport(finalMatchData);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Match Report',
          text: reportText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(reportText).then(() => {
        alert('Match report copied to clipboard! You can now paste it in WhatsApp, email, or send to match-central admin.');
      });
    }
  };

  const resetAfterReport = () => {
    // Reset everything
    setCurrentMatch(null);
    setIsRecording(false);
    setEvents([]);
    setScore({ home: 0, away: 0 });
    setMatchTime(0);
    setShowSetup(true);
    setShowReport(false);
    setFinalMatchData(null);
    // Keep saved preferences, only clear opponent
    setSetupForm(prev => ({ ...prev, opponent: '' }));
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
                  onChange={(e) => updateFormAndSave('playerName', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  onChange={(e) => updateFormAndSave('team', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
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
                  onChange={(e) => updateFormAndSave('venue', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Home Ground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Match Format *
                </label>
                <select
                  value={setupForm.matchFormat}
                  onChange={(e) => updateFormAndSave('matchFormat', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
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
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300"
              >
                ⚽ Start Match Recording
              </motion.button>
            </motion.div>
          </div>
        </MobilePageContainer>
      </MobileLayout>
    );
  }

  // Show match report screen
  if (showReport && finalMatchData) {
    return (
      <MobileLayout currentPage="/quick-record" showNavigation={false}>
        <MobilePageContainer 
          title="Match Complete!"
          subtitle="Match Report Generated"
          icon="🏆"
        >
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Match Result Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-2xl text-center"
            >
              <div className="text-6xl mb-4">
                {finalMatchData.result === 'Win' ? '🏆' : finalMatchData.result === 'Loss' ? '💙' : '🤝'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {finalMatchData.result === 'Win' ? 'Victory!' : finalMatchData.result === 'Loss' ? 'Good Game!' : 'Great Draw!'}
              </h2>
              <div className="text-4xl font-bold text-white mb-2">
                {finalMatchData.score.home} - {finalMatchData.score.away}
              </div>
              <p className="text-white/80 text-sm">
                {finalMatchData.team} vs {finalMatchData.opponent}
              </p>
            </motion.div>

            {/* Match Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-2xl"
            >
              <h3 className="font-bold text-white mb-4 text-center">📋 Match Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Format:</span>
                  <span className="text-white font-medium">{finalMatchData.matchFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Duration:</span>
                  <span className="text-white font-medium">{formatMatchTime(finalMatchData.finalSeconds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Venue:</span>
                  <span className="text-white font-medium">{finalMatchData.venue || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Recorded by:</span>
                  <span className="text-white font-medium">Parent of {finalMatchData.playerName}</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={shareReport}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
              >
                📤 Share Match Report
              </motion.button>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const reportText = generateMatchReport(finalMatchData);
                    alert(reportText);
                  }}
                  className="p-3 bg-white/20 backdrop-blur-xl text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  👁️ View Report
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={resetAfterReport}
                  className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300"
                >
                  ⚽ New Match
                </motion.button>
              </div>
            </motion.div>

            {/* Admin Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-500/20 backdrop-blur-xl rounded-2xl border border-amber-300/30 p-4 shadow-xl"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-bold text-white text-sm mb-2">For Match-Central</h4>
                <p className="text-white/80 text-xs">
                  Share this report with your team's admin or coach to have it posted to the official Match-Central system!
                </p>
              </div>
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
              <div className="text-xs text-white/80">{setupForm.matchFormat}</div>
            </div>
            {/* Interactive Digital Clock */}
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 p-4 mb-2">
              <div className="text-center">
                <div className="text-xs text-green-300 mb-1 font-bold tracking-widest">
                  {isRecording ? '🔴 LIVE' : '⏸️ PAUSED'}
                </div>
                <div className={`text-4xl font-mono font-black tracking-wider transition-all duration-300 ${
                  isRecording ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {formatMatchTime(matchTime)}
                </div>
                <div className="text-xs text-white/60 mt-1 font-medium">
                  {isRecording ? 'MATCH TIME' : 'TIMER PAUSED'}
                </div>
              </div>
            </div>

            {/* Clock Control Buttons */}
            <div className="flex gap-2 justify-center mb-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecording(!isRecording)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isRecording 
                    ? 'bg-yellow-500/80 text-white hover:bg-yellow-600/80' 
                    : 'bg-green-500/80 text-white hover:bg-green-600/80'
                }`}
              >
                {isRecording ? '⏸️ PAUSE' : '▶️ START'}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMatchTime(0)}
                className="px-4 py-2 bg-red-500/80 text-white rounded-xl font-bold text-sm hover:bg-red-600/80 transition-all duration-300"
              >
                🔄 RESET
              </motion.button>
            </div>
          </div>
        </div>

        {/* Score Tracking */}
        <div>
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl mb-4">
            <h3 className="font-semibold text-white mb-4 text-center">Score Tracking</h3>
            
            {/* Home Team Score */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="font-bold text-white text-lg">{currentMatch?.team}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setScore(prev => ({ ...prev, home: Math.max(0, prev.home - 1) }))}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full text-xl font-bold shadow-lg transition-all duration-200"
                    >
                      −
                    </motion.button>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[60px] text-center">
                      <span className="text-3xl font-black text-white">{score.home}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setScore(prev => ({ ...prev, home: prev.home + 1 }))}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full text-xl font-bold shadow-lg transition-all duration-200"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Away Team Score */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm rounded-xl p-4 border border-gray-400/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-bold text-white text-lg">{currentMatch?.opponent}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setScore(prev => ({ ...prev, away: Math.max(0, prev.away - 1) }))}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full text-xl font-bold shadow-lg transition-all duration-200"
                    >
                      −
                    </motion.button>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[60px] text-center">
                      <span className="text-3xl font-black text-white">{score.away}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setScore(prev => ({ ...prev, away: prev.away + 1 }))}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full text-xl font-bold shadow-lg transition-all duration-200"
                    >
                      +
                    </motion.button>
                  </div>
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
              <p className="text-sm text-white/80 mb-2">
                {currentMatch?.team} vs {currentMatch?.opponent}
              </p>
              <p className="text-xs text-white/70">
                {setupForm.matchFormat} • {formatMatchTime(matchTime)}
              </p>
            </div>
          </div>

          {/* Finish Match Button */}
          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={finishMatch}
              className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300"
            >
              🏁 Finish Match
            </motion.button>
          </div>
        </div>
      </MobilePageContainer>
    </MobileLayout>
  );
}