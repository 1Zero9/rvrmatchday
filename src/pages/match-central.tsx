/**
 * Unified Match Central Dashboard
 * Consolidates live dashboard, fixtures, results, tables, and match tracker
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tracker', label: 'Match Tracker', icon: '🎯' },
    { id: 'fixtures', label: 'Fixtures', icon: '📅' },
    { id: 'results', label: 'Results', icon: '🏆' },
    { id: 'tables', label: 'Tables', icon: '📋' }
  ] as const;


  const getMatchResult = (match: Match) => {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      return { status: 'unknown', label: 'N/A' };
    }
    
    const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
    const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
    
    if (teamScore > opponentScore) {
      return { status: 'won', label: 'WON' };
    } else if (teamScore === opponentScore) {
      return { status: 'draw', label: 'DRAW' };
    } else {
      return { status: 'lost', label: 'LOST' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'draw': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <StandardLayout title="Match Central">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Match Central...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">⚽</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Match Central</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Your complete matchday hub - tracking, fixtures, results, and stats all in one place
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Team Filter (for tracker, fixtures, results) */}
        {(activeTab === 'tracker' || activeTab === 'fixtures' || activeTab === 'results') && (
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filter by Team:</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Teams</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm opacity-90">Matches Won</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="text-2xl font-bold">{upcomingMatches.length}</div>
                  <div className="text-sm opacity-90">Upcoming</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold">{teams.length}</div>
                  <div className="text-sm opacity-90">Active Teams</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2">⚽</div>
                  <div className="text-2xl font-bold">42</div>
                  <div className="text-sm opacity-90">Goals Scored</div>
                </div>
              </div>

              {/* Recent Results & Upcoming Fixtures */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Recent Results */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🏆</span>
                    Recent Results
                  </h3>
                  <div className="space-y-3">
                    {recentResults.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{match.team}</div>
                          <div className="text-sm text-gray-600">vs {match.opponent}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{match.homeScore}-{match.awayScore}</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(match.status)}`}>
                            {match.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Fixtures */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📅</span>
                    Next Fixtures
                  </h3>
                  <div className="space-y-3">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{match.team}</div>
                          <div className="text-sm text-gray-600">vs {match.opponent}</div>
                          <div className="text-xs text-blue-600">{match.league}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{match.time}</div>
                          <div className="text-sm text-gray-600">{match.venue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Match Tracker Tab */}
          {activeTab === 'tracker' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Match Tracker</h2>
                <div className="flex space-x-3">
                  <a
                    href="/secure-match-recorder"
                    className="bg-club-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-club-secondary transition-colors flex items-center space-x-2"
                  >
                    <span>🔒</span>
                    <span>Secure Recorder</span>
                  </a>
                  <a
                    href="/matches/new"
                    className="bg-club-accent text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    + New Match
                  </a>
                </div>
              </div>

              {teamSummaries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tracked matches yet</h3>
                  <p className="text-gray-600 mb-6">Start tracking matches for your teams.</p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {(selectedTeam === 'all' ? teamSummaries : teamSummaries.filter(s => s.team.id === selectedTeam))
                    .map((summary) => (
                    <div key={summary.team.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{summary.team.name}</h3>
                        <div className="text-2xl font-bold text-green-600">
                          {summary.currentSeason.points} pts
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{summary.currentSeason.won}</div>
                          <div className="text-xs text-gray-600">Won</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{summary.currentSeason.drawn}</div>
                          <div className="text-xs text-gray-600">Drawn</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{summary.currentSeason.lost}</div>
                          <div className="text-xs text-gray-600">Lost</div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Goals: {summary.currentSeason.goalsFor}-{summary.currentSeason.goalsAgainst}</span>
                        <span>{summary.currentSeason.played} played</span>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`/teams`}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 text-center transition-colors"
                        >
                          View Team
                        </a>
                        <a
                          href="/matches/new"
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 text-center transition-colors"
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
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Fixtures</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {selectedTeam === 'all' ? 'No upcoming fixtures scheduled' : 'No upcoming fixtures for selected team'}
                      </div>
                    ) : (
                      upcomingMatches.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        return (
                          <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                              <div className="text-sm text-gray-600">vs {match.opponent}</div>
                              <div className="text-xs text-blue-600">{match.matchType} • {team?.league}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="font-medium">{match.scheduledDate.toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{match.isHomeMatch ? 'Home' : 'Away'}</div>
                              <div className="text-sm text-gray-600">{match.venue}</div>
                              <button 
                                onClick={() => router.push(`/matches/${match.id}/record`)}
                                className="text-sm text-green-600 hover:text-green-700"
                              >
                                Start Recording
                              </button>
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
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Recent Results</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {recentResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {selectedTeam === 'all' ? 'No recent results available' : 'No recent results for selected team'}
                      </div>
                    ) : (
                      recentResults.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const result = getMatchResult(match);
                        const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
                        const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
                        
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
                                {teamScore !== undefined && opponentScore !== undefined 
                                  ? `${teamScore}-${opponentScore}` 
                                  : 'N/A'
                                }
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(result.status)}`}>
                                {result.label}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{match.isHomeMatch ? 'Home' : 'Away'}</div>
                              <div className="text-sm text-gray-600">{match.venue}</div>
                              <button 
                                onClick={() => router.push(`/matches/${match.id}/record`)}
                                className="text-sm text-green-600 hover:text-green-700"
                              >
                                View Details
                              </button>
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
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">League Tables</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            W
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            D
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            L
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            GF
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            GA
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            GD
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leagueTable.map((teamStats, index) => (
                          <tr key={teamStats.team.id} className={index < 3 ? 'bg-green-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                                  index < 3 ? 'bg-green-100 text-green-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {teamStats.team.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {teamStats.team.ageGroup} {teamStats.team.gender}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {teamStats.played}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                              {teamStats.won}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">
                              {teamStats.drawn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                              {teamStats.lost}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {teamStats.goalsFor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {teamStats.goalsAgainst}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <span className={teamStats.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {teamStats.goalDifference >= 0 ? '+' : ''}{teamStats.goalDifference}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                              {teamStats.points}
                            </td>
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
    </StandardLayout>
  );
}