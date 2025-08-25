import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Match, MatchEvent, EventType, Team, Player } from "../../../types/match-tracker";

export default function MatchRecord() {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState<Match | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Match state
  const [currentHalf, setCurrentHalf] = useState<1 | 2>(1);
  const [matchTime, setMatchTime] = useState(0); // minutes
  const [isRunning, setIsRunning] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  
  // Event recording
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadMatch(id);
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setMatchTime(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const loadMatch = (matchId: string) => {
    const loadedMatch = storage.getMatch(matchId);
    if (!loadedMatch) {
      alert('Match not found');
      router.push('/match-central#tracker');
      return;
    }

    const loadedTeam = storage.getTeam(loadedMatch.teamId);
    const loadedPlayers = storage.getPlayers(loadedMatch.teamId);
    const loadedEvents = storage.getMatchEvents(matchId);

    setMatch(loadedMatch);
    setTeam(loadedTeam);
    setPlayers(loadedPlayers);
    setEvents(loadedEvents);
    
    // Set initial scores if match has them
    if (loadedMatch.homeScore !== undefined && loadedMatch.awayScore !== undefined) {
      if (loadedMatch.isHomeMatch) {
        setHomeScore(loadedMatch.homeScore);
        setAwayScore(loadedMatch.awayScore);
      } else {
        setHomeScore(loadedMatch.awayScore);
        setAwayScore(loadedMatch.homeScore);
      }
    }

    // Update match status to Live if not already
    if (loadedMatch.status === 'Scheduled') {
      const updatedMatch = { ...loadedMatch, status: 'Live' as const };
      storage.saveMatch(updatedMatch);
      setMatch(updatedMatch);
    }

    setLoading(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const nextHalf = () => {
    if (currentHalf === 1) {
      setCurrentHalf(2);
      setMatchTime(45); // Start second half at 45 minutes
    } else {
      // Full time
      setIsRunning(false);
      finishMatch();
    }
  };

  const finishMatch = () => {
    if (!match) return;
    
    const updatedMatch: Match = {
      ...match,
      status: 'Finished',
      homeScore: match.isHomeMatch ? homeScore : awayScore,
      awayScore: match.isHomeMatch ? awayScore : homeScore,
      updatedAt: new Date()
    };
    
    storage.saveMatch(updatedMatch);
    setMatch(updatedMatch);
    alert('Match finished and saved!');
  };

  const quickEvent = (eventType: EventType, playerId?: string) => {
    if (!match || !team) return;

    const player = playerId ? players.find(p => p.id === playerId) : null;
    
    const event: MatchEvent = {
      id: `event-${Date.now()}`,
      matchId: match.id,
      playerId: player?.id,
      playerName: player?.name || 'Unknown Player',
      eventType,
      minute: matchTime,
      half: currentHalf,
      recordedAt: new Date(),
      recordedBy: 'admin-1' // TODO: Use actual user
    };

    // Handle goal scoring
    if (eventType === 'Goal') {
      if (match.isHomeMatch) {
        setHomeScore(prev => prev + 1);
      } else {
        setAwayScore(prev => prev + 1);
      }
    }

    storage.saveMatchEvent(event);
    setEvents(prev => [...prev, event]);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <StandardLayout title="Match Recording">
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p>Loading match...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (!match || !team) {
    return (
      <StandardLayout title="Match Not Found">
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
            <button
              onClick={() => router.push('/match-central#tracker')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Back to Match Central
            </button>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Pitch-Side Interface - No StandardLayout for full screen */}
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/match-central#tracker')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Exit
            </button>
            <div>
              <h1 className="text-lg font-bold">{team.name} vs {match.opponent}</h1>
              <p className="text-sm text-gray-400">{match.matchType} • {match.venue}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Half {currentHalf}</div>
            <div className="text-lg font-bold">{formatTime(matchTime)}'</div>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-green-800 to-blue-800 p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">{team.name}</div>
            <div className="text-6xl font-bold">{homeScore}</div>
          </div>
          
          <div className="text-4xl font-bold text-white">-</div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-200">{match.opponent}</div>
            <div className="text-6xl font-bold">{awayScore}</div>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="p-4 bg-gray-800">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          
          <button
            onClick={nextHalf}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg"
          >
            {currentHalf === 1 ? 'Half Time' : 'Full Time'}
          </button>
        </div>
      </div>

      {/* Quick Event Buttons */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4 text-center">Quick Events</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Goal')}
            className="bg-green-600 hover:bg-green-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            ⚽ Goal
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('YellowCard')}
            className="bg-yellow-600 hover:bg-yellow-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            🟨 Yellow
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('RedCard')}
            className="bg-red-600 hover:bg-red-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            🟥 Red
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Substitution')}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            🔄 Sub
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('CornerKick')}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            🚩 Corner
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Foul')}
            className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-center font-bold text-lg transition-colors"
          >
            ⚠️ Foul
          </motion.button>
        </div>
      </div>

      {/* Recent Events */}
      <div className="p-4 bg-gray-800">
        <h3 className="text-lg font-bold mb-3">Recent Events</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.slice(-5).reverse().map((event) => (
            <div key={event.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-gray-400">{event.minute}'</span>
                <span className="font-medium">{event.playerName}</span>
                <span className="text-sm text-gray-400">{event.eventType}</span>
              </div>
              <span className="text-xs text-gray-500">H{event.half}</span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-gray-500 text-center py-4">No events recorded yet</p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Status: {match.status}
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              📊 Stats
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              📝 Notes
            </button>
            <button
              onClick={finishMatch}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Finish Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}