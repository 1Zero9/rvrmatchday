/**
 * MatchDay - Public Scoreboard
 * Public version of match central showing only basic results and fixtures
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import AdvancedTeamFilter from "../components/AdvancedTeamFilter";
import { supabase } from "../lib/supabase";
import { Team, Match } from "../types/match-tracker";

type TabType = 'results' | 'fixtures';

export default function MatchDay() {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [selectedMatchType, setSelectedMatchType] = useState<string>('All');

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
          {/* Mobile Header */}
          <div className="p-6 shadow-lg text-white" style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}>
            <div className="text-center">
              <h1 className="font-bold text-2xl text-white mb-1">MatchDay</h1>
              <p className="text-pink-200">Live scores & fixtures</p>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex space-x-1">
              {[
                { key: 'results', label: 'Recent Results' },
                { key: 'fixtures', label: 'Fixtures' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.key
                      ? 'text-white shadow-md'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    background: activeTab === tab.key ? 'linear-gradient(to right, #972A4C, #7A2240)' : undefined
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Content */}
          <div className="p-4 bg-gray-50">
            {activeTab === 'results' && (
              <div className="space-y-3">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Recent Results</h2>
                {recentResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent results</p>
                ) : (
                  recentResults.slice(0, 5).map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    if (!team) return null;
                    
                    return (
                      <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-500">
                            {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            result.result === 'W' ? 'bg-green-100 text-green-800' : 
                            result.result === 'L' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.result}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-600">vs {match.opponent}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold" style={{color: '#972A4C'}}>
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
                <h2 className="font-bold text-lg text-gray-900 mb-4">Upcoming Fixtures</h2>
                {upcomingFixtures.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming fixtures</p>
                ) : (
                  upcomingFixtures.slice(0, 5).map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    if (!team) return null;
                    
                    return (
                      <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium" style={{color: '#972A4C'}}>
                            {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.isHomeMatch ? 'Home' : 'Away'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{team.name}</div>
                            <div className="text-sm text-gray-600">vs {match.opponent}</div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {match.venue}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Version */}
        <div className="hidden md:block bg-gradient-to-br from-green-50 to-blue-50">
        
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
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
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
                              
                              <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                                <span className={`px-2 py-1 rounded ${
                                  match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <span>{match.venue}</span>
                                <span>{match.matchType}</span>
                              </div>
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
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                              
                              <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                                <span className={`px-2 py-1 rounded ${
                                  match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <span>{match.venue}</span>
                                <span>{match.matchType}</span>
                              </div>
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
        </div> {/* End desktop version */}
        </div> {/* End mobile/desktop wrapper */}
      </div> {/* End bg */}
    </StandardLayout>
  );
}
