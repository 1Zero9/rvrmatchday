/**
 * MatchDay - Public Scoreboard
 * Public version of match central showing only basic results and fixtures
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { supabase } from "../lib/supabase";
import { Team, Match } from "../types/match-tracker";

type TabType = 'results' | 'fixtures';

export default function MatchDay() {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  const loadData = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });

      if (teamsError) {
        console.error('Error loading teams:', teamsError);
        setTeams([]);
      } else {
        const loadedTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.name,
          category: team.age_group || 'Unknown',
          ageGroup: team.age_group || 'Open',
          gender: team.gender || 'Mixed',
          season: team.season || '2024/25',
          league: team.league || 'Local',
          homeVenue: team.home_venue || 'St. Finian\'s GAA',
          contactEmail: team.contact_email || '',
          contactPhone: team.contact_phone || '',
          coaches: team.coaches || [],
          notes: team.notes || '',
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.is_opponent || false,
          players: team.players?.map((p: any) => ({
            id: p.id,
            teamId: team.id,
            name: p.first_name,
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
        .select('*')
        .order('match_date', { ascending: false });

      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setAllMatches([]);
      } else {
        const loadedMatches: Match[] = matchesData?.map(match => ({
          id: match.id,
          teamId: match.team_id,
          opponent: match.opponent,
          scheduledDate: new Date(match.match_date),
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
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 10);
  };

  const getUpcomingFixtures = () => {
    return allMatches
      .filter(match => match.status === 'Scheduled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 10);
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

  const recentResults = React.useMemo(() => getRecentResults(), [allMatches]);
  const upcomingFixtures = React.useMemo(() => getUpcomingFixtures(), [allMatches]);

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">MatchDay</h1>
                  <p className="text-gray-600 mt-1">Live scores and upcoming fixtures</p>
                </div>
              </div>
              
              {/* Public Tab Navigation */}
              <nav className="flex justify-center space-x-2">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === 'results'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🏆</span>
                  <span>Results</span>
                </button>
                <button
                  onClick={() => setActiveTab('fixtures')}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === 'fixtures'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <span>Fixtures</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Results Tab */}
          {activeTab === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-green-50 rounded-xl shadow-lg border border-green-100 p-6 mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Latest Results</h2>
                    <p className="text-sm text-gray-600">Recent match outcomes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentResults.length === 0 ? (
                    <div className="bg-gradient-to-br from-white via-gray-50 to-green-50 rounded-xl p-8 text-center shadow-lg border border-green-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-3xl">⚽</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Yet!</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Match results will appear here once games have been played.
                      </p>
                    </div>
                  ) : (
                    recentResults.map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      const result = getMatchResult(match);
                      
                      if (!team) return null;

                      return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-gradient-to-br from-white via-gray-50 to-green-50 rounded-xl shadow-lg border border-green-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden relative"
                        >
                          {/* Result Indicator Strip */}
                          <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl ${
                            result.result === 'W' ? 'bg-gradient-to-b from-green-400 to-green-600' : 
                            result.result === 'L' ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-yellow-400 to-yellow-600'
                          }`}></div>
                          
                          {/* Main Card Content */}
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

                              {/* Right Side - Score Display */}
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
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
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
                      {upcomingFixtures.length} match{upcomingFixtures.length !== 1 ? 'es' : ''} scheduled
                    </p>
                  </div>
                </div>
                  
                <div className="space-y-4">
                  {upcomingFixtures.length === 0 ? (
                    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl p-8 text-center shadow-lg border border-blue-100">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-3xl">📅</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No Fixtures Scheduled</h3>
                      <p className="text-gray-600 mb-6">
                        Upcoming fixtures will appear here when they are scheduled.
                      </p>
                    </div>
                  ) : (
                    upcomingFixtures.map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      return (
                        <motion.div 
                          key={match.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden relative"
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

                              {/* Right Side - Fixture Badge */}
                              <div className="text-center">
                                <div className="px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-200 text-blue-700 rounded-xl text-lg font-bold shadow-sm">
                                  📅 FIXTURE
                                </div>
                                {match.venue && (
                                  <div className="text-sm text-gray-600 mt-2 font-medium">
                                    📍 {match.venue}
                                  </div>
                                )}
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

          {/* Quick Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Season Overview</h2>
                <p className="text-sm text-gray-600">Club performance summary</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">⚽</div>
                <div className="text-2xl font-bold text-green-600">{recentResults.length}</div>
                <div className="text-xs text-gray-600 font-medium">Matches Played</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-blue-600">
                  {recentResults.filter(m => {
                    const result = getMatchResult(m);
                    return result.result === 'W';
                  }).length}
                </div>
                <div className="text-xs text-gray-600 font-medium">Wins</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {recentResults.filter(m => {
                    const result = getMatchResult(m);
                    return result.result === 'D';
                  }).length}
                </div>
                <div className="text-xs text-gray-600 font-medium">Draws</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">💔</div>
                <div className="text-2xl font-bold text-red-600">
                  {recentResults.filter(m => {
                    const result = getMatchResult(m);
                    return result.result === 'L';
                  }).length}
                </div>
                <div className="text-xs text-gray-600 font-medium">Losses</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}