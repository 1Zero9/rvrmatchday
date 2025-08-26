import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Match, MatchEvent, EventType, Team, Player, MatchStats } from "../../../types/match-tracker";

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
  
  // Event management
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MatchEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<MatchEvent | null>(null);
  const [editEventData, setEditEventData] = useState({ minute: 0, playerId: '', eventType: 'Goal' as EventType });
  
  // Statistics tracking
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [matchStats, setMatchStats] = useState({
    possession: 50,
    shotsOn: 0,
    shotsOff: 0,
    corners: 0,
    fouls: 0,
    offsides: 0,
    saves: 0
  });

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
    
    // Load existing match stats if available
    const existingStats = storage.getMatchStats(matchId);
    if (existingStats) {
      setMatchStats({
        possession: existingStats.possession || 50,
        shotsOn: existingStats.shotsOnTarget || 0,
        shotsOff: existingStats.shotsOffTarget || 0,
        corners: existingStats.corners || 0,
        fouls: existingStats.fouls || 0,
        offsides: existingStats.offsides || 0,
        saves: existingStats.saves || 0
      });
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
    
    // Save final match statistics
    saveMatchStats();
    
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

    // Handle goal scoring and stat updates
    if (eventType === 'Goal') {
      if (match.isHomeMatch) {
        setHomeScore(prev => prev + 1);
      } else {
        setAwayScore(prev => prev + 1);
      }
      // Increment shots on target for goals
      setMatchStats(prev => ({ ...prev, shotsOn: prev.shotsOn + 1 }));
    } else if (eventType === 'CornerKick') {
      setMatchStats(prev => ({ ...prev, corners: prev.corners + 1 }));
    } else if (eventType === 'Foul') {
      setMatchStats(prev => ({ ...prev, fouls: prev.fouls + 1 }));
    } else if (eventType === 'Save') {
      setMatchStats(prev => ({ ...prev, saves: prev.saves + 1 }));
    }

    storage.saveMatchEvent(event);
    setEvents(prev => [...prev, event]);
    
    // Update match scores in storage if it's a goal
    if (eventType === 'Goal' && match) {
      const updatedMatch = {
        ...match,
        homeScore: match.isHomeMatch ? homeScore + 1 : awayScore,
        awayScore: match.isHomeMatch ? awayScore : homeScore + 1,
        updatedAt: new Date()
      };
      storage.saveMatch(updatedMatch);
    }
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (!eventToDelete || !match) return;

    // Confirm deletion
    if (!confirm(`Delete ${eventToDelete.eventType} event at ${eventToDelete.minute}'?`)) {
      return;
    }

    // Handle goal deletion - update score
    if (eventToDelete.eventType === 'Goal') {
      if (match.isHomeMatch) {
        setHomeScore(prev => Math.max(0, prev - 1));
      } else {
        setAwayScore(prev => Math.max(0, prev - 1));
      }
    }

    // Delete from storage and state
    storage.deleteMatchEvent(eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const editEvent = (event: MatchEvent) => {
    setEditingEvent(event);
    setEditEventData({
      minute: event.minute,
      playerId: event.playerId || '',
      eventType: event.eventType
    });
  };

  const saveEventEdit = () => {
    if (!editingEvent || !match) return;

    const updatedEvent: MatchEvent = {
      ...editingEvent,
      minute: editEventData.minute,
      playerId: editEventData.playerId || undefined,
      playerName: editEventData.playerId ? players.find(p => p.id === editEventData.playerId)?.name || 'Unknown Player' : editingEvent.playerName,
      eventType: editEventData.eventType,
      recordedAt: new Date()
    };

    storage.saveMatchEvent(updatedEvent);
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? updatedEvent : e));
    setEditingEvent(null);
  };

  const getEventIcon = (eventType: EventType) => {
    switch (eventType) {
      case 'Goal': return '⚽';
      case 'YellowCard': return '🟨';
      case 'RedCard': return '🟥';
      case 'Substitution': return '🔄';
      case 'CornerKick': return '🚩';
      case 'Foul': return '⚠️';
      case 'Shot': return '🎯';
      case 'Save': return '🥅';
      default: return '📝';
    }
  };

  const saveMatchStats = () => {
    if (!match) return;
    
    const stats = {
      matchId: match.id,
      possession: matchStats.possession,
      shotsOnTarget: matchStats.shotsOn,
      shotsOffTarget: matchStats.shotsOff,
      corners: matchStats.corners,
      fouls: matchStats.fouls,
      offsides: matchStats.offsides,
      saves: matchStats.saves,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.saveMatchStats(stats);
  };

  const updateStat = (stat: string, value: number) => {
    setMatchStats(prev => ({ ...prev, [stat]: Math.max(0, value) }));
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Match Events ({events.length})</h3>
          {events.length > 5 && (
            <button 
              onClick={() => setShowEventDetails(true)}
              className="text-sm text-green-400 hover:text-green-300"
            >
              View All
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.slice(-5).reverse().map((event) => (
            <div key={event.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg group">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getEventIcon(event.eventType)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-400">{event.minute}'</span>
                    <span className="font-medium">{event.playerName || 'Team'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{event.eventType}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">H{event.half}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => editEvent(event)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="Edit event"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-gray-500 text-center py-4">No events recorded yet</p>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold">All Match Events</h3>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getEventIcon(event.eventType)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-400">{event.minute}'</span>
                          <span className="font-medium">{event.playerName || 'Team'}</span>
                        </div>
                        <span className="text-xs text-gray-400">{event.eventType}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">H{event.half}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editEvent(event)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold">Match Statistics</h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Possession (%)</label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateStat('possession', matchStats.possession - 5)}
                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                  >
                    -5%
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">{matchStats.possession}%</span>
                  <button 
                    onClick={() => updateStat('possession', Math.min(100, matchStats.possession + 5))}
                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                  >
                    +5%
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shots On Target</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('shotsOn', matchStats.shotsOn - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.shotsOn}</span>
                    <button 
                      onClick={() => updateStat('shotsOn', matchStats.shotsOn + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Shots Off Target</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('shotsOff', matchStats.shotsOff - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.shotsOff}</span>
                    <button 
                      onClick={() => updateStat('shotsOff', matchStats.shotsOff + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Corners</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('corners', matchStats.corners - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.corners}</span>
                    <button 
                      onClick={() => updateStat('corners', matchStats.corners + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fouls</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('fouls', matchStats.fouls - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.fouls}</span>
                    <button 
                      onClick={() => updateStat('fouls', matchStats.fouls + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Offsides</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('offsides', matchStats.offsides - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.offsides}</span>
                    <button 
                      onClick={() => updateStat('offsides', matchStats.offsides + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Saves</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('saves', matchStats.saves - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.saves}</span>
                    <button 
                      onClick={() => updateStat('saves', matchStats.saves + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    saveMatchStats();
                    setShowStatsModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-medium"
                >
                  Save Stats
                </button>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Event</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                <select
                  value={editEventData.eventType}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, eventType: e.target.value as EventType }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Goal">Goal</option>
                  <option value="YellowCard">Yellow Card</option>
                  <option value="RedCard">Red Card</option>
                  <option value="Substitution">Substitution</option>
                  <option value="CornerKick">Corner Kick</option>
                  <option value="FreeKick">Free Kick</option>
                  <option value="Foul">Foul</option>
                  <option value="Shot">Shot</option>
                  <option value="Save">Save</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minute</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={editEventData.minute}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, minute: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Player (Optional)</label>
                <select
                  value={editEventData.playerId}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, playerId: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Select Player</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      #{player.number} {player.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={saveEventEdit}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Status: {match.status}
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowEventDetails(true)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              📊 Events ({events.length})
            </button>
            <button 
              onClick={() => setShowStatsModal(true)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              📈 Stats
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