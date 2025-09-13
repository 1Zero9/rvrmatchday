/**
 * MatchDay - Public Scoreboard
 * Public version of match central showing only basic results and fixtures
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import MobileLayout from "../components/MobileLayout";
import MobilePageContainer from "../components/mobile/MobilePageContainer";
import AdvancedTeamFilter from "../components/AdvancedTeamFilter";
import { supabase } from "../lib/supabase";
import { Team, Match } from "../types/match-tracker";

type TabType = 'results' | 'fixtures' | 'quickrecord';

export default function MatchDay() {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [selectedMatchType, setSelectedMatchType] = useState<string>('All');
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  const [fullScreenMatch, setFullScreenMatch] = useState<Match | null>(null);

  const loadData = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
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
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (teamsError) {
        console.error('Error loading teams:', teamsError);
        setTeams([]);
      } else {
        const loadedTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.name,
          ageGroup: team.age_group || 'Open',
          gender: team.gender || 'Mixed',
          season: team.season || '2024-25',
          league: team.league || 'Unassigned',
          homeVenue: team.home_venue || 'St. Finian\'s GAA',
          contactEmail: team.contact_email || '',
          contactPhone: team.contact_phone || '',
          coaches: Array.isArray(team.coaches) ? team.coaches : (team.coaches ? [team.coaches] : []),
          notes: team.notes || '',
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.is_opponent || false,
          isActive: team.is_active !== false,
          players: team.players?.filter((p: any) => p.is_active !== false).map((p: any) => ({
            id: p.id,
            teamId: team.id,
            name: `${p.first_name} ${p.last_name}`.trim(),
            position: p.position || 'Field Player',
            isCaptain: p.is_captain || false,
            isViceCaptain: p.is_vice_captain || false,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })) || [],
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        })) || [];
        setTeams(loadedTeams);
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          team_id,
          opponent,
          scheduled_date,
          match_type,
          is_home_match,
          status,
          home_score,
          away_score,
          venue
        `)
        .order('scheduled_date', { ascending: false });

      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setAllMatches([]);
      } else {
        const loadedMatches: Match[] = matchesData?.map(match => ({
          id: match.id,
          teamId: match.team_id,
          opponent: match.opponent,
          scheduledDate: new Date(match.scheduled_date),
          venue: match.venue || 'St. Finian\'s GAA',
          isHomeMatch: match.is_home_match || false,
          matchType: match.match_type || 'Friendly',
          status: match.status || 'Scheduled',
          homeScore: match.home_score,
          awayScore: match.away_score
        })) || [];
        setAllMatches(loadedMatches);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const toggleMatchExpand = (matchId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  // Full-screen match modal functions
  const openFullScreenMatch = (match: Match) => {
    setFullScreenMatch(match);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeFullScreenMatch = () => {
    setFullScreenMatch(null);
    document.body.style.overflow = 'unset';
  };

  // Keyboard escape functionality
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenMatch) {
        closeFullScreenMatch();
      }
    };

    if (fullScreenMatch) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [fullScreenMatch]);

  useEffect(() => {
    loadData();
  }, []);

  const getRecentResults = () => {
    return allMatches
      .filter(match => 
        match.status === 'Finished' && 
        match.homeScore !== undefined && 
        match.awayScore !== undefined &&
        (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
        (selectedMatchType === 'All' || match.matchType === selectedMatchType)
      )
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 8); // Show more results with better layout
  };

  const getUpcomingFixtures = () => {
    return allMatches
      .filter(match => 
        match.status === 'Scheduled' &&
        (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
        (selectedMatchType === 'All' || match.matchType === selectedMatchType)
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 8); // Show more fixtures with better layout
  };

  const getSeasonStats = () => {
    const filteredMatches = allMatches.filter(match => 
      match.status === 'Finished' && 
      match.homeScore !== undefined && 
      match.awayScore !== undefined &&
      (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
      (selectedMatchType === 'All' || match.matchType === selectedMatchType)
    );

    const stats = {
      played: filteredMatches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    filteredMatches.forEach(match => {
      const result = getMatchResult(match);
      const teamScore = result.teamScore;
      const opponentScore = result.opponentScore;
      
      stats.goalsFor += teamScore;
      stats.goalsAgainst += opponentScore;
      
      if (result.result === 'W') stats.won++;
      else if (result.result === 'D') stats.drawn++;
      else if (result.result === 'L') stats.lost++;
    });

    return stats;
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

  const recentResults = React.useMemo(() => getRecentResults(), [allMatches, selectedTeamId, selectedMatchType]);
  const upcomingFixtures = React.useMemo(() => getUpcomingFixtures(), [allMatches, selectedTeamId, selectedMatchType]);
  const seasonStats = React.useMemo(() => getSeasonStats(), [allMatches, selectedTeamId, selectedMatchType]);

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading MatchDay...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen">
        {/* Mobile Version */}
        <div className="block md:hidden">
          <MobileLayout currentPage="/matchday" showNavigation={false}>
            <MobilePageContainer 
              title="MatchDay"
              subtitle="Live Scores & Results"
              icon="⚽"
            >

              {/* Mobile Tab Navigation */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  {[
                    { key: 'results', label: 'Recent Results', icon: '🏆' },
                    { key: 'fixtures', label: 'Fixtures', icon: '📅' },
                    { key: 'quickrecord', label: 'Quick Record', icon: '📱' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as TabType)}
                      className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all backdrop-blur-xl border ${
                        activeTab === tab.key
                          ? 'bg-white/20 text-white border-white/30 shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/15 border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Content */}
              {activeTab === 'results' && (
                <div className="space-y-3">
                  <h2 className="font-bold text-sm text-white mb-4">Recent Results</h2>
                  {recentResults.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                      <p className="text-white/70">No recent results</p>
                    </div>
                  ) : (
                    recentResults.slice(0, 5).map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      const result = getMatchResult(match);
                      if (!team) return null;
                      
                      return (
                        <div key={match.id} className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-blue-200">
                              {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold ${
                              result.result === 'W' ? 'bg-green-500/20 text-green-200' : 
                              result.result === 'L' ? 'bg-red-500/20 text-red-200' : 'bg-yellow-500/20 text-yellow-200'
                            }`}>
                              {result.result}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{team.name}</div>
                              <div className="text-sm text-blue-200">vs {match.opponent}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">
                                {result.teamScore} - {result.opponentScore}
                              </div>
                            </div>
                          </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

              {activeTab === 'fixtures' && (
                <div className="space-y-3">
                  <h2 className="font-bold text-sm text-white mb-4">Upcoming Fixtures</h2>
                  {upcomingFixtures.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                      <p className="text-white/70">No upcoming fixtures</p>
                    </div>
                  ) : (
                    upcomingFixtures.slice(0, 5).map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      if (!team) return null;
                      
                      return (
                        <div key={match.id} className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-blue-200">
                              {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            <div className="text-sm text-blue-200">
                              {match.isHomeMatch ? 'Home' : 'Away'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{team.name}</div>
                              <div className="text-sm text-blue-200">vs {match.opponent}</div>
                            </div>
                            <div className="text-right text-sm text-blue-100">
                              {match.venue}
                            </div>
                          </div>
                      </div>
                    );
                  })
                )}
                </div>
              )}

              {activeTab === 'quickrecord' && (
                <div className="space-y-4">
                  <h2 className="font-bold text-sm text-white mb-4">Quick Match Tracker</h2>
                  
                  {/* Quick Record Info */}
                  <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">📱</div>
                      <h3 className="text-white font-bold text-lg mb-2">Parent Match Tracker</h3>
                      <p className="text-blue-200 text-sm">
                        Simple match tracking for parents - record time, score, and basic match details
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">⏱️</span>
                          <div>
                            <h4 className="text-white font-medium text-sm">Time Tracking</h4>
                            <p className="text-blue-200 text-xs">Live match timer with start/pause controls</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📊</span>
                          <div>
                            <h4 className="text-white font-medium text-sm">Score Tracking</h4>
                            <p className="text-blue-200 text-xs">Simple +/- buttons for team scores</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">⚽</span>
                          <div>
                            <h4 className="text-white font-medium text-sm">Match Formats</h4>
                            <p className="text-blue-200 text-xs">5v5, 7v7, 9v9, 11v11 support</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <a 
                        href="/quick-record"
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
                      >
                        📱 Start Match Tracker
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </MobilePageContainer>
          </MobileLayout>
        </div>

        {/* Desktop Version */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-green-50 to-blue-50">
        
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">MatchDay</h1>
                  <p className="text-sm text-gray-600">Live scores and fixtures</p>
                </div>
              </div>

              {/* Center - Tab Navigation */}
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                    activeTab === 'results'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>🏆</span>
                  <span>Results</span>
                </button>
                <button
                  onClick={() => setActiveTab('fixtures')}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                    activeTab === 'fixtures'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>📅</span>
                  <span>Fixtures</span>
                </button>
              </nav>

              {/* Right side - Filters */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 hidden sm:block">Filter:</label>
                <AdvancedTeamFilter
                  teams={teams}
                  selectedTeamId={selectedTeamId}
                  onSelectionChange={setSelectedTeamId}
                  className="w-64"
                />
                <select
                  value={selectedMatchType}
                  onChange={(e) => setSelectedMatchType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium w-32"
                >
                  <option value="All">All matches</option>
                  <option value="League">League</option>
                  <option value="Cup">Cup</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Tournament">Tournament</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar - Season Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-bold text-gray-900">Season Overview</h3>
                </div>
                
                {selectedTeamId !== 'all' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-800">
                      {teams.find(t => t.id === selectedTeamId)?.name}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Played</span>
                    <span className="text-lg font-bold text-gray-900">{seasonStats.played}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Won</span>
                    <span className="text-lg font-bold text-green-600">{seasonStats.won}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-700">Drawn</span>
                    <span className="text-lg font-bold text-yellow-600">{seasonStats.drawn}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Lost</span>
                    <span className="text-lg font-bold text-red-600">{seasonStats.lost}</span>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Goals For</span>
                    <span className="text-lg font-bold text-blue-600">{seasonStats.goalsFor}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-700">Goals Against</span>
                    <span className="text-lg font-bold text-purple-600">{seasonStats.goalsAgainst}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-gray-700">Goal Difference</span>
                    <span className={`text-lg font-bold ${
                      (seasonStats.goalsFor - seasonStats.goalsAgainst) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {seasonStats.goalsFor - seasonStats.goalsAgainst >= 0 ? '+' : ''}{seasonStats.goalsFor - seasonStats.goalsAgainst}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <h2 className="text-xl font-bold text-gray-900">Latest Results</h2>
                    <span className="text-sm text-gray-500">({recentResults.length} matches)</span>
                  </div>

                  {recentResults.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⚽</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                      <p className="text-gray-600">Match results will appear here once games are played.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {recentResults.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const result = getMatchResult(match);
                        
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                            onClick={() => toggleMatchExpand(match.id)}
                          >
                            <div className={`h-1 ${
                              result.result === 'W' ? 'bg-green-500' : 
                              result.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <div className={`text-lg font-bold ${
                                    result.result === 'W' ? 'text-green-600' : 
                                    result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {result.teamScore} - {result.opponentScore}
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    result.result === 'W' ? 'bg-green-100 text-green-700' : 
                                    result.result === 'L' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                  <span className={`px-2 py-1 rounded ${
                                    match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                  </span>
                                  <span>{match.venue}</span>
                                  <span>{match.matchType}</span>
                                </div>
                                
                                {/* Epic View Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFullScreenMatch(match);
                                  }}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold transition-all transform hover:scale-105 shadow-sm"
                                  title="Epic View"
                                >
                                  🎬
                                </button>
                              </div>

                              {/* Expanded Content */}
                              {expandedResults[match.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                                >
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                      <span>Match Date:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleDateString('en-GB', { 
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Kick-off Time:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Competition:</span>
                                      <span className="font-medium text-gray-900">{match.matchType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Venue:</span>
                                      <span className="font-medium text-gray-900">{match.venue}</span>
                                    </div>
                                    {match.status === 'Finished' && (
                                      <div className="flex justify-between pt-2 border-t border-gray-100">
                                        <span>Final Result:</span>
                                        <span className={`font-bold ${
                                          result.result === 'W' ? 'text-green-600' : 
                                          result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                          {result.result === 'W' ? '🏆 VICTORY' : 
                                           result.result === 'L' ? '💪 DEFEAT' : '🤝 DRAW'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'fixtures' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">📅</span>
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Fixtures</h2>
                    <span className="text-sm text-gray-500">({upcomingFixtures.length} matches)</span>
                  </div>

                  {upcomingFixtures.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">📅</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Fixtures</h3>
                      <p className="text-gray-600">New fixtures will be added soon.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {upcomingFixtures.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => toggleMatchExpand(match.id)}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-blue-600">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  {new Date(match.scheduledDate).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                  <span className={`px-2 py-1 rounded ${
                                    match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                  </span>
                                  <span>{match.venue}</span>
                                  <span>{match.matchType}</span>
                                </div>
                                
                                {/* Epic View Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFullScreenMatch(match);
                                  }}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold transition-all transform hover:scale-105 shadow-sm"
                                  title="Epic View"
                                >
                                  🎬
                                </button>
                              </div>

                              {/* Expanded Content */}
                              {expandedResults[match.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                                >
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                      <span>Match Date:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleDateString('en-GB', { 
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Kick-off Time:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Competition:</span>
                                      <span className="font-medium text-gray-900">{match.matchType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Venue:</span>
                                      <span className="font-medium text-gray-900">{match.venue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Status:</span>
                                      <span className="font-medium text-blue-600">SCHEDULED</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div> {/* End grid */}
        </div> {/* End container */}
          </div> {/* End desktop bg */}
        </div> {/* End desktop version */}
      </div> {/* End mobile/desktop wrapper */}

      {/* Epic Full-Screen Match Card Modal */}
      <AnimatePresence>
        {fullScreenMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            {/* Cinematic Backdrop with Particles */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/90"
              style={{
                backdropFilter: 'blur(20px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
              }}
              onClick={closeFullScreenMatch}
            >
              {/* Animated Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    initial={{ 
                      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                      scale: 0,
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Epic Card Container */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                duration: 1.2 
              }}
              className="relative max-w-md w-full max-h-[70vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 0.5 }}
                onClick={closeFullScreenMatch}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Epic Match Card */}
              <motion.div
                className="relative bg-gradient-to-br from-white via-gray-50 to-blue-100 rounded-3xl shadow-2xl border-2 border-white/30 overflow-hidden"
                style={{
                  background: (() => {
                    const result = allMatches.find(m => m.id === fullScreenMatch.id && m.status === 'Finished') || null;
                    if (!result || result.homeScore === undefined || result.awayScore === undefined) return 'linear-gradient(135deg, #ffffff, #f8fafc, #e0f2fe)';
                    
                    const team = teams.find(t => t.id === fullScreenMatch.teamId);
                    const teamScore = fullScreenMatch.isHomeMatch ? result.homeScore : result.awayScore;
                    const opponentScore = fullScreenMatch.isHomeMatch ? result.awayScore : result.homeScore;
                    
                    const matchResult = teamScore > opponentScore ? 'W' : teamScore < opponentScore ? 'L' : 'D';
                    
                    return matchResult === 'W' ? 
                      'linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0, #86efac)' : 
                      matchResult === 'L' ? 
                      'linear-gradient(135deg, #fef2f2, #fecaca, #fca5a5, #f87171)' : 
                      'linear-gradient(135deg, #fffbeb, #fef3c7, #fde68a, #facc15)';
                  })(),
                  transform: 'perspective(1000px)',
                }}
                whileHover={{
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02,
                }}
              >
                {/* Holographic Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    x: [-200, 200],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  style={{
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                />

                {/* Header Section */}
                <div className="relative p-4 pb-3">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-6"
                  >
                    <h1 className="text-lg md:text-2xl font-black text-gray-800 mb-2 tracking-tight">
                      MATCH DETAILS
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
                  </motion.div>

                  {/* Teams Display */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="flex items-center justify-center gap-4 mb-4"
                  >
                    {/* Home Team */}
                    <div className="text-center">
                      <div className="text-base md:text-xl font-black text-gray-900 mb-1">
                        {teams.find(t => t.id === fullScreenMatch.teamId)?.name || 'Unknown Team'}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold bg-white/70 px-4 py-2 rounded-full">
                        HOME TEAM
                      </div>
                    </div>

                    {/* VS */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                      className="text-lg md:text-2xl font-black text-gray-400"
                    >
                      VS
                    </motion.div>

                    {/* Opponent */}
                    <div className="text-center">
                      <div className="text-base md:text-xl font-black text-gray-900 mb-1">
                        {fullScreenMatch.opponent}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold bg-white/70 px-4 py-2 rounded-full">
                        OPPONENT
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Match Details Grid */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Date */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-lg text-center"
                    >
                      <div className="text-lg mb-1">📅</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {fullScreenMatch.scheduledDate.toLocaleDateString('en-GB', { 
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">MATCH DATE</div>
                    </motion.div>

                    {/* Time */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-lg text-center"
                    >
                      <div className="text-lg mb-1">⏰</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {fullScreenMatch.scheduledDate.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">KICK OFF</div>
                    </motion.div>

                    {/* Venue */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-lg text-center"
                    >
                      <div className="text-lg mb-1">
                        {fullScreenMatch.isHomeMatch ? '🏠' : '✈️'}
                      </div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {fullScreenMatch.isHomeMatch ? 'HOME' : 'AWAY'}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">VENUE</div>
                    </motion.div>

                    {/* Match Type */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-lg text-center"
                    >
                      <div className="text-lg mb-1">⚽</div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {fullScreenMatch.matchType}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">TYPE</div>
                    </motion.div>
                  </div>

                  {/* Score Section (if match is finished) */}
                  {(() => {
                    const result = allMatches.find(m => m.id === fullScreenMatch.id && m.status === 'Finished');
                    if (!result || result.homeScore === undefined || result.awayScore === undefined) return null;
                    
                    const team = teams.find(t => t.id === fullScreenMatch.teamId);
                    const teamScore = fullScreenMatch.isHomeMatch ? result.homeScore : result.awayScore;
                    const opponentScore = fullScreenMatch.isHomeMatch ? result.awayScore : result.homeScore;
                    const matchResult = teamScore > opponentScore ? 'W' : teamScore < opponentScore ? 'L' : 'D';

                    return (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9, type: "spring", damping: 15 }}
                        className="mt-4 text-center"
                      >
                        <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                          <h2 className="text-lg font-bold text-gray-800 mb-3">FINAL SCORE</h2>
                          <div className="flex items-center justify-center gap-4">
                            <motion.div
                              className="text-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className={`text-2xl md:text-4xl font-black mb-1 ${
                                matchResult === 'W' ? 'text-green-600' :
                                matchResult === 'L' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {teamScore}
                              </div>
                              <div className="text-sm font-semibold text-gray-700">
                                {team?.name || 'Unknown'}
                              </div>
                            </motion.div>

                            <div className="text-2xl font-bold text-gray-400">-</div>

                            <motion.div
                              className="text-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="text-2xl md:text-4xl font-black text-gray-600 mb-1">
                                {opponentScore}
                              </div>
                              <div className="text-sm font-semibold text-gray-700">
                                {fullScreenMatch.opponent}
                              </div>
                            </motion.div>
                          </div>

                          {/* Result Badge */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2, type: "spring" }}
                            className={`mt-3 inline-block px-4 py-2 rounded-xl text-white font-black text-sm shadow-xl ${
                              matchResult === 'W' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              matchResult === 'L' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            }`}
                          >
                            {matchResult === 'W' ? '🏆 VICTORY!' :
                             matchResult === 'L' ? '💪 DEFEAT' :
                             '🤝 DRAW'}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StandardLayout>
  );
}
