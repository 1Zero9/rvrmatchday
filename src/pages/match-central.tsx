/**
 * Unified Match Central Dashboard - Clean Theme
 * Consolidates live dashboard, fixtures, results, tables, and match tracker
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import CelebrationResultCard from "../components/CelebrationResultCard";
import { supabase } from "../lib/supabase";
import { Team, TeamSummary, Match } from "../types/match-tracker";

type TabType = 'overview' | 'fixtures' | 'management' | 'statistics';

// Component for inline goal scorers display
function GoalScorersInline({ match }: { match: Match }) {
  const [goalEvents, setGoalEvents] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const loadGoalEvents = async () => {
      try {
        // TODO: Load match events from database when events table is created
        const events: any[] = [];
        setGoalEvents(events.filter(e => e.eventType === 'Goal'));
      } catch (error) {
        console.error('Error loading goal events:', error);
      }
    };
    
    loadGoalEvents();
  }, [match.id]);

  if (goalEvents.length === 0) return null;

  return (
    <div className="mt-2 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
      <span className="font-medium">⚽ Goals:</span> {goalEvents.map(e => e.playerName).join(', ')}
    </div>
  );
}

// Component for expanded match details
function MatchExpandedDetails({ match }: { match: Match }) {
  const [goalEvents, setGoalEvents] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const loadGoalEvents = async () => {
      try {
        // TODO: Load match events from database when events table is created
        const events: any[] = [];
        setGoalEvents(events.filter(e => e.eventType === 'Goal'));
      } catch (error) {
        console.error('Error loading goal events:', error);
      }
    };
    
    loadGoalEvents();
  }, [match.id]);

  return (
    <div className="border-t border-gray-100 bg-gray-50 p-3">
      <div className="space-y-3">
        
        {/* Goal Scorers - Enhanced Display */}
        {goalEvents.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-green-800 mb-3 flex items-center">
              <span className="mr-2 text-lg">⚽</span>
              Goal Scorers ({goalEvents.length})
            </h4>
            <div className="space-y-2">
              {goalEvents.map((event, index) => (
                <div key={index} className="bg-white/70 p-3 rounded-lg flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{event.playerName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">{event.minute}'</div>
                    {event.eventData?.assistPlayerName && (
                      <div className="text-xs text-green-600">
                        Assist: {event.eventData.assistPlayerName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Traditional Extra Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {match.playerOfTheMatch && (
            <div className="text-center p-2 bg-yellow-100 rounded">
              <div>⭐ Player of Match</div>
              <div className="font-bold">{match.playerOfTheMatch}</div>
            </div>
          )}
          {match.attendance && (
            <div className="text-center p-2 bg-blue-100 rounded">
              <div>👥 Attendance</div>
              <div className="font-bold">{match.attendance}</div>
            </div>
          )}
          {match.notes && (
            <div className="col-span-2 p-2 bg-gray-100 rounded">
              <div className="font-semibold mb-1">📝 Notes</div>
              <div className="text-gray-700">{match.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchCentral() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [overviewFilter, setOverviewFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [selectedStatsTeam, setSelectedStatsTeam] = useState<string>('all');
  const [playerStats, setPlayerStats] = useState<{ topScorers: any[]; topAssists: any[]; mostMatches: any[]; }>({ topScorers: [], topAssists: [], mostMatches: [] });
  const [matchesWithExtra, setMatchesWithExtra] = useState<{[key: string]: boolean}>({});

  const toggleMatchExpand = (matchId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const hasExtraInfo = async (match: Match) => {
    // Check if match has additional information to show when expanded
    const hasBasicExtra = match.veoRecording || 
           match.veoUrl ||
           (match.notes && match.notes.length > 0) ||
           (match.playerOfTheMatch && match.playerOfTheMatch.length > 0) ||
           (match.yellowCards && match.yellowCards.length > 0) ||
           (match.redCards && match.redCards.length > 0) ||
           (match.attendance && match.attendance > 0);
    
    // Check for goal events
    try {
      // TODO: Load match events from database when events table is created
      const goalEvents: any[] = [];
      const hasGoalEvents = goalEvents.length > 0;
      return hasBasicExtra || hasGoalEvents;
    } catch (error) {
      return hasBasicExtra;
    }
  };

  const loadData = async () => {
    try {
      // Load teams directly from database
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });
        
      let loadedTeams: Team[] = [];
      if (teamsError) {
        console.error('Error loading teams from database:', teamsError);
      } else {
        loadedTeams = (teamsData || []).map(team => ({
          id: team.id,
          name: team.name,
          ageGroup: team.age_group,
          gender: team.gender,
          season: team.season,
          league: team.league,
          homeVenue: team.home_venue,
          contactEmail: team.contact_email,
          contactPhone: team.contact_phone,
          coaches: team.coaches || [],
          notes: team.notes,
          isOpponent: team.is_opponent || false,
          players: (team.players || []).map(p => ({
            id: p.id,
            teamId: team.id,
            name: p.first_name,
            position: p.position,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })),
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        }));
      }
      setTeams(loadedTeams);
      
      // Load all matches from database
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setAllMatches([]);
      } else {
        setAllMatches(matchesData || []);
      }
      
      // Team summaries will be calculated from database data
      const teamSummaries = loadedTeams.map(team => ({
        id: team.id,
        name: team.team_name,
        totalPlayers: team.players?.length || 0,
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }));
      
      setTeamSummaries(teamSummaries);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    const authToken = sessionStorage.getItem('match-central-auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }

    // Handle hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'fixtures', 'management', 'statistics'].includes(hash)) {
      setActiveTab(hash as TabType);
    }
  }, []);

  const handleAuth = () => {
    if (authPassword === 'rvrfc2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('match-central-auth', 'authenticated');
      loadData();
    } else {
      alert('Incorrect password. Please contact the club administrator.');
    }
  };

  // Get actual match data for fixtures and results
  const getUpcomingMatches = () => {
    const upcoming = allMatches
      .filter(match => match.status === 'Scheduled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 10);
    
    if (selectedTeam === 'all') {
      return upcoming;
    }
    
    return upcoming.filter(match => match.teamId === selectedTeam);
  };

  const getRecentResults = () => {
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 10);
    
    if (selectedTeam === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === selectedTeam);
  };

  // Recalculate data when selectedTeam changes
  const upcomingMatches = React.useMemo(() => getUpcomingMatches(), [selectedTeam, allMatches]);
  const recentResults = React.useMemo(() => getRecentResults(), [selectedTeam, allMatches]);

  // Get filtered results for overview
  const getFilteredOverviewResults = () => {
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    
    if (overviewFilter === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === overviewFilter);
  };

  const filteredOverviewResults = React.useMemo(() => getFilteredOverviewResults(), [overviewFilter, allMatches]);

  // Generate league table from match results
  const getLeagueTable = () => {
    const teamStats = new Map();
    
    // Initialize team stats
    teams.forEach(team => {
      if (!team.isOpponent) {
        teamStats.set(team.id, {
          team: team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        });
      }
    });

    // Process finished matches
    const finishedMatches = allMatches.filter(match => match.status === 'Finished');
    
    finishedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const stats = teamStats.get(match.teamId);
        if (stats) {
          stats.played++;
          
          const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
          const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
          
          stats.goalsFor += teamScore;
          stats.goalsAgainst += opponentScore;
          stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
          
          if (teamScore > opponentScore) {
            stats.won++;
            stats.points += 3;
          } else if (teamScore === opponentScore) {
            stats.drawn++;
            stats.points += 1;
          } else {
            stats.lost++;
          }
        }
      }
    });

    // Convert to array and sort by points, then goal difference, then goals for
    return Array.from(teamStats.values())
      .filter(stats => stats.played > 0) // Only show teams that have played
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  };

  const leagueTable = React.useMemo(() => getLeagueTable(), [teams]);

  // Calculate real statistics from match data
  const getTeamStatistics = (teamId: string) => {
    const teamMatches = allMatches.filter(match => 
      (teamId === 'all' || match.teamId === teamId) && match.status === 'Finished'
    );

    const stats = {
      played: teamMatches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homeWins: 0,
      awayWins: 0,
      homeMatches: teamMatches.filter(m => m.isHomeMatch).length,
      awayMatches: teamMatches.filter(m => !m.isHomeMatch).length,
      cleanSheets: 0,
      biggestWin: { score: '', margin: 0 },
      biggestLoss: { score: '', margin: 0 },
      avgGoalsFor: 0,
      avgGoalsAgainst: 0,
      winPercentage: 0,
      form: [] as string[]
    };

    teamMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
        const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
        
        stats.goalsFor += teamScore;
        stats.goalsAgainst += opponentScore;
        
        if (opponentScore === 0) stats.cleanSheets++;
        
        if (teamScore > opponentScore) {
          stats.won++;
          if (match.isHomeMatch) stats.homeWins++;
          stats.form.unshift('W');
          
          const margin = teamScore - opponentScore;
          if (margin > stats.biggestWin.margin) {
            stats.biggestWin = { score: `${teamScore}-${opponentScore}`, margin };
          }
        } else if (teamScore === opponentScore) {
          stats.drawn++;
          stats.form.unshift('D');
        } else {
          stats.lost++;
          stats.form.unshift('L');
          
          const margin = opponentScore - teamScore;
          if (margin > stats.biggestLoss.margin) {
            stats.biggestLoss = { score: `${teamScore}-${opponentScore}`, margin };
          }
        }
      }
    });

    stats.avgGoalsFor = stats.played > 0 ? stats.goalsFor / stats.played : 0;
    stats.avgGoalsAgainst = stats.played > 0 ? stats.goalsAgainst / stats.played : 0;
    stats.winPercentage = stats.played > 0 ? (stats.won / stats.played) * 100 : 0;
    stats.form = stats.form.slice(0, 5); // Last 5 matches

    return stats;
  };

  // Calculate player statistics from match events
  const getPlayerStatistics = async (teamId: string) => {
    try {
      // TODO: Load match events from database when events table is created
      const matchEvents: any[] = [];
      console.log('All match events:', matchEvents);
      console.log('All matches for stats:', allMatches);
      
      const teamFilter = teamId === 'all' ? 
        allMatches.filter(m => m.status === 'Finished') :
        allMatches.filter(m => m.teamId === teamId && m.status === 'Finished');
      
      console.log('Team filter matches:', teamFilter);
      console.log('Filtered finished matches:', teamFilter.map(m => ({id: m.id, homeScore: m.homeScore, awayScore: m.awayScore})));
      
      const relevantEvents = matchEvents.filter(event => 
        teamFilter.some(match => match.id === event.matchId)
      );
      
      console.log('Relevant events:', relevantEvents);

      // Calculate goals and assists by player
      const playerStats = new Map();
      
      relevantEvents.forEach(event => {
        if (event.eventType === 'Goal') {
          // Goals
          const playerId = event.playerId || event.playerName;
          if (!playerStats.has(playerId)) {
            playerStats.set(playerId, {
              name: event.playerName,
              goals: 0,
              assists: 0,
              matches: new Set()
            });
          }
          const stats = playerStats.get(playerId);
          stats.goals++;
          stats.matches.add(event.matchId);
          
          // Assists
          if (event.eventData?.assistPlayerName) {
            const assistPlayer = event.eventData.assistPlayerName;
            if (!playerStats.has(assistPlayer)) {
              playerStats.set(assistPlayer, {
                name: assistPlayer,
                goals: 0,
                assists: 0,
                matches: new Set()
              });
            }
            playerStats.get(assistPlayer).assists++;
          }
        }
      });

      // Convert to arrays and add match counts
      const playersArray = Array.from(playerStats.values()).map(player => ({
        ...player,
        matches: player.matches.size
      }));

      const result = {
        topScorers: playersArray
          .filter(p => p.goals > 0)
          .sort((a, b) => b.goals - a.goals)
          .slice(0, 10),
        topAssists: playersArray
          .filter(p => p.assists > 0)
          .sort((a, b) => b.assists - a.assists)
          .slice(0, 10),
        mostMatches: playersArray
          .sort((a, b) => b.matches - a.matches)
          .slice(0, 10)
      };
      
      console.log('Final player statistics:', result);
      return result;
    } catch (error) {
      console.error('Error calculating player statistics:', error);
      return { topScorers: [], topAssists: [], mostMatches: [] };
    }
  };

  const currentStats = React.useMemo(() => getTeamStatistics(selectedStatsTeam), [selectedStatsTeam, allMatches]);

  // Check which matches have extra info to display
  useEffect(() => {
    const checkMatchesExtra = async () => {
      const extraInfo: {[key: string]: boolean} = {};
      for (const match of allMatches) {
        const hasExtra = await hasExtraInfo(match);
        extraInfo[match.id] = hasExtra;
        console.log(`Match ${match.id} has extra info:`, hasExtra);
      }
      console.log('Matches with extra info:', extraInfo);
      setMatchesWithExtra(extraInfo);
    };
    
    if (allMatches.length > 0) {
      checkMatchesExtra();
    }
  }, [allMatches]);

  // Load player statistics when team selection changes
  useEffect(() => {
    const loadPlayerStats = async () => {
      const stats = await getPlayerStatistics(selectedStatsTeam);
      setPlayerStats(stats);
    };
    
    if (allMatches.length > 0) {
      loadPlayerStats();
    }
  }, [selectedStatsTeam, allMatches]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL hash without page reload
    window.history.replaceState(null, '', `#${tab}`);
  };

  const getMatchResult = (match: Match) => {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      return { result: 'TBD', teamScore: 0, opponentScore: 0 };
    }
    
    const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
    const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
    
    let result = 'D';
    if (teamScore > opponentScore) result = 'W';
    if (teamScore < opponentScore) result = 'L';
    
    return { result, teamScore, opponentScore };
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Match Central...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  // Authentication Gate
  if (!isAuthenticated) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">🔒</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Central</h1>
              <p className="text-gray-600">Authentication required for club management access</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Password
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password..."
                />
              </div>

              <button
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔓 Access Match Central
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Looking for public match information?
                </p>
                <a
                  href="/matchday"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <span>⚽</span>
                  <span>View Public MatchDay</span>
                  <span>→</span>
                </a>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Need an account? Contact the club administrator
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', public: true },
    { id: 'fixtures', label: 'Fixtures', icon: '📅', public: true },
    { id: 'statistics', label: 'Statistics', icon: '📈', public: true },
    { id: 'management', label: 'Management', icon: '⚙️', public: false }
  ];

  return (
    <div className="min-h-screen">
      {/* Mobile-Only Design */}
      <div className="block md:hidden bg-white">
        {/* Simplified Mobile Header */}
        <div className="bg-club-primary text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Match Central</h1>
            <div className="flex gap-2">
              <a
                href="/match-recorder?mode=record"
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1"
                title="Record past or today's match"
              >
                <span>📝</span>
                <span className="text-sm">Record</span>
              </a>
              <a
                href="/match-recorder?mode=schedule"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1"
                title="Schedule future match"
              >
                <span>📅</span>
                <span className="text-sm">Schedule</span>
              </a>
            </div>
          </div>
        </div>

        {/* Simple Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-4">
          <nav className="flex space-x-1">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'overview'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => handleTabChange('fixtures')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'fixtures'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              Fixtures
            </button>
            <button
              onClick={() => handleTabChange('statistics')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'statistics'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              📊 Stats
            </button>
          </nav>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Mobile Overview */}
          {activeTab === 'overview' && (
            <div>
              {/* Simple Filter */}
              {teams.filter(team => !team.isOpponent).length > 1 && (
                <div className="mb-4">
                  <select
                    value={overviewFilter}
                    onChange={(e) => setOverviewFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Teams</option>
                    {teams.filter(team => !team.isOpponent).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mobile Match Cards */}
              <div className="space-y-3">
                {filteredOverviewResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚽</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">No Results Yet</h3>
                    <div className="flex gap-2">
                      <a
                        href="/match-recorder?mode=record"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                        title="Record past or today's match"
                      >
                        <span>📝</span>
                        Record Match
                      </a>
                      <a
                        href="/match-recorder?mode=schedule"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                        title="Schedule future match"
                      >
                        <span>📅</span>
                        Schedule Match
                      </a>
                    </div>
                  </div>
                ) : (
                  filteredOverviewResults.map((match) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = matchesWithExtra[match.id];
                    
                    if (!team) return null;

                    return (
                      <div
                        key={match.id}
                        className="bg-white rounded-lg border shadow-sm"
                      >
                        {/* Compact Mobile Card */}
                        <div 
                          className={`p-3 ${hasExtra ? 'cursor-pointer' : ''}`}
                          onClick={() => hasExtra && toggleMatchExpand(match.id)}
                        >
                          <div className="flex items-center justify-between">
                            {/* Teams & Date */}
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-900 mb-1">
                                {team.name} vs {match.opponent}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(match.scheduledDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Score */}
                            <div className="text-right">
                              <div className="text-xl font-black text-gray-900">
                                {result.teamScore} - {result.opponentScore}
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded ${
                                result.result === 'W' ? 'bg-green-100 text-green-700' :
                                result.result === 'L' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {hasExtra && isExpanded && (
                          <MatchExpandedDetails match={match} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Mobile Fixtures */}
          {activeTab === 'fixtures' && (
            <div className="space-y-3">
              {upcomingMatches.map((match) => {
                const team = teams.find(t => t.id === match.teamId);
                return (
                  <div key={match.id} className="bg-white rounded-lg border shadow-sm p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {team?.name || 'Unknown'} vs {match.opponent}
                        </div>
                        <div className="text-xs text-gray-600">
                          {match.scheduledDate.toLocaleDateString()} • {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <a
                        href={`/matches/${match.id}/record`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Log
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Statistics */}
          {activeTab === 'statistics' && (
            <div>
              {/* Team Selector */}
              <div className="mb-4">
                <select className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm">
                  <option value="">Select Team</option>
                  <option value="u16-boys">U16 Boys</option>
                  <option value="u14-girls">U14 Girls</option>
                  <option value="seniors">Senior Team</option>
                  <option value="u12-mixed">U12 Mixed</option>
                </select>
              </div>

              {/* Mobile Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-600">Played</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-gray-600">Wins</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-gray-600">Draws</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">2</div>
                  <div className="text-xs text-gray-600">Losses</div>
                </div>
              </div>

              {/* Goals & Performance */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">32</div>
                  <div className="text-xs text-gray-600">Goals For</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">18</div>
                  <div className="text-xs text-gray-600">Against</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600">+14</div>
                  <div className="text-xs text-gray-600">Difference</div>
                </div>
              </div>

              {/* Recent Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">📈 Recent Form</h3>
                <div className="flex space-x-1 justify-center">
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">D</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">⭐ Top Performers</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Most POTM:</span>
                    <span className="font-medium">Jamie O'Brien (3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Scorer:</span>
                    <span className="font-medium">Alex Murphy (8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Attendance:</span>
                    <span className="font-medium">450</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Design - Hidden on Mobile */}
      <div className="hidden md:block">
        <StandardLayout>
          <div className="min-h-screen bg-gray-50">
            {/* Simplified Mobile Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                {/* Desktop Layout */}
                <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-club-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Match Central</h1>
                  <p className="text-gray-600 mt-1">Complete football match management system</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Navigation Tabs */}
                <nav className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-club-primary text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Divider */}
                <div className="h-8 w-px bg-gray-300"></div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <div className="flex gap-2">
                    <a
                      href="/match-recorder?mode=record"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      title="Record past or today's match"
                    >
                      <span className="text-lg">📝</span>
                      <span className="hidden sm:inline">Record</span>
                    </a>
                    <a
                      href="/match-recorder?mode=schedule"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      title="Schedule future match"
                    >
                      <span className="text-lg">📅</span>
                      <span className="hidden sm:inline">Schedule</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-8">

        {/* Team Filter (for management) */}
        {(activeTab === 'management') && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Team Type Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTeam('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTeam === 'all'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Teams
                </button>
                <button
                  onClick={() => setSelectedTeam('opponents')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTeam === 'opponents'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Opponents
                </button>
              </div>

              {/* RVR Team Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">RVR Team:</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                >
                  <option value="all">All RVR Teams</option>
                  {teams.filter(team => team.team_type === 'rvr').map(team => (
                    <option key={team.id} value={team.id}>{team.team_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Filter Bar - Enhanced Features Style */}
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Match Results</h2>
                      <p className="text-sm text-gray-600">Track your team's performance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <select
                      value={overviewFilter}
                      onChange={(e) => setOverviewFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                    >
                      <option value="all">All Teams</option>
                      {teams.filter(team => !team.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-3">
                {filteredOverviewResults.length === 0 ? (
                  <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-3xl">⚽</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Yet!</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {overviewFilter === 'all' 
                        ? 'Play some matches and results will appear here!' 
                        : `No results yet for ${teams.find(t => t.id === overviewFilter)?.name || 'this team'}`
                      }
                    </p>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="/match-recorder?mode=record"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                        title="Record past or today's match"
                      >
                        <span className="text-xl">📝</span>
                        <span>Record Match</span>
                      </a>
                      <a
                        href="/match-recorder?mode=schedule"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                        title="Schedule future match"
                      >
                        <span className="text-xl">📅</span>
                        <span>Schedule Match</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  filteredOverviewResults.map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = matchesWithExtra[match.id];
                    
                    if (!team) return null;

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden relative ${
                          hasExtra ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => hasExtra && toggleMatchExpand(match.id)}
                      >
                        {/* Result Indicator Strip - Enhanced */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl ${
                          result.result === 'W' ? 'bg-gradient-to-b from-green-400 to-green-600' : 
                          result.result === 'L' ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-yellow-400 to-yellow-600'
                        }`}></div>
                        
                        {/* Main Card Content - Enhanced Layout */}
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            
                            {/* Left Side - Match Info */}
                            <div className="flex-1 pr-4">
                              {/* Teams */}
                              <div className="flex items-center gap-4 mb-3">
                                <div className="text-xl font-bold text-gray-900">
                                  {team.name}
                                </div>
                                <span className="text-gray-400 font-bold text-lg">vs</span>
                                <div className="text-xl font-bold text-gray-900">
                                  {match.opponent}
                                </div>
                              </div>
                              
                              {/* Match Details */}
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </span>
                                <span className={`px-3 py-1 rounded-lg font-semibold shadow-sm ${
                                  match.isHomeMatch 
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' 
                                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? '🏠 HOME' : '✈️ AWAY'}
                                </span>
                                <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-sm">
                                  {match.matchType}
                                </span>
                              </div>
                            </div>

                            {/* Right Side - Score & Actions */}
                            <div className="flex items-center gap-4">
                              {/* Edit Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/match-recorder?edit=${match.id}`);
                                }}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                title="Edit match"
                              >
                                ✏️
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this match result?')) {
                                    // Delete match from database
                                    const deleteMatch = async () => {
                                      const { error } = await supabase
                                        .from('matches')
                                        .delete()
                                        .eq('id', match.id);
                                      
                                      if (error) {
                                        console.error('Error deleting match:', error);
                                        alert('Error deleting match');
                                      } else {
                                        loadData();
                                      }
                                    };
                                    deleteMatch();
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                title="Delete match"
                              >
                                🗑️
                              </button>
                              
                              {/* Score Display */}
                              <div className="text-center bg-white/70 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-4xl font-black ${
                                    result.teamScore > result.opponentScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.teamScore}
                                  </span>
                                  <span className="text-gray-400 text-3xl font-bold">-</span>
                                  <span className={`text-4xl font-black ${
                                    result.opponentScore > result.teamScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.opponentScore}
                                  </span>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                                  result.result === 'W' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' :
                                  result.result === 'L' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700' :
                                  'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700'
                                }`}>
                                  {result.result === 'W' ? '🏆 WIN' : result.result === 'L' ? '💔 LOSS' : '🤝 DRAW'}
                                </div>
                              </div>
                            </div>

                            {/* Expand Arrow */}
                            <div className="px-6 pb-4">
                              {hasExtra && (
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-gray-400 hover:text-blue-600 transition-colors p-3 rounded-xl hover:bg-blue-50 shadow-sm hover:shadow-md"
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Extra Details */}
                        {hasExtra && (
                          <motion.div
                            initial={false}
                            animate={{ 
                              height: isExpanded ? 'auto' : 0,
                              opacity: isExpanded ? 1 : 0
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <MatchExpandedDetails match={match} />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Management Tab - Requires Authentication */}
          {activeTab === 'management' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Team Management</h3>
                      <p className="text-gray-600">Manage River Valley Rangers teams</p>
                    </div>
                    <a
                      href="/match-admin"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                    >
                      <span className="mr-2">➕</span>
                      Add New Team
                    </a>
                  </div>
                </div>

                {/* Teams Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teams.filter(team => {
                    if (selectedTeam === 'all') return true;
                    if (selectedTeam === 'opponents') return team.team_type === 'opponent';
                    return team.id === selectedTeam;
                  }).map((team) => (
                    <div key={team.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{team.team_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              team.team_type === 'rvr' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {team.team_type === 'rvr' ? 'RVR Team' : 'Opponent'}
                            </span>
                            <span className="text-gray-500 text-sm">{team.age_group}</span>
                          </div>
                        </div>
                        <div className="text-2xl">{team.team_type === 'rvr' ? '⚽' : '🏃'}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Players:</span>
                            <span className="ml-1 font-semibold text-gray-900">{team.players?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Manager:</span>
                            <span className="ml-1 font-semibold text-gray-900">{team.manager || 'TBA'}</span>
                          </div>
                        </div>

                        {team.notes && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500">Notes:</span>
                            <p className="text-sm text-gray-700 mt-1">{team.notes}</p>
                          </div>
                        )}

                        <div className="pt-3 border-t flex gap-2">
                          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            View Details
                          </button>
                          <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {teams.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Found</h3>
                    <p className="text-gray-600 mb-6">
                      Get started by creating your first team using the Match Admin wizard.
                    </p>
                    <a
                      href="/match-admin"
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <span className="mr-2">🚀</span>
                      Create First Team
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Fixtures Tab */}
          {activeTab === 'fixtures' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Fixtures</h2>
                    <p className="text-sm text-gray-600">
                      {upcomingMatches.length} match{upcomingMatches.length !== 1 ? 'es' : ''} scheduled
                    </p>
                  </div>
                </div>
                  
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl p-8 text-center shadow-lg border border-purple-100">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <span className="text-white text-3xl">📅</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">No Fixtures Scheduled</h3>
                        <p className="text-gray-600 mb-6">
                          {selectedTeam === 'all' ? 'No upcoming fixtures scheduled' : 'No upcoming fixtures for selected team'}
                        </p>
                      </div>
                    ) : (
                      upcomingMatches.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        return (
                          <motion.div 
                            key={match.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden relative"
                          >
                            {/* Future Match Indicator Strip */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-400 to-purple-600 rounded-l-xl"></div>
                            
                            {/* Card Content */}
                            <div className="p-6">
                              <div className="flex items-center justify-between">
                                
                                {/* Left Side - Match Info */}
                                <div className="flex-1 pr-4">
                                  {/* Teams */}
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className="text-xl font-bold text-gray-900">
                                      {team.name}
                                    </div>
                                    <span className="text-gray-400 font-bold text-lg">vs</span>
                                    <div className="text-xl font-bold text-gray-900">
                                      {match.opponent}
                                    </div>
                                  </div>
                                  
                                  {/* Match Details */}
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleDateString()}
                                    </span>
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg font-semibold shadow-sm ${
                                      match.isHomeMatch 
                                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' 
                                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                                    }`}>
                                      {match.isHomeMatch ? '🏠 HOME' : '✈️ AWAY'}
                                    </span>
                                    <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-sm">
                                      {match.matchType}
                                    </span>
                                  </div>
                                </div>

                                {/* Right Side - Actions */}
                                <div className="flex items-center gap-4">
                                  {/* Edit Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/match-recorder?edit=${match.id}`);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Edit fixture"
                                  >
                                    ✏️
                                  </button>
                                  
                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm('Are you sure you want to delete this fixture?')) {
                                        // Delete fixture from database
                                        const deleteMatch = async () => {
                                          const { error } = await supabase
                                            .from('matches')
                                            .delete()
                                            .eq('id', match.id);
                                          
                                          if (error) {
                                            console.error('Error deleting fixture:', error);
                                            alert('Error deleting fixture');
                                          } else {
                                            loadData();
                                          }
                                        };
                                        deleteMatch();
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Delete fixture"
                                  >
                                    🗑️
                                  </button>
                                  
                                  {/* Action Button */}
                                  <a
                                    href={`/matches/${match.id}/record`}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                  >
                                    📝 Record
                                  </a>
                                  
                                  {/* Fixture Badge */}
                                  <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-200 text-blue-700 rounded-xl text-sm font-bold shadow-sm">
                                    📅 FIXTURE
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Season Statistics</h2>
                      <p className="text-sm text-gray-600">Team performance analytics</p>
                    </div>
                  </div>
                  
                  {/* Team Selector for Stats */}
                  <select 
                    value={selectedStatsTeam}
                    onChange={(e) => setSelectedStatsTeam(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Teams</option>
                    {teams.filter(team => !team.isOpponent).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                {/* Main Stats Grid - Real Data */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-3">⚽</div>
                    <div className="text-3xl font-black text-green-600">{currentStats.played}</div>
                    <div className="text-sm text-gray-600 font-semibold">Matches Played</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-3">🏆</div>
                    <div className="text-3xl font-black text-blue-600">{currentStats.won}</div>
                    <div className="text-sm text-gray-600 font-semibold">Wins</div>
                    {/* Win Percentage Gauge */}
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentStats.winPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{currentStats.winPercentage.toFixed(1)}%</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-3">🤝</div>
                    <div className="text-3xl font-black text-yellow-600">{currentStats.drawn}</div>
                    <div className="text-sm text-gray-600 font-semibold">Draws</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-3">💔</div>
                    <div className="text-3xl font-black text-red-600">{currentStats.lost}</div>
                    <div className="text-sm text-gray-600 font-semibold">Losses</div>
                  </motion.div>
                </div>

                {/* Goals Analysis */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🥅</div>
                    <div className="text-2xl font-black text-emerald-600">{currentStats.goalsFor}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goals For</div>
                    <div className="text-xs text-emerald-600 mt-1">{currentStats.avgGoalsFor.toFixed(1)} avg</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="text-2xl font-black text-orange-600">{currentStats.goalsAgainst}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goals Against</div>
                    <div className="text-xs text-orange-600 mt-1">{currentStats.avgGoalsAgainst.toFixed(1)} avg</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🛡️</div>
                    <div className="text-2xl font-black text-teal-600">{currentStats.cleanSheets}</div>
                    <div className="text-xs text-gray-600 font-semibold">Clean Sheets</div>
                    <div className="text-xs text-teal-600 mt-1">
                      {currentStats.played > 0 ? ((currentStats.cleanSheets / currentStats.played) * 100).toFixed(1) : 0}%
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="text-2xl font-black text-purple-600">{currentStats.goalsFor - currentStats.goalsAgainst > 0 ? '+' : ''}{currentStats.goalsFor - currentStats.goalsAgainst}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goal Difference</div>
                  </motion.div>
                </div>

                {/* Performance Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  
                  {/* Home vs Away Performance */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">🏠</span>
                      Home vs Away
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Home Record:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            {currentStats.homeWins}W-{currentStats.homeMatches - currentStats.homeWins}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${currentStats.homeMatches > 0 ? (currentStats.homeWins / currentStats.homeMatches) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Away Record:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">
                            {currentStats.won - currentStats.homeWins}W-{currentStats.awayMatches - (currentStats.won - currentStats.homeWins)}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${currentStats.awayMatches > 0 ? ((currentStats.won - currentStats.homeWins) / currentStats.awayMatches) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Form */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">📈</span>
                      Recent Form
                    </h3>
                    <div className="flex space-x-2 mb-3 justify-center">
                      {currentStats.form.length > 0 ? (
                        currentStats.form.map((result, index) => (
                          <motion.span 
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md ${
                              result === 'W' ? 'bg-green-500' : 
                              result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </motion.span>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm">No recent matches</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 text-center">Last {currentStats.form.length} matches</p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">📊</span>
                      Achievements
                    </h3>
                    <div className="space-y-3 text-sm">
                      {currentStats.biggestWin.margin > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Biggest Win:</span>
                          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            {currentStats.biggestWin.score}
                          </span>
                        </div>
                      )}
                      {currentStats.biggestLoss.margin > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Biggest Loss:</span>
                          <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            {currentStats.biggestLoss.score}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Points (3-1-0):</span>
                        <span className="font-bold text-purple-600">
                          {(currentStats.won * 3) + currentStats.drawn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Statistics Tables */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Top Scorers */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">🥅</span>
                      Top Scorers
                    </h3>
                    <div className="space-y-3">
                      {playerStats.topScorers.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">⚽</div>
                          <p className="text-gray-500 text-sm">No goals recorded yet</p>
                        </div>
                      ) : (
                        playerStats.topScorers.map((player, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-900">{player.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-yellow-600 text-lg">{player.goals}</div>
                              <div className="text-xs text-gray-500">goals</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Top Assists */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">🎯</span>
                      Top Assists
                    </h3>
                    <div className="space-y-3">
                      {playerStats.topAssists.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">🎯</div>
                          <p className="text-gray-500 text-sm">No assists recorded yet</p>
                        </div>
                      ) : (
                        playerStats.topAssists.map((player, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-cyan-400' : index === 2 ? 'bg-blue-600' : 'bg-gray-300'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-900">{player.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600 text-lg">{player.assists}</div>
                              <div className="text-xs text-gray-500">assists</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Most Matches */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">🏃</span>
                      Most Matches
                    </h3>
                    <div className="space-y-3">
                      {playerStats.mostMatches.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">⚽</div>
                          <p className="text-gray-500 text-sm">No player data yet</p>
                        </div>
                      ) : (
                        playerStats.mostMatches.map((player, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-pink-400' : index === 2 ? 'bg-purple-600' : 'bg-gray-300'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-gray-900">{player.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-purple-600 text-lg">{player.matches}</div>
                              <div className="text-xs text-gray-500">matches</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
        </div>
          </div>
        </StandardLayout>
      </div>
    </div>
  );
}