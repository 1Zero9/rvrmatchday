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
import { storage } from "../lib/match-tracker-storage";
import { Team, TeamSummary, Match } from "../types/match-tracker";

type TabType = 'overview' | 'tracker' | 'fixtures' | 'results' | 'tables';

export default function MatchCentral() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
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
    if (hash && ['overview', 'tracker', 'fixtures', 'results', 'tables'].includes(hash)) {
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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tracker', label: 'Match Tracker', icon: '🎯' },
    { id: 'fixtures', label: 'Fixtures', icon: '📅' },
    { id: 'results', label: 'Results', icon: '🏆' },
    { id: 'tables', label: 'Tables', icon: '📋' }
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
                <a
                  href="/match-admin"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>⚙️</span>
                  <span>Admin</span>
                </a>
                <a
                  href="/matches/new"
                  className="bg-club-primary hover:bg-club-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>New Match</span>
                </a>
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

        {/* Team Filter (for tracker, fixtures, results) */}
        {(activeTab === 'tracker' || activeTab === 'fixtures' || activeTab === 'results') && (
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
            >
              {/* Enhanced Recent Results with Glass Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl"></div>
                <div className="relative bg-white/40 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                      <span className="mr-3 text-4xl">🏆</span>
                      Recent Match Results
                    </h2>
                    <a
                      href="/match-central#results" 
                      className="bg-blue-500/20 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-4 py-2 rounded-xl font-medium hover:bg-blue-500/30 transition-all"
                    >
                      View All Results
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentResults.slice(0, 6).map((match, index) => {
                      const team = teams.find(t => t.id === match.teamId);
                      const result = getMatchResult(match);
                      const expanded = expandedResults[match.id] || false;
                      const toggleExpanded = () => setExpandedResults(prev => ({
                        ...prev,
                        [match.id]: !prev[match.id]
                      }));
                      
                      return (
                        <motion.div 
                          key={match.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={toggleExpanded}
                        >
                          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
                            {/* Main Result Display */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex-1">
                                <div className="font-bold text-lg text-gray-900">{team?.name}</div>
                                <div className="text-gray-600">vs {match.opponent}</div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <span className="mr-1">📅</span>
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </div>
                              </div>
                              
                              {/* Score Display */}
                              <div className="text-center mr-4">
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                  {result.teamScore} - {result.opponentScore}
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                  result.result === 'W' 
                                    ? 'bg-green-100/80 text-green-800 border border-green-200' 
                                    : result.result === 'L' 
                                    ? 'bg-red-100/80 text-red-800 border border-red-200'
                                    : 'bg-yellow-100/80 text-yellow-800 border border-yellow-200'
                                }`}>
                                  {result.result === 'W' ? '🏆 WIN' : result.result === 'L' ? '💔 LOSS' : '🤝 DRAW'}
                                </span>
                              </div>
                              
                              {/* Expand Icon */}
                              <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-400 text-xl"
                              >
                                ⌄
                              </motion.div>
                            </div>
                            
                            {/* Expandable Content */}
                            <motion.div
                              initial={false}
                              animate={{
                                height: expanded ? 'auto' : 0,
                                opacity: expanded ? 1 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-gray-200/50">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Competition:</span>
                                    <div className="font-medium text-gray-900">{match.matchType}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Venue:</span>
                                    <div className="font-medium text-gray-900">
                                      {match.isHomeMatch ? '🏠 ' : '✈️ '}{match.venue || (match.isHomeMatch ? 'Home' : 'Away')}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Time:</span>
                                    <div className="font-medium text-gray-900">
                                      {new Date(match.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Status:</span>
                                    <div className="font-medium text-gray-900">{match.status}</div>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                  <a
                                    href={`/matches/${match.id}/post-match`}
                                    className="bg-blue-500/20 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Details
                                  </a>
                                  <div className="text-xs text-gray-500">
                                    Click to {expanded ? 'collapse' : 'expand'}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {recentResults.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Recent Results</h3>
                      <p className="text-gray-600">Complete some matches to see results here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Fixtures Section */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-8">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📅</span>
                    Next Fixtures
                  </h3>
                  <div className="space-y-3">
                    {upcomingMatches.slice(0, 5).map((match) => {
                      const team = teams.find(t => t.id === match.teamId);
                      return (
                        <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{team?.name}</div>
                            <div className="text-sm text-gray-600">vs {match.opponent}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {match.scheduledDate.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {upcomingMatches.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📅</div>
                      <h4 className="font-medium text-gray-900 mb-1">No Upcoming Fixtures</h4>
                      <p className="text-gray-600 text-sm">Schedule some matches to see them here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/match-admin"
                    className="bg-white/60 backdrop-blur-md border border-white/30 hover:bg-white/80 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                  </a>
                  <a
                    href="/matches/new"
                    className="bg-blue-500/80 backdrop-blur-md border border-blue-200/50 hover:bg-blue-600/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>New Match</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Match Tracker Tab */}
          {activeTab === 'tracker' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {teamSummaries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Team Data Yet</h3>
                  <p className="text-gray-600 mb-6">Create teams and add matches to see tracking information</p>
                  <a
                    href="/match-admin"
                    className="bg-club-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Set Up Teams
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamSummaries.map((summary) => (
                    <div key={summary.team.id} className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{summary.team.name}</h3>
                        <div className="text-xl font-bold text-club-primary">
                          {summary.currentSeason.points} pts
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{summary.currentSeason.won}</div>
                          <div className="text-xs text-gray-500">Won</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">{summary.currentSeason.drawn}</div>
                          <div className="text-xs text-gray-500">Drawn</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{summary.currentSeason.lost}</div>
                          <div className="text-xs text-gray-500">Lost</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 text-xs">
                        <a
                          href={`/teams/${summary.team.id}`}
                          className="flex-1 bg-club-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors"
                        >
                          View Team
                        </a>
                        <a
                          href="/matches/new"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors"
                        >
                          Add Match
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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