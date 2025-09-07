import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { supabase } from "../../../lib/supabase";
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
  
  // Goal recording
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalFor, setGoalFor] = useState<'home' | 'away'>('home');
  const [selectedScorer, setSelectedScorer] = useState<string>('');
  const [selectedAssist, setSelectedAssist] = useState<string>('');
  const [goalMinute, setGoalMinute] = useState<number>(1);
  
  // Notes
  const [matchNotes, setMatchNotes] = useState<string>('');
  
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

  const loadMatch = async (matchId: string) => {
    try {
      // First try to load from Supabase database
      const { data: supabaseMatch, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (supabaseMatch && !matchError) {
        // Convert Supabase match to Match type
        const loadedMatch: Match = {
          id: supabaseMatch.id,
          teamId: supabaseMatch.team_id,
          opponent: supabaseMatch.opponent,
          scheduledDate: new Date(supabaseMatch.scheduled_date),
          venue: supabaseMatch.venue || 'St. Finian\'s GAA',
          isHomeMatch: supabaseMatch.is_home_match || false,
          matchType: supabaseMatch.match_type || 'Friendly',
          status: supabaseMatch.status || 'Scheduled',
          homeScore: supabaseMatch.home_score,
          awayScore: supabaseMatch.away_score,
          pitchCond: 'Good',
          createdAt: new Date(supabaseMatch.created_at),
          updatedAt: new Date(supabaseMatch.updated_at || supabaseMatch.created_at)
        };

        // Try to load team from Supabase
        const { data: supabaseTeam } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            age_group,
            gender,
            league,
            season,
            home_venue,
            contact_email,
            contact_phone,
            coaches,
            notes,
            is_opponent,
            is_active,
            created_at,
            updated_at,
            players(
              id,
              first_name,
              last_name,
              jersey_number,
              position,
              is_active
            )
          `)
          .eq('id', loadedMatch.teamId)
          .eq('is_active', true)
          .single();

        if (supabaseTeam) {
          const loadedTeam: Team = {
            id: supabaseTeam.id,
            name: supabaseTeam.name,
            ageGroup: supabaseTeam.age_group || 'Open',
            gender: supabaseTeam.gender || 'Mixed',
            season: supabaseTeam.season || '2024-25',
            league: supabaseTeam.league || 'Unassigned',
            homeVenue: supabaseTeam.home_venue || 'St. Finian\'s GAA',
            contactEmail: supabaseTeam.contact_email || '',
            contactPhone: supabaseTeam.contact_phone || '',
            coaches: Array.isArray(supabaseTeam.coaches) ? supabaseTeam.coaches : (supabaseTeam.coaches ? [supabaseTeam.coaches] : []),
            notes: supabaseTeam.notes || '',
            homeKit: { primary: '#009639', secondary: '#FFFFFF' },
            awayKit: { primary: '#FFFFFF', secondary: '#009639' },
            isOpponent: supabaseTeam.is_opponent || false,
            isActive: supabaseTeam.is_active !== false,
            players: supabaseTeam.players?.filter((p: any) => p.is_active !== false).map((p: any) => ({
              id: p.id,
              teamId: supabaseTeam.id,
              name: `${p.first_name} ${p.last_name}`.trim(),
              position: p.position || 'Field Player',
              isCaptain: false,
              isViceCaptain: false,
              isActive: p.is_active !== false,
              createdAt: new Date(),
              updatedAt: new Date()
            })) || [],
            createdAt: new Date(supabaseTeam.created_at),
            updatedAt: new Date(supabaseTeam.updated_at || supabaseTeam.created_at)
          };

          setMatch(loadedMatch);
          setTeam(loadedTeam);
          setPlayers(loadedTeam.players);
          setEvents([]); // Start with empty events for new matches
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading match from Supabase:', error);
    }

    // Fallback to local storage
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

  const recordGoal = () => {
    if (!match || !team) return;

    // Create goal event
    const goalEvent: MatchEvent = {
      id: Date.now().toString(),
      matchId: match.id,
      eventType: 'Goal',
      minute: goalMinute,
      half: currentHalf,
      playerName: selectedScorer || 'Unknown',
      playerId: selectedScorer,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create assist event if provided
    let assistEvent: MatchEvent | null = null;
    if (selectedAssist && selectedAssist !== selectedScorer) {
      assistEvent = {
        id: (Date.now() + 1).toString(),
        matchId: match.id,
        eventType: 'Assist' as EventType,
        minute: goalMinute,
        half: currentHalf,
        playerName: selectedAssist,
        playerId: selectedAssist,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Update score
    const isHomeGoal = (goalFor === 'home');
    if (isHomeGoal) {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    // Add events
    const newEvents = [goalEvent];
    if (assistEvent) newEvents.push(assistEvent);
    
    setEvents(prev => [...prev, ...newEvents]);

    // Save to storage
    storage.saveMatchEvents(match.id, [...events, ...newEvents]);

    // Update match with new scores
    const updatedMatch = {
      ...match,
      homeScore: isHomeGoal ? homeScore + 1 : homeScore,
      awayScore: !isHomeGoal ? awayScore + 1 : awayScore,
      updatedAt: new Date()
    };
    storage.saveMatch(updatedMatch);
    setMatch(updatedMatch);

    // Reset modal
    setShowGoalModal(false);
    setSelectedScorer('');
    setSelectedAssist('');
    setGoalMinute(1);
  };

  const saveNotes = () => {
    if (!match || !matchNotes.trim()) return;
    
    // Save notes to match
    const updatedMatch = {
      ...match,
      notes: matchNotes,
      updatedAt: new Date()
    };
    storage.saveMatch(updatedMatch);
    setMatch(updatedMatch);
    
    alert('Notes saved!');
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
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => router.push('/match-central#fixtures')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Back
              </button>
              <div className="text-sm text-gray-500">{match.matchType}</div>
            </div>
            <h1 className="text-lg font-bold text-gray-900 text-center">
              {team.name} vs {match.opponent}
            </h1>
            <p className="text-sm text-gray-600 text-center">{match.venue}</p>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white border-b">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{team.name}</div>
                <div className="text-4xl font-bold text-blue-600">{match.isHomeMatch ? homeScore : awayScore}</div>
              </div>
              
              <div className="text-2xl font-bold text-gray-400">-</div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{match.opponent}</div>
                <div className="text-4xl font-bold text-red-600">{match.isHomeMatch ? awayScore : homeScore}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          
          {/* Goal Recording */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Record Goal</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGoalFor(match.isHomeMatch ? 'home' : 'away');
                  setShowGoalModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl text-center font-bold transition-all shadow-md"
              >
                ⚽ {team.name} Goal
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGoalFor(match.isHomeMatch ? 'away' : 'home');
                  setShowGoalModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl text-center font-bold transition-all shadow-md"
              >
                ⚽ {match.opponent} Goal
              </motion.button>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Match Notes</h3>
            <textarea
              value={matchNotes}
              onChange={(e) => setMatchNotes(e.target.value)}
              placeholder="Add match notes, observations, incidents..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <button 
              onClick={saveNotes}
              disabled={!matchNotes.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              Save Notes
            </button>
          </div>

          {/* Match Events */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Match Events</h3>
            
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events recorded yet
              </div>
            ) : (
              <div className="space-y-2">
                {events.slice(-10).reverse().map((event) => (
                  <div key={event.id} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getEventIcon(event.eventType)}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.eventType === 'Goal' ? `⚽ ${event.playerName}` : 
                             event.eventType === 'Assist' ? `🅰️ ${event.playerName}` :
                             event.playerName || event.eventType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.minute}' • {event.eventType}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete event"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finish Match */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                if (confirm('Finish match and save results?')) {
                  // Update match status and scores
                  const updatedMatch = {
                    ...match,
                    status: 'Finished' as const,
                    homeScore: homeScore,
                    awayScore: awayScore,
                    updatedAt: new Date()
                  };
                  
                  // Save to both local storage and try to sync to database
                  storage.saveMatch(updatedMatch);
                  
                  alert('Match finished and saved!');
                  router.push('/match-central#results');
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-md"
            >
              ✅ Finish Match
            </button>
          </div>
        </div>
      </div>

      {/* Goal Recording Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Record Goal - {goalFor === 'home' ? (match.isHomeMatch ? team.name : match.opponent) : (match.isHomeMatch ? match.opponent : team.name)}
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Minute */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={goalMinute}
                  onChange={(e) => setGoalMinute(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Goal Scorer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Scorer</label>
                <select
                  value={selectedScorer}
                  onChange={(e) => setSelectedScorer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select scorer...</option>
                  {goalFor === (match.isHomeMatch ? 'home' : 'away') ? (
                    // Our team players
                    players.map(player => (
                      <option key={player.id} value={player.name}>{player.name}</option>
                    ))
                  ) : (
                    // Opponent - allow manual entry
                    <option value="Opponent Player">Opponent Player</option>
                  )}
                  <option value="Own Goal">Own Goal</option>
                </select>
              </div>

              {/* Assist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assist (Optional)</label>
                <select
                  value={selectedAssist}
                  onChange={(e) => setSelectedAssist(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No assist</option>
                  {goalFor === (match.isHomeMatch ? 'home' : 'away') ? (
                    // Our team players
                    players.filter(player => player.name !== selectedScorer).map(player => (
                      <option key={player.id} value={player.name}>{player.name}</option>
                    ))
                  ) : (
                    // Opponent
                    <option value="Opponent Player">Opponent Player</option>
                  )}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={recordGoal}
                disabled={!selectedScorer}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-all"
              >
                Record Goal ⚽
              </button>
              <button
                onClick={() => {
                  setShowGoalModal(false);
                  setSelectedScorer('');
                  setSelectedAssist('');
                  setGoalMinute(1);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </StandardLayout>
  );
}
