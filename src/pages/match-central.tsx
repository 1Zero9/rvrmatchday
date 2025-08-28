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
import { storage } from "../lib/match-tracker-storage";
import { Team, TeamSummary, Match } from "../types/match-tracker";

type TabType = 'overview' | 'fixtures' | 'results' | 'tables' | 'management';

export default function MatchCentral() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [overviewFilter, setOverviewFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Initialize sample data
    storage.initializeSampleData();
    
    // Load teams
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    
    // Load team summaries
    const summaries = loadedTeams
      .map(team => storage.getTeamSummary(team.id))
      .filter(Boolean) as TeamSummary[];
    
    setTeamSummaries(summaries);
    setLoading(false);

    // Handle hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'fixtures', 'results', 'tables', 'management'].includes(hash)) {
      setActiveTab(hash as TabType);
    }
  }, []);

  // Get actual match data for fixtures and results
  const getUpcomingMatches = () => {
    const allMatches = storage.getMatches();
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
    const allMatches = storage.getMatches();
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
  const upcomingMatches = React.useMemo(() => getUpcomingMatches(), [selectedTeam, teams]);
  const recentResults = React.useMemo(() => getRecentResults(), [selectedTeam, teams]);

  // Get filtered results for overview
  const getFilteredOverviewResults = () => {
    const allMatches = storage.getMatches();
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    
    if (overviewFilter === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === overviewFilter);
  };

  const filteredOverviewResults = React.useMemo(() => getFilteredOverviewResults(), [overviewFilter, teams]);

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
    const finishedMatches = storage.getMatches().filter(match => match.status === 'Finished');
    
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', public: true },
    { id: 'fixtures', label: 'Fixtures', icon: '📅', public: true },
    { id: 'results', label: 'Results', icon: '🏆', public: true },
    { id: 'tables', label: 'Tables', icon: '📋', public: true },
    { id: 'management', label: 'Management', icon: '⚙️', public: false }
  ];

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <button
                  onClick={() => handleTabChange('management')}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <span>🔑</span>
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-club-primary text-club-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Team Filter (for management) */}
        {(activeTab === 'management') && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
              >
                <option value="all">All Teams</option>
                {teams.filter(team => !team.isOpponent).map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
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
              className="relative"
            >
              {/* Modern Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30 rounded-2xl"></div>
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.8) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}></div>
              
              <div className="relative z-10">
                {/* Clean Filter Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
                    <label className="text-gray-700 font-medium">Filter by team:</label>
                    <select
                      value={overviewFilter}
                      onChange={(e) => setOverviewFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-club-primary focus:border-club-primary bg-white text-gray-900 hover:border-gray-300 transition-all cursor-pointer shadow-sm min-w-[200px]"
                    >
                      <option value="all">All Teams</option>
                      {teams.filter(team => !team.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modern Results Display */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg overflow-hidden">
                {filteredOverviewResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚽</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet!</h3>
                    <p className="text-gray-600">
                      {overviewFilter === 'all' 
                        ? 'Play some matches and results will appear here!' 
                        : `No results yet for ${teams.find(t => t.id === overviewFilter)?.name || 'this team'}`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredOverviewResults.map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      const result = getMatchResult(match);
                      
                      if (!team) return null;

                      return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className={`p-6 hover:bg-gray-50/80 transition-all duration-200 border-l-4 ${
                            result.result === 'W' ? 'border-l-green-500 hover:border-l-green-600' : 
                            result.result === 'L' ? 'border-l-red-500 hover:border-l-red-600' : 'border-l-yellow-500 hover:border-l-yellow-600'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Match Info - Left Side */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-3 h-3 rounded-full ${match.isHomeMatch ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <span className="text-lg font-bold text-gray-900">{team.name}</span>
                                <span className="text-gray-500 text-lg font-medium">vs</span>
                                <span className="text-lg font-bold text-gray-900">{match.opponent}</span>
                                {match.isHomeMatch && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">🏠 Home</span>}
                                {!match.isHomeMatch && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✈️ Away</span>}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span>📅 {new Date(match.scheduledDate).toLocaleDateString()}</span>
                                <span>🏆 {match.matchType}</span>
                                <span>📍 {match.venue || (match.isHomeMatch ? 'Home' : 'Away')}</span>
                              </div>
                            </div>

                            {/* Score & Result - Right Side */}
                            <div className="flex items-center gap-4">
                              <div className="text-center bg-gray-50 rounded-xl p-3 border border-gray-200">
                                <div className="text-3xl font-bold">
                                  <span className={result.result === 'W' ? 'text-green-600' : result.result === 'L' ? 'text-red-500' : 'text-yellow-600'}>
                                    {result.teamScore}
                                  </span>
                                  <span className="text-gray-400 mx-2">-</span>
                                  <span className="text-gray-700">{result.opponentScore}</span>
                                </div>
                              </div>
                              
                              <div className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                                result.result === 'W' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : result.result === 'L' 
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}>
                                {result.result === 'W' && '✓ Won'}
                                {result.result === 'L' && '○ Lost'}
                                {result.result === 'D' && '= Draw'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Navigation */}
              <div className="mt-6 flex justify-center">
                <div className="flex gap-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg p-3">
                  <button
                    onClick={() => handleTabChange('fixtures')}
                    className="px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center space-x-2 border border-blue-100"
                  >
                    <span>📅</span>
                    <span>View Fixtures</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('tables')}
                    className="px-5 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors flex items-center space-x-2 border border-green-100"
                  >
                    <span>📊</span>
                    <span>League Tables</span>
                  </button>
                </div>
              </div>
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
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
                  <p className="text-gray-600 mb-6">
                    Team management features require authentication. Please log in to access match creation, editing, and team management tools.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">🎯 Management Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create and schedule new matches</li>
                        <li>• Edit match details and results</li>
                        <li>• Manage team rosters and information</li>
                        <li>• Access detailed match statistics</li>
                        <li>• Admin tools for club management</li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="/login"
                        className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center shadow-xl hover:shadow-2xl"
                      >
                        <span className="mr-3 text-xl">🔑</span>
                        <div>
                          <div className="text-lg">Admin Login</div>
                          <div className="text-xs opacity-90">Management Access</div>
                        </div>
                      </a>
                    </div>
                    
                    <div className="text-sm text-gray-500 border-t pt-4 mt-6">
                      <p>Don't have an account? Contact the club administrator to request access.</p>
                    </div>
                  </div>
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
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">📅</span>
                    Upcoming Fixtures
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({upcomingMatches.length} matches)
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {selectedTeam === 'all' ? 'No upcoming fixtures scheduled' : 'No upcoming fixtures for selected team'}
                      </div>
                    ) : (
                      upcomingMatches.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        return (
                          <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                              <div className="text-sm text-gray-600">vs {match.opponent}</div>
                              <div className="text-xs text-club-primary">{match.matchType} • {team?.league}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="font-medium text-gray-900">{match.scheduledDate.toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="text-sm font-medium text-gray-700">{match.isHomeMatch ? 'Home' : 'Away'}</div>
                              <div className="text-xs text-gray-500">{match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={`/matches/${match.id}/record`}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Start Recording
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">🏆</span>
                    Recent Results
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({recentResults.length} matches)
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    {recentResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {selectedTeam === 'all' ? 'No recent results available' : 'No recent results for selected team'}
                      </div>
                    ) : (
                      recentResults.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const result = getMatchResult(match);

                        return (
                          <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                              <div className="text-sm text-gray-600">vs {match.opponent}</div>
                              <div className="text-xs text-gray-500">
                                {match.scheduledDate.toLocaleDateString()} • {match.matchType}
                              </div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="text-2xl font-bold text-gray-900">
                                {result.teamScore} - {result.opponentScore}
                              </div>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                result.result === 'W' ? 'bg-green-100 text-green-800' : 
                                result.result === 'L' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {result.result === 'W' ? 'Won' : result.result === 'L' ? 'Lost' : 'Draw'}
                              </span>
                            </div>
                            <div className="text-center mx-4">
                              <div className="text-sm font-medium text-gray-700">{match.isHomeMatch ? 'Home' : 'Away'}</div>
                              <div className="text-xs text-gray-500">{match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={`/matches/${match.id}/post-match`}
                                className="bg-club-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tables Tab */}
          {activeTab === 'tables' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm border">
                {leagueTable.length === 0 ? (
                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No League Data Yet</h3>
                      <p className="text-gray-600">Complete some matches to see league standings here.</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leagueTable.map((teamStats, index) => (
                          <tr key={teamStats.team.id} className={index < 3 ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                                index < 3 ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{teamStats.team.name}</div>
                              <div className="text-sm text-gray-500">{teamStats.team.league}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{teamStats.played}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">{teamStats.won}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">{teamStats.drawn}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">{teamStats.lost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{teamStats.goalsFor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{teamStats.goalsAgainst}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                              {teamStats.goalDifference > 0 ? '+' : ''}{teamStats.goalDifference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-bold">{teamStats.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
        </div>
      </div>
    </StandardLayout>
  );
}