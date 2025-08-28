import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Match, MatchEvent, EventType, Team, Player, MatchStats } from "../../../types/match-tracker";
import { MatchValidator, MatchSecurity, RealtimeValidator, SecurityContext } from "../../../lib/match-validation";

export default function MatchRecord() {
  const router = useRouter();
  const { id, secure } = router.query;
  const [match, setMatch] = useState<Match | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Real-time event sync
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [autoSave, setAutoSave] = useState(true);
  
  // Security context
  const [securityContext, setSecurityContext] = useState<SecurityContext | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
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
      if (secure) {
        initializeSecurityContext();
      }
    }
  }, [id, secure]);

  // Timer effect with real-time sync
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setMatchTime(prev => prev + 1);
        // Auto-save match state every minute when running
        if (autoSave && match) {
          saveMatchState();
        }
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isRunning, autoSave, match]);

  // Real-time sync effect - check for updates every 10 seconds
  useEffect(() => {
    if (!match?.id || !secure) return;

    const syncInterval = setInterval(() => {
      syncMatchData();
    }, 10000); // Sync every 10 seconds

    return () => clearInterval(syncInterval);
  }, [match?.id, secure]);

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

  const saveMatchState = () => {
    if (!match) return;
    
    const updatedMatch = {
      ...match,
      homeScore: match.isHomeMatch ? homeScore : awayScore,
      awayScore: match.isHomeMatch ? awayScore : homeScore,
      updatedAt: new Date()
    };
    
    storage.saveMatch(updatedMatch);
    setLastSync(new Date());
  };

  const syncMatchData = async () => {
    if (!match?.id) return;
    
    try {
      // Reload latest match data
      const latestMatch = storage.getMatch(match.id);
      const latestEvents = storage.getMatchEvents(match.id);
      
      if (latestMatch && latestMatch.updatedAt > lastSync) {
        // Update match state if newer data available
        setMatch(latestMatch);
        if (latestMatch.homeScore !== undefined && latestMatch.awayScore !== undefined) {
          if (latestMatch.isHomeMatch) {
            setHomeScore(latestMatch.homeScore);
            setAwayScore(latestMatch.awayScore);
          } else {
            setHomeScore(latestMatch.awayScore);
            setAwayScore(latestMatch.homeScore);
          }
        }
        setLastSync(new Date());
      }
      
      // Update events if different
      if (latestEvents.length !== events.length) {
        setEvents(latestEvents);
      }
      
    } catch (error) {
      console.error('Sync error:', error);
    }
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

  const initializeSecurityContext = () => {
    try {
      const userStr = localStorage.getItem('match-recorder-user');
      const token = localStorage.getItem('match-recorder-token');
      
      if (userStr && token) {
        const user = JSON.parse(userStr);
        const context: SecurityContext = {
          userId: user.id,
          userRole: user.role,
          authorizedTeams: user.teams,
          sessionToken: token
        };
        setSecurityContext(context);
      }
    } catch (error) {
      console.error('Error initializing security context:', error);
    }
  };

  const quickEvent = async (eventType: EventType, playerId?: string, forOpponent: boolean = false) => {
    if (!match || !team) return;
    
    // Clear any previous validation errors
    setValidationErrors([]);

    const player = playerId ? players.find(p => p.id === playerId) : null;
    
    const event: MatchEvent = {
      id: secure ? MatchSecurity.generateSecureEventId() : `event-${Date.now()}`,
      matchId: match.id,
      playerId: player?.id,
      playerName: player?.name || (forOpponent ? match.opponent : 'Unknown Player'),
      eventType,
      minute: matchTime,
      half: currentHalf,
      recordedAt: new Date(),
      recordedBy: secure ? localStorage.getItem('match-recorder-user') ? JSON.parse(localStorage.getItem('match-recorder-user')!).id : 'admin-1' : 'admin-1'
    };

    // Validate event if secure mode
    if (secure && securityContext) {
      try {
        const validation = await RealtimeValidator.queueEventValidation(event, match, securityContext);
        
        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          alert('Event validation failed: ' + validation.errors.join(', '));
          return;
        }
        
        if (validation.warnings.length > 0) {
          console.warn('Event warnings:', validation.warnings);
        }
      } catch (error) {
        console.error('Validation error:', error);
        alert('Security validation failed. Event not recorded.');
        return;
      }
    }

    // Handle goal scoring and stat updates
    if (eventType === 'Goal') {
      if (forOpponent) {
        // Goal for opponent team
        if (match.isHomeMatch) {
          setAwayScore(prev => prev + 1);
        } else {
          setHomeScore(prev => prev + 1);
        }
      } else {
        // Goal for your team
        if (match.isHomeMatch) {
          setHomeScore(prev => prev + 1);
        } else {
          setAwayScore(prev => prev + 1);
        }
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
        homeScore: match.isHomeMatch ? homeScore : awayScore,
        awayScore: match.isHomeMatch ? awayScore : homeScore,
        updatedAt: new Date()
      };
      // Apply the score change based on who scored
      if (forOpponent) {
        if (match.isHomeMatch) {
          updatedMatch.awayScore = awayScore + 1;
        } else {
          updatedMatch.homeScore = homeScore + 1;
        }
      } else {
        if (match.isHomeMatch) {
          updatedMatch.homeScore = homeScore + 1;
        } else {
          updatedMatch.awayScore = awayScore + 1;
        }
      }
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
      // Determine if the goal was for your team or opponent based on player name
      const wasOpponentGoal = eventToDelete.playerName === match.opponent || 
                              !players.find(p => p.name === eventToDelete.playerName);
      
      if (wasOpponentGoal) {
        // Opponent goal - subtract from their score
        if (match.isHomeMatch) {
          setAwayScore(prev => Math.max(0, prev - 1));
        } else {
          setHomeScore(prev => Math.max(0, prev - 1));
        }
      } else {
        // Your team's goal - subtract from your score
        if (match.isHomeMatch) {
          setHomeScore(prev => Math.max(0, prev - 1));
        } else {
          setAwayScore(prev => Math.max(0, prev - 1));
        }
      }
      
      // Update match scores in storage
      const updatedMatch = {
        ...match,
        homeScore: match.isHomeMatch ? homeScore : awayScore,
        awayScore: match.isHomeMatch ? awayScore : homeScore,
        updatedAt: new Date()
      };
      
      // Apply the score subtraction
      if (wasOpponentGoal) {
        if (match.isHomeMatch) {
          updatedMatch.awayScore = Math.max(0, awayScore - 1);
        } else {
          updatedMatch.homeScore = Math.max(0, homeScore - 1);
        }
      } else {
        if (match.isHomeMatch) {
          updatedMatch.homeScore = Math.max(0, homeScore - 1);
        } else {
          updatedMatch.awayScore = Math.max(0, awayScore - 1);
        }
      }
      
      storage.saveMatch(updatedMatch);
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
      <div className="min-h-screen bg-gradient-to-br from-club-primary via-club-secondary to-club-primary flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading match...</p>
        </div>
      </div>
    );
  }

  if (!match || !team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-club-primary via-club-secondary to-club-primary flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <button
            onClick={() => router.push('/match-central#tracker')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Back to Match Central
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-club-primary via-club-secondary to-club-primary text-white overflow-hidden">
      {/* Full Screen Match Recording Interface */}
      
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/match-central#tracker')}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Exit
            </button>
            <div>
              <h1 className="text-lg font-bold">{team.name} vs {match.opponent}</h1>
              <p className="text-sm text-white/70">{match.matchType} • {match.venue}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/70">Half {currentHalf}</div>
            <div className="text-lg font-bold">{formatTime(matchTime)}'</div>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white/10 backdrop-blur-md p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{team.name}</div>
            <div className="text-6xl font-bold text-white">{homeScore}</div>
          </div>
          
          <div className="text-4xl font-bold text-white">-</div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{match.opponent}</div>
            <div className="text-6xl font-bold text-white">{awayScore}</div>
          </div>
        </div>

        {/* Start Match Button for Scheduled Matches */}
        {match.status === 'Scheduled' && (
          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const updatedMatch = { ...match, status: 'In Progress' as const };
                storage.saveMatch(updatedMatch);
                setMatch(updatedMatch);
                setIsRunning(true);
              }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center space-x-3 mx-auto"
            >
              <span className="text-2xl">🔴</span>
              <span>Start Recording Match</span>
            </motion.button>
            <p className="text-sm text-white/70 mt-3">
              Match is scheduled. Click to begin live recording.
            </p>
          </div>
        )}
      </div>

      {/* Timer Controls - Only show if match has started */}
      {match.status === 'In Progress' && (
        <div className="p-4 bg-white/5 backdrop-blur-md">
          <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              isRunning 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-white/20 hover:bg-white/30'
            } transition-all backdrop-blur-md`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          
          <button
            onClick={nextHalf}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-lg transition-all backdrop-blur-md"
          >
            {currentHalf === 1 ? 'Half Time' : 'Full Time'}
          </button>
        </div>
      </div>
      )}

      {/* Quick Event Buttons - Only show if match has started */}
      {match.status === 'In Progress' && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4 text-center">Quick Events</h3>
        
        {/* Goal Buttons - Separate for each team */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Goal', undefined, false)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            ⚽ {team.name} Goal
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Goal', undefined, true)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            ⚽ {match.opponent} Goal
          </motion.button>
        </div>
        
        {/* Other Event Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('YellowCard')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            🟨 Yellow
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('RedCard')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            🟥 Red
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Substitution')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            🔄 Sub
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('CornerKick')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            🚩 Corner
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => quickEvent('Foul')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-center font-bold text-lg transition-all border border-white/20"
          >
            ⚠️ Foul
          </motion.button>
        </div>
      </div>
      )}

      {/* Recent Events */}
      <div className="p-4 bg-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Match Events ({events.length})</h3>
          {events.length > 5 && (
            <button 
              onClick={() => setShowEventDetails(true)}
              className="text-sm text-white/70 hover:text-white"
            >
              View All
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.slice(-5).reverse().map((event) => (
            <div key={event.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-lg group border border-white/20">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getEventIcon(event.eventType)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-white/70">{event.minute}'</span>
                    <span className="font-medium">{event.playerName || 'Team'}</span>
                  </div>
                  <span className="text-xs text-white/50">{event.eventType}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/50">H{event.half}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => editEvent(event)}
                    className="text-white/70 hover:text-white p-1"
                    title="Edit event"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-white/70 hover:text-white p-1"
                    title="Delete event"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-white/50 text-center py-4">No events recorded yet</p>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="text-lg font-bold">All Match Events</h3>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getEventIcon(event.eventType)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-white/70">{event.minute}'</span>
                          <span className="font-medium">{event.playerName || 'Team'}</span>
                        </div>
                        <span className="text-xs text-white/50">{event.eventType}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/50">H{event.half}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editEvent(event)}
                          className="text-white/70 hover:text-white p-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-white/70 hover:text-white p-1"
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
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
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
                <label className="block text-sm font-medium text-white/80 mb-2">Possession (%)</label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateStat('possession', matchStats.possession - 5)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                  >
                    -5%
                  </button>
                  <span className="flex-1 text-center font-bold text-lg">{matchStats.possession}%</span>
                  <button 
                    onClick={() => updateStat('possession', Math.min(100, matchStats.possession + 5))}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                  >
                    +5%
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Shots On Target</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('shotsOn', matchStats.shotsOn - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.shotsOn}</span>
                    <button 
                      onClick={() => updateStat('shotsOn', matchStats.shotsOn + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Shots Off Target</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('shotsOff', matchStats.shotsOff - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.shotsOff}</span>
                    <button 
                      onClick={() => updateStat('shotsOff', matchStats.shotsOff + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Corners</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('corners', matchStats.corners - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.corners}</span>
                    <button 
                      onClick={() => updateStat('corners', matchStats.corners + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Fouls</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('fouls', matchStats.fouls - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.fouls}</span>
                    <button 
                      onClick={() => updateStat('fouls', matchStats.fouls + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Offsides</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('offsides', matchStats.offsides - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.offsides}</span>
                    <button 
                      onClick={() => updateStat('offsides', matchStats.offsides + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Saves</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateStat('saves', matchStats.saves - 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold">{matchStats.saves}</span>
                    <button 
                      onClick={() => updateStat('saves', matchStats.saves + 1)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-sm transition-all"
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
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Save Stats
                </button>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg transition-all"
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
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
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
                <label className="block text-sm font-medium text-white/80 mb-2">Event Type</label>
                <select
                  value={editEventData.eventType}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, eventType: e.target.value as EventType }))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white"
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
                <label className="block text-sm font-medium text-white/80 mb-2">Minute</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={editEventData.minute}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, minute: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Player (Optional)</label>
                <select
                  value={editEventData.playerId}
                  onChange={(e) => setEditEventData(prev => ({ ...prev, playerId: e.target.value }))}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white"
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
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white/70">
              Status: {match.status}
            </div>
            {secure && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${autoSave ? 'bg-white' : 'bg-white/50'}`}></div>
                <span className="text-white/70">
                  {autoSave ? 'Auto-sync' : 'Manual'} | Last sync: {lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                {validationErrors.length > 0 && (
                  <div className="ml-2 text-white/80">
                    ⚠️ {validationErrors.length} validation errors
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            {secure && (
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  autoSave 
                    ? 'bg-white/20 hover:bg-white/30 border border-white/20' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                } transition-all backdrop-blur-md`}
              >
                {autoSave ? '🔄 Auto' : '⏸️ Manual'}
              </button>
            )}
            <button 
              onClick={() => setShowEventDetails(true)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm border border-white/20 backdrop-blur-md transition-all"
            >
              📊 Events ({events.length})
            </button>
            <button 
              onClick={() => setShowStatsModal(true)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm border border-white/20 backdrop-blur-md transition-all"
            >
              📈 Stats
            </button>
            {match.veoRecording && match.veoUrl && (
              <a
                href={match.veoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm border border-white/20 backdrop-blur-md transition-all"
              >
                📹 VEO
              </a>
            )}
            <button
              onClick={finishMatch}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 backdrop-blur-md transition-all"
            >
              Finish Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}